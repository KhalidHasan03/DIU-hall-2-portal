<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use App\Models\Expense;
use App\Models\MealAttendance;
use App\Models\MonthlyBill;
use App\Models\Student;
use App\Models\Transaction;
use App\Services\MealRateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function monthly(Request $request): JsonResponse
    {
        $month = $request->input('month', now()->format('Y-m'));
        [$year, $monthNum] = explode('-', $month);

        $totalBills = round((float) MonthlyBill::where('month', $month)->sum('total_amount'), 2);
        $totalWalletCredits = round((float) Transaction::where('type', 'credit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount'), 2);
        $totalExpenses = round((float) Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $monthNum)->sum('amount'), 2);
        $studentCount = MonthlyBill::where('month', $month)->count();
        $paidCount = MonthlyBill::where('month', $month)->where('status', 'paid')->count();
        $pendingCount = MonthlyBill::where('month', $month)->whereIn('status', ['pending', 'partial', 'overdue'])->count();

        $totalMealDeductions = round((float) Transaction::where('type', 'debit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount'), 2);

        // Wallet-based due: for each student, bill_total - wallet_balance (if positive)
        $students = Student::where('status', 'approved')->get();
        $totalDue = 0;
        $totalGetBack = 0;
        foreach ($students as $student) {
            $bill = MonthlyBill::where('student_id', $student->id)->where('month', $month)->first();
            if (!$bill) continue;
            $wallet = round((float) $student->balance, 2);
            $billTotal = round((float) $bill->total_amount, 2);
            $totalDue += round(max(0, $billTotal - $wallet), 2);
            $totalGetBack += round(max(0, $wallet - $billTotal), 2);
        }
        $totalDue = round($totalDue, 2);
        $totalGetBack = round($totalGetBack, 2);

        $totalLunches = MealAttendance::where('status', 'attended')
            ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'lunch')->whereYear('date', $year)->whereMonth('date', $monthNum))
            ->count();
        $totalDinners = MealAttendance::where('status', 'attended')
            ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'dinner')->whereYear('date', $year)->whereMonth('date', $monthNum))
            ->count();

        return response()->json([
            'month' => $month,
            'total_bills' => $totalBills,
            'total_collected' => $totalWalletCredits,
            'total_expenses' => $totalExpenses,
            'net_profit' => round($totalWalletCredits - $totalExpenses, 2),
            'total_students' => $studentCount,
            'paid_students' => $paidCount,
            'pending_students' => $pendingCount,
            'wallet_credits' => $totalWalletCredits,
            'meal_deductions' => $totalMealDeductions,
            'total_due' => $totalDue,
            'total_get_back' => $totalGetBack,
            'total_lunches' => $totalLunches,
            'total_dinners' => $totalDinners,
            'total_meals' => $totalLunches + $totalDinners,
        ]);
    }

    public function detailed(Request $request): JsonResponse
    {
        $month = $request->input('month', now()->format('Y-m'));
        [$year, $monthNum] = explode('-', $month);

        $mealRate = MealRateService::calculate($month);

        $students = Student::with('user')->where('status', 'approved')->get();
        $result = [];

        foreach ($students as $student) {
            $totalMeals = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();

            $mealCost = round($totalMeals * $mealRate, 2);

            $walletCredits = round((float) Transaction::where('student_id', $student->id)
                ->where('type', 'credit')
                ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
                ->sum('amount'), 2);

            $walletBalance = round((float) $student->balance, 2);
            $bill = MonthlyBill::where('student_id', $student->id)->where('month', $month)->first();
            $billTotal = $bill ? round((float) $bill->total_amount, 2) : 0;
            $billPaid = round(min($billTotal, $walletBalance), 2);
            $billDue = round(max(0, $billTotal - $walletBalance), 2);
            $getBack = round(max(0, $walletBalance - $billTotal), 2);

            $result[] = [
                'id' => $student->id,
                'name' => $student->user->name,
                'student_id' => $student->student_id,
                'room_number' => $student->room_number,
                'balance' => $walletBalance,
                'total_meals' => $totalMeals,
                'meal_cost' => $mealCost,
                'wallet_credits' => $walletCredits,
                'bill_total' => $billTotal,
                'bill_paid' => $billPaid,
                'bill_due' => $billDue,
                'get_back' => $getBack,
            ];
        }

        return response()->json([
            'month' => $month,
            'meal_rate' => $mealRate,
            'students' => $result,
            'totals' => [
                'students' => count($result),
                'total_meals' => collect($result)->sum('total_meals'),
                'meal_costs' => round(collect($result)->sum('meal_cost'), 2),
                'wallet_credits' => round(collect($result)->sum('wallet_credits'), 2),
                'bill_totals' => round(collect($result)->sum('bill_total'), 2),
                'bill_paid' => round(collect($result)->sum('bill_paid'), 2),
                'bill_due' => round(collect($result)->sum('bill_due'), 2),
                'get_back' => round(collect($result)->sum('get_back'), 2),
            ],
        ]);
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $month = $request->input('month', now()->format('Y-m'));
        $data = $this->detailed($request)->getData(true);

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="monthly-report-' . $month . '.csv"',
        ];

        $callback = function () use ($data, $month) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, ["Monthly Report - {$month}"]);
            fputcsv($handle, []);

            // Totals row
            $t = $data['totals'];
            fputcsv($handle, ['Metric', 'Value']);
            fputcsv($handle, ['Total Students', $t['students']]);
            fputcsv($handle, ['Total Meals', $t['total_meals']]);
            fputcsv($handle, ['Meal Costs (BDT)', $t['meal_costs']]);
            fputcsv($handle, ['Wallet Credits (BDT)', $t['wallet_credits']]);
            fputcsv($handle, ['Bill Total (BDT)', $t['bill_totals']]);
            fputcsv($handle, ['Bill Paid (BDT)', $t['bill_paid']]);
            fputcsv($handle, ['Bill Due (BDT)', $t['bill_due']]);
            fputcsv($handle, ['Get Back (BDT)', $t['get_back']]);
            fputcsv($handle, []);

            // Per-student table
            fputcsv($handle, ['Student', 'Room', 'Total Meals', 'Meal Cost', 'Wallet Credits', 'Bill Total', 'Bill Paid', 'Bill Due', 'Get Back', 'Balance']);
            foreach ($data['students'] as $s) {
                fputcsv($handle, [
                    $s['name'], $s['room_number'],
                    $s['total_meals'],
                    number_format($s['meal_cost'], 2),
                    number_format($s['wallet_credits'], 2),
                    number_format($s['bill_total'], 2),
                    number_format($s['bill_paid'], 2),
                    number_format($s['bill_due'], 2),
                    number_format($s['get_back'], 2),
                    number_format($s['balance'], 2),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function incomeVsExpense(Request $request): JsonResponse
    {
        $year = $request->input('year', now()->format('Y'));
        $months = [];

        for ($i = 1; $i <= 12; $i++) {
            $m = sprintf('%s-%02d', $year, $i);
            $income = round((float) Transaction::where('type', 'credit')
                ->whereYear('created_at', $year)->whereMonth('created_at', $i)->sum('amount'), 2);
            $expense = round((float) Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $i)->sum('amount'), 2);
            $months[] = [
                'month' => $m,
                'income' => $income,
                'expense' => $expense,
            ];
        }

        return response()->json($months);
    }
}
