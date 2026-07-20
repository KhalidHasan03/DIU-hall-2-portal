<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use App\Models\Expense;
use App\Models\MealAttendance;
use App\Models\MonthlyBill;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Transaction;
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

        $totalWalletCredits = Transaction::where('type', 'credit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount');
        $totalMealDeductions = Transaction::where('type', 'debit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount');

        $totalLunches = MealAttendance::where('status', 'attended')
            ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'lunch')->whereYear('date', $year)->whereMonth('date', $monthNum))
            ->count();
        $totalDinners = MealAttendance::where('status', 'attended')
            ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'dinner')->whereYear('date', $year)->whereMonth('date', $monthNum))
            ->count();

        return response()->json([
            'month' => $month,
            'total_bills' => $totalBills,
            'total_collected' => $totalPaid,
            'total_expenses' => $totalExpenses,
            'net_profit' => $totalPaid - $totalExpenses,
            'total_students' => $studentCount,
            'paid_students' => $paidCount,
            'pending_students' => $pendingCount,
            'wallet_credits' => $totalWalletCredits,
            'meal_deductions' => $totalMealDeductions,
            'total_lunches' => $totalLunches,
            'total_dinners' => $totalDinners,
            'total_meals' => $totalLunches + $totalDinners,
        ]);
    }

    public function detailed(Request $request): JsonResponse
    {
        $month = $request->input('month', now()->format('Y-m'));
        [$year, $monthNum] = explode('-', $month);

        $lunchPrice = (float) (Setting::where('key', 'lunch_price')->value('value') ?? 50);
        $dinnerPrice = (float) (Setting::where('key', 'dinner_price')->value('value') ?? 60);

        $students = Student::with('user')->where('status', 'approved')->get();
        $result = [];

        foreach ($students as $student) {
            $lunches = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'lunch')->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();
            $dinners = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'dinner')->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();

            $mealCost = ($lunches * $lunchPrice) + ($dinners * $dinnerPrice);

            $walletCredits = Transaction::where('student_id', $student->id)
                ->where('type', 'credit')
                ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
                ->sum('amount');

            $bill = MonthlyBill::where('student_id', $student->id)->where('month', $month)->first();
            $billTotal = $bill ? (float) $bill->total_amount : 0;
            $billPaid = $bill ? (float) $bill->payments()->sum('amount') : 0;
            $billDue = max(0, $billTotal - $billPaid);

            $result[] = [
                'id' => $student->id,
                'name' => $student->user->name,
                'student_id' => $student->student_id,
                'room_number' => $student->room_number,
                'balance' => (float) $student->balance,
                'lunches' => $lunches,
                'dinners' => $dinners,
                'total_meals' => $lunches + $dinners,
                'meal_cost' => $mealCost,
                'wallet_credits' => $walletCredits,
                'bill_total' => $billTotal,
                'bill_paid' => $billPaid,
                'bill_due' => $billDue,
            ];
        }

        return response()->json([
            'month' => $month,
            'lunch_price' => $lunchPrice,
            'dinner_price' => $dinnerPrice,
            'students' => $result,
            'totals' => [
                'students' => count($result),
                'lunches' => collect($result)->sum('lunches'),
                'dinners' => collect($result)->sum('dinners'),
                'total_meals' => collect($result)->sum('total_meals'),
                'meal_costs' => collect($result)->sum('meal_cost'),
                'wallet_credits' => collect($result)->sum('wallet_credits'),
                'bill_totals' => collect($result)->sum('bill_total'),
                'bill_paid' => collect($result)->sum('bill_paid'),
                'bill_due' => collect($result)->sum('bill_due'),
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
            fputcsv($handle, ['Total Lunches', $t['lunches']]);
            fputcsv($handle, ['Total Dinners', $t['dinners']]);
            fputcsv($handle, ['Total Meals', $t['total_meals']]);
            fputcsv($handle, ['Meal Costs (BDT)', $t['meal_costs']]);
            fputcsv($handle, ['Wallet Credits (BDT)', $t['wallet_credits']]);
            fputcsv($handle, ['Bill Total (BDT)', $t['bill_totals']]);
            fputcsv($handle, ['Bill Paid (BDT)', $t['bill_paid']]);
            fputcsv($handle, ['Bill Due (BDT)', $t['bill_due']]);
            fputcsv($handle, []);

            // Per-student table
            fputcsv($handle, ['Student', 'Room', 'Lunches', 'Dinners', 'Total Meals', 'Meal Cost', 'Wallet Credits', 'Bill Total', 'Bill Paid', 'Bill Due', 'Balance']);
            foreach ($data['students'] as $s) {
                fputcsv($handle, [
                    $s['name'], $s['room_number'],
                    $s['lunches'], $s['dinners'], $s['total_meals'],
                    number_format($s['meal_cost'], 2),
                    number_format($s['wallet_credits'], 2),
                    number_format($s['bill_total'], 2),
                    number_format($s['bill_paid'], 2),
                    number_format($s['bill_due'], 2),
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
