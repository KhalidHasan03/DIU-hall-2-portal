<?php

namespace Database\Seeders;

use App\Models\DailyMenu;
use App\Models\MealAttendance;
use App\Models\MonthlyBill;
use App\Models\Payment;
use App\Models\Student;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $managerId = \App\Models\User::where('email', 'manager@hmems.local')->value('id');
        if (!$managerId) return;

        $today = now();

        for ($i = -7; $i <= 7; $i++) {
            $date = $today->copy()->addDays($i)->toDateString();

            DailyMenu::firstOrCreate(
                ['date' => $date, 'meal_type' => 'lunch'],
                ['menu_text' => fake()->randomElement(['Rice, Dal, Chicken Curry', 'Rice, Fish Curry, Dal', 'Biryani, Salad', 'Khichuri, Begun Bhaji', 'Rice, Beef Curry, Vegetable']), 'created_by' => $managerId]
            );

            DailyMenu::firstOrCreate(
                ['date' => $date, 'meal_type' => 'dinner'],
                ['menu_text' => fake()->randomElement(['Roti, Beef Curry', 'Polao, Chicken Roast', 'Ruti, Vegetable Curry', 'Fried Rice, Egg', 'Paratha, Dal']), 'created_by' => $managerId]
            );
        }

        $students = Student::all();
        foreach ($students as $student) {
            for ($i = 0; $i < 5; $i++) {
                $date = $today->copy()->subDays($i + 1);
                foreach (['lunch', 'dinner'] as $type) {
                    $menu = DailyMenu::where('date', $date->toDateString())->where('meal_type', $type)->first();
                    if ($menu && rand(0, 1)) {
                        MealAttendance::firstOrCreate(
                            ['student_id' => $student->id, 'daily_menu_id' => $menu->id],
                            ['status' => rand(0, 3) ? 'attended' : 'cancelled', 'marked_by' => $managerId, 'marked_at' => $date]
                        );
                    }
                }
            }

            $month = $today->format('Y-m');
            [$year, $monthNum] = explode('-', $month);
            $lunches = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'lunch')->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();
            $dinners = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'dinner')->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();

            $lunchPrice = 50;
            $dinnerPrice = 60;
            $total = ($lunches * $lunchPrice) + ($dinners * $dinnerPrice);

            if ($total > 0) {
                $bill = MonthlyBill::firstOrCreate(
                    ['student_id' => $student->id, 'month' => $month],
                    [
                        'total_lunches' => $lunches,
                        'total_dinners' => $dinners,
                        'lunch_amount' => $lunches * $lunchPrice,
                        'dinner_amount' => $dinners * $dinnerPrice,
                        'total_amount' => $total,
                        'status' => 'pending',
                        'generated_by' => $managerId,
                    ]
                );

                if ($bill && rand(0, 1)) {
                    $paidAmount = rand(0, 1) ? $total : $total / 2;
                    Payment::create([
                        'monthly_bill_id' => $bill->id,
                        'student_id' => $student->id,
                        'amount' => $paidAmount,
                        'payment_method' => 'cash',
                        'paid_at' => $today,
                        'recorded_by' => $managerId,
                    ]);
                    $bill->update(['status' => $paidAmount >= $total ? 'paid' : 'partial']);
                }
            }
        }
    }
}
