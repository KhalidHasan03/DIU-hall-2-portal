<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use App\Models\MealAttendance;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Transaction;
use App\Services\ActivityLogger;
use App\Services\MealRateService;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MealController extends Controller
{
    public static function autoAttendExpiredMeals(): void
    {
        $today = now()->toDateString();
        $now = now()->format('H:i');

        $cutoffs = [
            'lunch' => Setting::where('key', 'lunch_cutoff_time')->value('value') ?? '12:00',
            'dinner' => Setting::where('key', 'dinner_cutoff_time')->value('value') ?? '14:00',
        ];

        foreach ($cutoffs as $mealType => $cutoff) {
            if ($now < $cutoff) continue;

            $menu = DailyMenu::where('date', $today)->where('meal_type', $mealType)->first();
            if (!$menu) continue;

            $expired = MealAttendance::where('daily_menu_id', $menu->id)
                ->where('status', 'booked')
                ->with('student')
                ->get();

            if ($expired->isEmpty()) continue;

            $mealMonth = now()->format('Y-m');
            $mealRate = MealRateService::calculate($mealMonth);

            foreach ($expired as $attendance) {
                $attendance->update(['status' => 'attended', 'marked_at' => now()]);

                $student = $attendance->student;
                if (!$student || $mealRate <= 0) continue;

                $balanceBefore = (float) $student->balance;
                $student->decrement('balance', $mealRate);
                $student->refresh();
                $balanceAfter = (float) $student->balance;

                if ($balanceAfter < 0) {
                    $student->update(['meal_debt' => abs($balanceAfter)]);
                } elseif ($student->meal_debt > 0) {
                    $student->update(['meal_debt' => 0]);
                }

                Transaction::create([
                    'student_id' => $student->id,
                    'type' => 'debit',
                    'amount' => $mealRate,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $balanceAfter,
                    'description' => ucfirst($mealType) . ' auto-attended on ' . $today,
                    'reference_type' => 'meal_attendance',
                    'reference_id' => $attendance->id,
                    'created_by' => null,
                ]);
            }
        }
    }

    public function book(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'daily_menu_id' => 'required|exists:daily_menus,id',
        ]);

        $student = $request->user()->student;
        if (!$student) {
            return response()->json(['message' => 'Student profile not found.'], 404);
        }

        if ($student->status !== 'approved') {
            return response()->json(['message' => 'Your account is not yet approved.'], 403);
        }

        $menu = DailyMenu::find($validated['daily_menu_id']);
        if ($menu->date->toDateString() !== now()->toDateString()) {
            return response()->json(['message' => 'Can only book meals for today.'], 422);
        }

        $cutoffKey = $menu->meal_type === 'lunch' ? 'lunch_cutoff_time' : 'dinner_cutoff_time';
        $cutoff = Setting::where('key', $cutoffKey)->value('value');
        if ($cutoff && now()->format('H:i') >= $cutoff) {
            return response()->json(['message' => 'Booking is closed for this meal.'], 403);
        }

        try {
            $attendance = MealAttendance::firstOrCreate(
                [
                    'student_id' => $student->id,
                    'daily_menu_id' => $validated['daily_menu_id'],
                ],
                ['status' => 'booked']
            );
        } catch (QueryException $e) {
            return response()->json(['message' => 'Already booked for this meal.'], 422);
        }

        if (!$attendance->wasRecentlyCreated) {
            return response()->json(['message' => 'Already booked for this meal.'], 422);
        }

        return response()->json($attendance, 201);
    }

    public function cancel(Request $request, MealAttendance $mealAttendance): JsonResponse
    {
        $student = $request->user()->student;
        if (!$student || $mealAttendance->student_id !== $student->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($student->status !== 'approved') {
            return response()->json(['message' => 'Your account is not yet approved.'], 403);
        }

        $mealAttendance->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Meal cancelled.']);
    }

    public function todayStatus(Request $request): JsonResponse
    {
        static::autoAttendExpiredMeals();

        $student = $request->user()->student;
        if (!$student) {
            return response()->json([], 200);
        }

        $today = now()->toDateString();
        $menus = DailyMenu::where('date', $today)->get();
        $attendances = MealAttendance::where('student_id', $student->id)
            ->whereIn('daily_menu_id', $menus->pluck('id'))
            ->get()
            ->keyBy('daily_menu_id');

        $lunchCutoff = Setting::where('key', 'lunch_cutoff_time')->value('value') ?? '12:00';
        $dinnerCutoff = Setting::where('key', 'dinner_cutoff_time')->value('value') ?? '14:00';
        $now = now()->format('H:i');

        $result = $menus->map(function ($menu) use ($attendances, $lunchCutoff, $dinnerCutoff, $now) {
            $att = $attendances->get($menu->id);
            $cutoff = $menu->meal_type === 'lunch' ? $lunchCutoff : $dinnerCutoff;
            return [
                'menu' => $menu,
                'status' => $att ? $att->status : null,
                'attendance_id' => $att ? $att->id : null,
                'cutoff_time' => $cutoff,
                'can_toggle' => $now < $cutoff,
            ];
        });

        return response()->json($result);
    }

    public function history(Request $request): JsonResponse
    {
        static::autoAttendExpiredMeals();

        $student = $request->user()->student;
        if (!$student) {
            return response()->json([], 200);
        }

        $validated = $request->validate([
            'month' => 'sometimes|string|regex:/^\d{4}-\d{2}$/',
        ]);
        $month = $validated['month'] ?? now()->format('Y-m');
        [$year, $monthNum] = explode('-', $month);

        $attendances = MealAttendance::where('student_id', $student->id)
            ->whereHas('dailyMenu', function ($q) use ($year, $monthNum) {
                $q->whereYear('date', $year)->whereMonth('date', $monthNum);
            })
            ->with('dailyMenu')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($attendances);
    }

    public function markAttendance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'attendances' => 'required|array',
            'attendances.*.id' => 'required|exists:meal_attendance,id',
            'attendances.*.status' => 'required|in:attended,cancelled',
        ]);

        $userId = $request->user()->id;

        DB::transaction(function () use ($validated, $userId) {
            foreach ($validated['attendances'] as $att) {
                $record = MealAttendance::with('dailyMenu', 'student')->find($att['id']);
                if (!$record || !$record->dailyMenu) continue;

                $mealMonth = $record->dailyMenu->date->format('Y-m');
                $mealRate = MealRateService::calculate($mealMonth);

                $wasAlreadyAttended = $record->status === 'attended';
                $newStatus = $att['status'];

                $record->update([
                    'status' => $newStatus,
                    'marked_by' => $userId,
                    'marked_at' => now(),
                ]);

                if ($newStatus === 'attended' && !$wasAlreadyAttended) {
                    $price = $mealRate;
                    $student = $record->student;

                    if ($student && $price > 0) {
                        $balanceBefore = (float) $student->balance;
                        $student->decrement('balance', $price);
                        $student->refresh();
                        $balanceAfter = (float) $student->balance;

                        if ($balanceAfter < 0) {
                            $student->update(['meal_debt' => abs($balanceAfter)]);
                        } elseif ($student->meal_debt > 0) {
                            $student->update(['meal_debt' => 0]);
                        }

                        Transaction::create([
                            'student_id' => $student->id,
                            'type' => 'debit',
                            'amount' => $price,
                            'balance_before' => $balanceBefore,
                            'balance_after' => $balanceAfter,
                            'description' => ucfirst($record->dailyMenu->meal_type) . ' meal on ' . $record->dailyMenu->date->toDateString(),
                            'reference_type' => 'meal_attendance',
                            'reference_id' => $record->id,
                            'created_by' => $userId,
                        ]);
                    }
                }
            }
        });

        $attendedCount = collect($validated['attendances'])->filter(fn($a) => $a['status'] === 'attended')->count();

        ActivityLogger::log(
            $request->user(),
            "marked attendance for {$attendedCount} students",
            'meal_attendance',
            null,
            null,
            ['attended_count' => $attendedCount],
            $request
        );

        return response()->json(['message' => 'Attendance marked.']);
    }

    public function dailyReport(Request $request): JsonResponse
    {
        static::autoAttendExpiredMeals();
        $date = $request->input('date', now()->toDateString());

        $menus = DailyMenu::where('date', $date)->get();
        $result = [];

        foreach ($menus as $menu) {
            $total = MealAttendance::where('daily_menu_id', $menu->id)->count();
            $booked = MealAttendance::where('daily_menu_id', $menu->id)->where('status', 'booked')->count();
            $attended = MealAttendance::where('daily_menu_id', $menu->id)->where('status', 'attended')->count();
            $cancelled = MealAttendance::where('daily_menu_id', $menu->id)->where('status', 'cancelled')->count();

            $result[] = [
                'menu' => $menu,
                'total' => $total,
                'booked' => $booked,
                'attended' => $attended,
                'cancelled' => $cancelled,
            ];
        }

        return response()->json($result);
    }

    public function todayStatusAll(Request $request): JsonResponse
    {
        $date = now()->toDateString();
        $students = Student::where('status', 'approved')->with('user')->get();

        $lunchMenu = DailyMenu::firstOrCreate(
            ['date' => $date, 'meal_type' => 'lunch'],
            ['menu_text' => 'General', 'created_by' => $request->user()->id]
        );
        $dinnerMenu = DailyMenu::firstOrCreate(
            ['date' => $date, 'meal_type' => 'dinner'],
            ['menu_text' => 'General', 'created_by' => $request->user()->id]
        );

        $lunchOn = MealAttendance::where('daily_menu_id', $lunchMenu->id)
            ->whereIn('status', ['booked', 'attended'])->pluck('student_id')->toArray();
        $dinnerOn = MealAttendance::where('daily_menu_id', $dinnerMenu->id)
            ->whereIn('status', ['booked', 'attended'])->pluck('student_id')->toArray();

        $lunchCutoff = Setting::where('key', 'lunch_cutoff_time')->value('value') ?? '12:00';
        $dinnerCutoff = Setting::where('key', 'dinner_cutoff_time')->value('value') ?? '14:00';

        return response()->json([
            'students' => $students->map(function ($student) use ($lunchOn, $dinnerOn) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'room_number' => $student->room_number,
                    'lunch_on' => in_array($student->id, $lunchOn),
                    'dinner_on' => in_array($student->id, $dinnerOn),
                ];
            }),
            'cutoffs' => [
                'lunch_cutoff_time' => $lunchCutoff,
                'dinner_cutoff_time' => $dinnerCutoff,
            ],
        ]);
    }

    public function toggle(Request $request): JsonResponse
    {
        static::autoAttendExpiredMeals();
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'meal_type' => 'required|in:lunch,dinner',
            'action' => 'required|in:on,off',
        ]);

        $date = now()->toDateString();
        $menu = DailyMenu::firstOrCreate(
            ['date' => $date, 'meal_type' => $validated['meal_type']],
            ['menu_text' => 'General', 'created_by' => $request->user()->id]
        );

        $attendance = MealAttendance::where('student_id', $validated['student_id'])
            ->where('daily_menu_id', $menu->id)
            ->first();

        $student = Student::find($validated['student_id']);
        $studentName = $student?->user?->name ?? "Student #{$validated['student_id']}";

        if ($validated['action'] === 'on') {
            if ($attendance && $attendance->status === 'attended') {
                return response()->json(['message' => 'Meal already attended.'], 422);
            }
            if ($attendance && $attendance->status === 'cancelled') {
                $attendance->update(['status' => 'booked']);
            } elseif (!$attendance) {
                $attendance = MealAttendance::create([
                    'student_id' => $validated['student_id'],
                    'daily_menu_id' => $menu->id,
                    'status' => 'booked',
                ]);
            }

            ActivityLogger::log(
                $request->user(),
                "turned on {$validated['meal_type']} for {$studentName}",
                'meal_attendance',
                $attendance->id,
                null,
                $validated,
                $request
            );

            return response()->json(['status' => 'booked', 'attendance_id' => $attendance->id]);
        }

        if (!$attendance) {
            return response()->json(['message' => 'No booking found to cancel.'], 422);
        }
        if ($attendance->status === 'attended') {
            return response()->json(['message' => 'Meal already attended. Cannot cancel.'], 422);
        }
        if ($attendance->status === 'booked') {
            $attendance->update(['status' => 'cancelled']);
        }

        ActivityLogger::log(
            $request->user(),
            "turned off {$validated['meal_type']} for {$studentName}",
            'meal_attendance',
            $attendance->id,
            null,
            $validated,
            $request
        );

        return response()->json(['status' => 'cancelled', 'attendance_id' => $attendance->id]);
    }

    public function studentToggle(Request $request): JsonResponse
    {
        static::autoAttendExpiredMeals();

        $student = $request->user()->student;
        if (!$student) {
            return response()->json(['message' => 'Student profile not found.'], 404);
        }

        if ($student->status !== 'approved') {
            return response()->json(['message' => 'Your account is not yet approved.'], 403);
        }

        $validated = $request->validate([
            'meal_type' => 'required|in:lunch,dinner',
            'action' => 'required|in:on,off',
        ]);

        $cutoffKey = $validated['meal_type'] === 'lunch' ? 'lunch_cutoff_time' : 'dinner_cutoff_time';
        $cutoff = Setting::where('key', $cutoffKey)->value('value');

        if ($cutoff) {
            $now = now()->format('H:i');
            if ($now >= $cutoff) {
                $mealLabel = ucfirst($validated['meal_type']);
                return response()->json([
                    'message' => "{$mealLabel} booking is closed after {$cutoff}. Please toggle before the cutoff time.",
                ], 403);
            }
        }

        $date = now()->toDateString();
        $menu = DailyMenu::firstOrCreate(
            ['date' => $date, 'meal_type' => $validated['meal_type']],
            ['menu_text' => 'General', 'created_by' => $request->user()->id]
        );

        $attendance = MealAttendance::where('student_id', $student->id)
            ->where('daily_menu_id', $menu->id)
            ->first();

        if ($validated['action'] === 'on') {
            if ($attendance && $attendance->status === 'attended') {
                return response()->json(['message' => 'Meal already attended. Cannot toggle.'], 422);
            }
            if ($attendance && $attendance->status === 'cancelled') {
                $attendance->update(['status' => 'booked']);
            } elseif (!$attendance) {
                $attendance = MealAttendance::create([
                    'student_id' => $student->id,
                    'daily_menu_id' => $menu->id,
                    'status' => 'booked',
                ]);
            }
            return response()->json(['status' => 'booked', 'attendance_id' => $attendance->id]);
        }

        if ($attendance && $attendance->status === 'booked') {
            $attendance->update(['status' => 'cancelled']);
        } elseif ($attendance && $attendance->status === 'attended') {
            return response()->json(['message' => 'Meal already attended. Cannot cancel.'], 422);
        }
        return response()->json(['status' => 'cancelled', 'attendance_id' => $attendance?->id]);
    }
}
