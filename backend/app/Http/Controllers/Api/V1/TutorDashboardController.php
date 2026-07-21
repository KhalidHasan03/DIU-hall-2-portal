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
        $totalCollection = Transaction::where('type', 'credit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount');
        $totalExpenses = Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $monthNum)->sum('amount');
        $pendingStudents = Student::where('status', 'pending')->count();
        $pendingReports = MonthlyBill::where('month', $month)
            ->where('status', 'pending')->count();

        $dueStudents = MonthlyBill::where('month', $month)
            ->with('student.user')
            ->get()
            ->filter(function ($bill) {
                $wallet = (float) ($bill->student?->balance ?? 0);
                return (float) $bill->total_amount > $wallet;
            })
            ->sortByDesc(function ($bill) {
                $wallet = (float) ($bill->student?->balance ?? 0);
                return (float) $bill->total_amount - $wallet;
            })
            ->take(10)
            ->values()
            ->map(function ($bill) {
                $wallet = (float) ($bill->student?->balance ?? 0);
                $due = max(0, (float) $bill->total_amount - $wallet);
                return [
                    'student_name' => $bill->student->user->name,
                    'room_number' => $bill->student->room_number,
                    'total_amount' => $bill->total_amount,
                    'wallet_balance' => $wallet,
                    'paid' => min((float) $bill->total_amount, $wallet),
                    'due' => $due,
                ];
            });

        $recentActivities = ActivityLog::with('user')
            ->latest()->take(10)->get();

        return response()->json([
            'total_students' => $totalStudents,
            'total_collection' => $totalCollection,
            'total_expenses' => $totalExpenses,
            'net_profit' => $totalCollection - $totalExpenses,
            'pending_reports' => $pendingReports,
            'pending_students' => $pendingStudents,
            'due_students' => $dueStudents,
            'recent_activities' => $recentActivities,
        ]);
    }
}
