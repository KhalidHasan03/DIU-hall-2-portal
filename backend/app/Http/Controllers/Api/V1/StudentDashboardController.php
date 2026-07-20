<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use App\Models\MealAttendance;
use App\Models\MonthlyBill;
use App\Models\Notice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $student = $request->user()->student;
        $today = now()->toDateString();
        $month = now()->format('Y-m');

        $todayMenus = DailyMenu::where('date', $today)->get();
        $todayMeals = collect();
        if ($student) {
            $todayMeals = MealAttendance::where('student_id', $student->id)
                ->whereIn('daily_menu_id', $todayMenus->pluck('id'))
                ->get()
                ->keyBy('daily_menu_id');
        }

        $todayMealStatus = $todayMenus->map(function ($menu) use ($todayMeals) {
            $att = $todayMeals->get($menu->id);
            return [
                'menu_id' => $menu->id,
                'meal_type' => $menu->meal_type,
                'menu_text' => $menu->menu_text,
                'status' => $att ? $att->status : null,
                'attendance_id' => $att ? $att->id : null,
            ];
        });

        $currentBill = null;
        $totalPaid = 0;
        if ($student) {
            $currentBill = MonthlyBill::where('student_id', $student->id)
                ->where('month', $month)
                ->first();
            $totalPaid = $currentBill ? $currentBill->payments()->sum('amount') : 0;
        }

        $mealStats = [];
        if ($student) {
            [$year, $monthNum] = explode('-', $month);
            $totalMonthMeals = MealAttendance::where('student_id', $student->id)
                ->whereIn('status', ['booked', 'attended'])
                ->whereHas('dailyMenu', function ($q) use ($year, $monthNum) {
                    $q->whereYear('date', $year)->whereMonth('date', $monthNum);
                })->count();
            $attendedMeals = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', function ($q) use ($year, $monthNum) {
                    $q->whereYear('date', $year)->whereMonth('date', $monthNum);
                })->count();
            $mealStats = [
                'total' => $totalMonthMeals,
                'attended' => $attendedMeals,
                'cancelled' => MealAttendance::where('student_id', $student->id)
                    ->where('status', 'cancelled')
                    ->whereHas('dailyMenu', function ($q) use ($year, $monthNum) {
                        $q->whereYear('date', $year)->whereMonth('date', $monthNum);
                    })->count(),
            ];
        }

        $notices = Notice::where('is_active', true)
            ->where(function ($q) {
                $q->where('target_role', 'all')->orWhere('target_role', 'student');
            })
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'content', 'created_at']);

        return response()->json([
            'today_meals' => $todayMealStatus,
            'lunch_status' => $todayMealStatus->firstWhere('meal_type', 'lunch')['status'] ?? null,
            'dinner_status' => $todayMealStatus->firstWhere('meal_type', 'dinner')['status'] ?? null,
            'current_bill' => $currentBill,
            'paid_amount' => $totalPaid,
            'due_amount' => $currentBill ? max(0, $currentBill->total_amount - $totalPaid) : 0,
            'meal_stats' => $mealStats,
            'notices' => $notices,
            'student_name' => $request->user()->name,
            'wallet_balance' => $student ? (float) $student->balance : 0,
        ]);
    }
}
