<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\MonthlyBill;
use App\Models\Student;
use App\Models\Transaction;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TutorDashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $month = now()->format('Y-m');
        [$year, $monthNum] = explode('-', $month);

        $totalStudents = Student::where('status', 'approved')->count();
        $totalCollection = round((float) Transaction::where('type', 'credit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount'), 2);
        $totalExpenses = round((float) Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $monthNum)->sum('amount'), 2);
        $pendingStudents = Student::where('status', 'pending')->count();
        $pendingReports = MonthlyBill::where('month', $month)
            ->where('status', 'pending')->count();

        $dueStudents = MonthlyBill::where('month', $month)
            ->with('student.user')
            ->get()
            ->filter(function ($bill) {
                $wallet = round((float) ($bill->student?->balance ?? 0), 2);
                return round((float) $bill->total_amount - $wallet, 2) > 0;
            })
            ->sortByDesc(function ($bill) {
                $wallet = round((float) ($bill->student?->balance ?? 0), 2);
                return round((float) $bill->total_amount - $wallet, 2);
            })
            ->take(10)
            ->values()
            ->map(function ($bill) {
                $wallet = round((float) ($bill->student?->balance ?? 0), 2);
                $due = round(max(0, (float) $bill->total_amount - $wallet), 2);
                return [
                    'student_name' => $bill->student->user->name,
                    'room_number' => $bill->student->room_number,
                    'total_amount' => round((float) $bill->total_amount, 2),
                    'wallet_balance' => $wallet,
                    'paid' => round(min((float) $bill->total_amount, $wallet), 2),
                    'due' => $due,
                ];
            });

        $recentActivities = ActivityLog::with('user')
            ->latest()->take(10)->get();

        return response()->json([
            'total_students' => $totalStudents,
            'total_collection' => $totalCollection,
            'total_expenses' => $totalExpenses,
            'net_profit' => round($totalCollection - $totalExpenses, 2),
            'pending_reports' => $pendingReports,
            'pending_students' => $pendingStudents,
            'due_students' => $dueStudents,
            'recent_activities' => $recentActivities,
        ]);
    }
}
