<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\MonthlyBill;
use App\Models\Payment;
use App\Models\Student;
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
        $totalCollection = Payment::whereYear('paid_at', $year)->whereMonth('paid_at', $monthNum)->sum('amount');
        $totalExpenses = Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $monthNum)->sum('amount');
        $pendingStudents = Student::where('status', 'pending')->count();
        $pendingReports = MonthlyBill::where('month', $month)
            ->where('status', 'pending')->count();

        $dueStudents = MonthlyBill::where('month', $month)
            ->whereIn('status', ['pending', 'partial', 'overdue'])
            ->with('student.user')
            ->orderBy('total_amount', 'desc')
            ->take(10)
            ->get()
            ->map(function ($bill) {
                $paid = $bill->payments()->sum('amount');
                return [
                    'student_name' => $bill->student->user->name,
                    'room_number' => $bill->student->room_number,
                    'total_amount' => $bill->total_amount,
                    'paid' => $paid,
                    'due' => max(0, $bill->total_amount - $paid),
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
