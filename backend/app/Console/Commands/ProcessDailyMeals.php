<?php

namespace App\Console\Commands;

use App\Models\MealAttendance;
use App\Models\Setting;
use App\Models\Transaction;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ProcessDailyMeals extends Command
{
    protected $signature = 'meals:process-day {--date= : Process meals for a specific date (Y-m-d). Defaults to yesterday.}';
    protected $description = 'Auto-mark booked meals as attended at day end and deduct from wallet';

    public function handle(): int
    {
        $date = $this->option('date') ?: now()->subDay()->toDateString();

        $lunchPrice = (float) (Setting::where('key', 'lunch_price')->value('value') ?? 50);
        $dinnerPrice = (float) (Setting::where('key', 'dinner_price')->value('value') ?? 60);

        $bookedRecords = MealAttendance::whereHas('dailyMenu', function ($q) use ($date) {
            $q->whereDate('date', $date);
        })->where('status', 'booked')
          ->with('dailyMenu', 'student')
          ->get();

        if ($bookedRecords->isEmpty()) {
            $this->info("No booked meals found for {$date}.");
            return 0;
        }

        $processed = 0;
        $errors = 0;

        foreach ($bookedRecords as $record) {
            DB::transaction(function () use ($record, $lunchPrice, $dinnerPrice, $date, &$processed, &$errors) {
                try {
                    $price = $record->dailyMenu->meal_type === 'lunch' ? $lunchPrice : $dinnerPrice;
                    $student = $record->student;

                    if (!$student) {
                        $errors++;
                        return;
                    }

                    $balanceBefore = $student->balance;
                    $student->decrement('balance', $price);

                    $record->update([
                        'status' => 'attended',
                        'marked_at' => now(),
                    ]);

                    Transaction::create([
                        'student_id' => $student->id,
                        'type' => 'debit',
                        'amount' => $price,
                        'balance_before' => $balanceBefore,
                        'balance_after' => $student->fresh()->balance,
                        'description' => 'Auto: ' . ucfirst($record->dailyMenu->meal_type) . ' meal on ' . $date,
                        'reference_type' => 'meal_attendance',
                        'reference_id' => $record->id,
                    ]);

                    $processed++;
                } catch (\Exception $e) {
                    $errors++;
                    $this->error("Error processing attendance ID {$record->id}: {$e->getMessage()}");
                }
            });
        }

        $this->info("Processed {$processed} meals for {$date}" . ($errors ? " ({$errors} errors)" : ""));
        return 0;
    }
}
