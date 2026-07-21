<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MealAttendance;
use App\Models\MonthlyBill;
use App\Models\Payment;
use App\Models\Student;
use App\Models\Transaction;
use App\Services\MealRateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function history(Request $request): JsonResponse
    {
        $student = $request->user()->student;
        if (!$student) return response()->json([], 200);

        return response()->json(
            Payment::where('student_id', $student->id)
                ->with('monthlyBill')
                ->orderBy('paid_at', 'desc')
                ->get()
        );
    }

    public function record(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'monthly_bill_id' => 'required|exists:monthly_bills,id',
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,bank_transfer,mobile_bkash,nagad,other',
            'transaction_ref' => 'nullable|string|max:255',
            'paid_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $validated['recorded_by'] = $request->user()->id;

        $payment = DB::transaction(function () use ($validated, $request) {
            $payment = Payment::create($validated);

            $student = Student::findOrFail($validated['student_id']);
            $balanceBefore = (float) $student->balance;
            $student->increment('balance', $validated['amount']);
            $student->refresh();
            $balanceAfter = (float) $student->balance;

            if ($balanceAfter >= 0) {
                $student->update(['meal_debt' => 0]);
            } else {
                $student->update(['meal_debt' => abs($balanceAfter)]);
            }

            Transaction::create([
                'student_id' => $student->id,
                'type' => 'credit',
                'amount' => $validated['amount'],
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'description' => $validated['notes'] ?? 'Bill payment',
                'reference_type' => 'bill_payment',
                'reference_id' => $payment->id,
                'created_by' => $request->user()->id,
            ]);

            $bill = MonthlyBill::find($validated['monthly_bill_id']);
            if ($bill) {
                $walletAfter = (float) $student->balance;
                if ($walletAfter >= (float) $bill->total_amount) {
                    $bill->update(['status' => 'paid']);
                } elseif ($walletAfter > 0) {
                    $bill->update(['status' => 'partial']);
                }
            }

            return $payment;
        });

        return response()->json($payment, 201);
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Payment::with('student.user', 'monthlyBill', 'recorder')
                ->orderBy('paid_at', 'desc')
                ->paginate(20)
        );
    }

    public function show(Payment $payment): JsonResponse
    {
        return response()->json($payment->load('student.user', 'monthlyBill', 'recorder'));
    }

    public function summary(): JsonResponse
    {
        $month = now()->format('Y-m');
        [$year, $monthNum] = explode('-', $month);

        $totalWalletCredits = Transaction::where('type', 'credit')->sum('amount');
        $totalMealDeductions = Transaction::where('type', 'debit')->sum('amount');
        $totalDues = MonthlyBill::get()->sum(function ($bill) {
            $student = $bill->student;
            $wallet = $student ? (float) $student->balance : 0;
            return max(0, (float) $bill->total_amount - $wallet);
        });

        $monthWalletCredits = Transaction::where('type', 'credit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount');
        $monthMealDeductions = Transaction::where('type', 'debit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount');

        $mealRate = MealRateService::calculate($month);

        $students = Student::where('status', 'approved')->with('user')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->user->name,
                'room_number' => $s->room_number,
                'balance' => (float) $s->balance,
                'meal_debt' => (float) $s->meal_debt,
            ];
        });

        $recentActivity = Transaction::with('student.user', 'creator')
            ->where('type', 'credit')
            ->latest()->take(15)->get()
            ->map(function ($t) {
                return [
                    'id' => 'txn-' . $t->id,
                    'type' => 'wallet_credit',
                    'student_name' => $t->student?->user?->name ?? 'Unknown',
                    'amount' => (float) $t->amount,
                    'description' => $t->description ?? 'Wallet credit',
                    'created_at' => $t->created_at,
                ];
            });

        return response()->json([
            'totals' => [
                'wallet_credits' => $totalWalletCredits,
                'meal_deductions' => $totalMealDeductions,
                'total_due' => $totalDues,
                'net_receivable' => $totalWalletCredits - $totalMealDeductions,
            ],
            'monthly' => [
                'wallet_credits' => $monthWalletCredits,
                'meal_deductions' => $monthMealDeductions,
            ],
            'prices' => [
                'meal_rate' => $mealRate,
            ],
            'students' => $students,
            'recent_activity' => $recentActivity,
        ]);
    }

    public function advance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric|min:1',
            'payment_method' => 'required|in:cash,bank_transfer,mobile_bkash,nagad,other',
            'paid_at' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $student = Student::findOrFail($validated['student_id']);

        DB::transaction(function () use ($student, $validated, $request) {
            $balanceBefore = (float) $student->balance;
            $student->increment('balance', $validated['amount']);

            $student->refresh();
            $balanceAfter = (float) $student->balance;

            if ($balanceAfter >= 0) {
                $student->update(['meal_debt' => 0]);
            } else {
                $student->update(['meal_debt' => abs($balanceAfter)]);
            }

            Transaction::create([
                'student_id' => $student->id,
                'type' => 'credit',
                'amount' => $validated['amount'],
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'description' => $validated['notes'] ?? 'Advance payment',
                'reference_type' => 'advance_payment',
                'created_by' => $request->user()->id,
            ]);
        });

        return response()->json([
            'message' => 'Advance payment recorded. Wallet credited.',
            'balance' => (float) $student->fresh()->balance,
        ], 201);
    }
}
