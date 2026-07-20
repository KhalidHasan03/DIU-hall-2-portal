<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MonthlyBill;
use App\Models\Payment;
use App\Models\Student;
use App\Models\Transaction;
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
        $payment = Payment::create($validated);

        $bill = MonthlyBill::find($validated['monthly_bill_id']);
        $paidTotal = $bill->payments()->sum('amount');

        if ($paidTotal >= $bill->total_amount) {
            $bill->update(['status' => 'paid']);
        } elseif ($paidTotal > 0) {
            $bill->update(['status' => 'partial']);
        }

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
            $balanceBefore = $student->balance;
            $student->increment('balance', $validated['amount']);

            Transaction::create([
                'student_id' => $student->id,
                'type' => 'credit',
                'amount' => $validated['amount'],
                'balance_before' => $balanceBefore,
                'balance_after' => $student->fresh()->balance,
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
