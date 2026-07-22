<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use App\Models\Expense;
use App\Models\MealAttendance;
use App\Models\MonthlyBill;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ManagerDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $month = now()->format('Y-m');
        [$year, $monthNum] = explode('-', $month);
        $today = now()->toDateString();

        $totalStudents = Student::where('status', 'approved')->count();
        $totalCollection = round((float) Transaction::where('type', 'credit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)->sum('amount'), 2);
        $totalExpenses = round((float) Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $monthNum)->sum('amount'), 2);

        $totalDue = round(MonthlyBill::where('month', $month)->get()->sum(function ($bill) {
            $student = $bill->student;
            $wallet = $student ? round((float) $student->balance, 2) : 0;
            return round(max(0, (float) $bill->total_amount - $wallet), 2);
        }), 2);

        $totalMonthlyMeals = MealAttendance::whereHas('dailyMenu', function ($q) use ($year, $monthNum) {
            $q->whereYear('date', $year)->whereMonth('date', $monthNum);
        })->whereIn('status', ['booked', 'attended'])->count();

        $recentPayments = Transaction::where('type', 'credit')
            ->with('student.user', 'creator')
            ->latest()->take(5)->get();
        $recentExpenses = Expense::latest()->take(5)->get();

        $lunchMenu = DailyMenu::whereDate('date', $today)->where('meal_type', 'lunch')->first();
        $dinnerMenu = DailyMenu::whereDate('date', $today)->where('meal_type', 'dinner')->first();

        $pendingStudents = Student::where('status', 'pending')->count();

        $lunchCutoff = Setting::where('key', 'lunch_cutoff_time')->value('value') ?? '12:00';
        $dinnerCutoff = Setting::where('key', 'dinner_cutoff_time')->value('value') ?? '14:00';

        $todayLunchOn = $lunchMenu
            ? MealAttendance::where('daily_menu_id', $lunchMenu->id)->whereIn('status', ['booked', 'attended'])->count()
            : 0;
        $todayDinnerOn = $dinnerMenu
            ? MealAttendance::where('daily_menu_id', $dinnerMenu->id)->whereIn('status', ['booked', 'attended'])->count()
            : 0;

        return response()->json([
            'total_students' => $totalStudents,
            'total_collection' => $totalCollection,
            'total_expenses' => $totalExpenses,
            'net_balance' => round($totalCollection - $totalExpenses, 2),
            'total_due' => $totalDue,
            'total_monthly_meals' => $totalMonthlyMeals,
            'pending_students' => $pendingStudents,
            'lunch_cutoff' => $lunchCutoff,
            'dinner_cutoff' => $dinnerCutoff,
            'recent_payments' => $recentPayments,
            'recent_expenses' => $recentExpenses,
            'today_lunch_on' => $todayLunchOn,
            'today_dinner_on' => $todayDinnerOn,
        ]);
    }
}
