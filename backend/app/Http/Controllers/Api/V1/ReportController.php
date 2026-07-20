<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\MonthlyBill;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function monthly(Request $request): JsonResponse
    {
        $month = $request->input('month', now()->format('Y-m'));
        [$year, $monthNum] = explode('-', $month);

        $totalBills = MonthlyBill::where('month', $month)->sum('total_amount');
        $totalPaid = Payment::whereYear('paid_at', $year)->whereMonth('paid_at', $monthNum)->sum('amount');
        $totalExpenses = Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $monthNum)->sum('amount');
        $studentCount = MonthlyBill::where('month', $month)->count();
        $paidCount = MonthlyBill::where('month', $month)->where('status', 'paid')->count();
        $pendingCount = MonthlyBill::where('month', $month)->whereIn('status', ['pending', 'partial', 'overdue'])->count();

        return response()->json([
            'month' => $month,
            'total_bills' => $totalBills,
            'total_collected' => $totalPaid,
            'total_expenses' => $totalExpenses,
            'net_profit' => $totalPaid - $totalExpenses,
            'total_students' => $studentCount,
            'paid_students' => $paidCount,
            'pending_students' => $pendingCount,
        ]);
    }

    public function incomeVsExpense(Request $request): JsonResponse
    {
        $year = $request->input('year', now()->format('Y'));
        $months = [];

        for ($i = 1; $i <= 12; $i++) {
            $m = sprintf('%s-%02d', $year, $i);
            $income = Payment::whereYear('paid_at', $year)->whereMonth('paid_at', $i)->sum('amount');
            $expense = Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $i)->sum('amount');
            $months[] = [
                'month' => $m,
                'income' => $income,
                'expense' => $expense,
            ];
        }

        return response()->json($months);
    }
}
