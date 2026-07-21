<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use App\Models\MealAttendance;
use App\Models\MonthlyBill;
use App\Models\Notice;
use App\Models\Student;
use App\Services\MealRateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $student = $request->user()->student;
        $today = now()->toDateString();
        $month = $request->input('month', now()->format('Y-m'));
        [$year, $monthNum] = explode('-', $month);

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
        $walletBalance = $student ? (float) $student->balance : 0;
        if ($student) {
            $currentBill = MonthlyBill::where('student_id', $student->id)
                ->where('month', $month)
                ->first();
            if ($currentBill) {
                $walletCovered = min((float) $currentBill->total_amount, $walletBalance);
                $totalPaid = $walletCovered;
            }
        }

        $mealStats = [];
        if ($student) {
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

        $mealRate = MealRateService::calculate($month);
        $totalExpenses = (float) \App\Models\Expense::whereYear('expense_date', $year)
            ->whereMonth('expense_date', $monthNum)->sum('amount');
        $totalAttendedMeals = MealAttendance::where('status', 'attended')
            ->whereHas('dailyMenu', fn($q) => $q->whereYear('date', $year)->whereMonth('date', $monthNum))
            ->count();

        $totalStudents = Student::where('status', 'approved')->count();
        $myDueRank = null;
        if ($student) {
            $allDues = MonthlyBill::where('month', $month)->get()->map(function ($b) {
                $wallet = $b->student ? (float) $b->student->balance : 0;
                return ['student_id' => $b->student_id, 'due' => max(0, (float) $b->total_amount - $wallet)];
            })->sortByDesc('due')->values();
            $myDueRank = $allDues->search(function ($d) use ($student) {
                return $d['student_id'] === $student->id;
            });
            $myDueRank = $myDueRank !== false ? $myDueRank + 1 : null;
        }

        $notices = Notice::where('is_active', true)
            ->where(function ($q) {
                $q->where('target_role', 'all')->orWhere('target_role', 'student');
            })
            ->latest()
            ->take(5)
            ->get(['id', 'title', 'content', 'created_at']);

        $mealDebt = $student ? (float) $student->meal_debt : 0;

        return response()->json([
            'month' => $month,
            'today_meals' => $todayMealStatus,
            'lunch_status' => $todayMealStatus->firstWhere('meal_type', 'lunch')['status'] ?? null,
            'dinner_status' => $todayMealStatus->firstWhere('meal_type', 'dinner')['status'] ?? null,
            'current_bill' => $currentBill,
            'paid_amount' => $totalPaid,
            'due_amount' => $currentBill ? max(0, $currentBill->total_amount - $totalPaid) : 0,
            'meal_stats' => $mealStats,
            'notices' => $notices,
            'student_name' => $request->user()->name,
            'wallet_balance' => $walletBalance,
            'meal_debt' => $mealDebt,
            'meal_rate' => $mealRate,
            'total_expenses' => $totalExpenses,
            'total_attended_meals' => $totalAttendedMeals,
            'total_students' => $totalStudents,
            'my_due_rank' => $myDueRank,
        ]);
    }
}
