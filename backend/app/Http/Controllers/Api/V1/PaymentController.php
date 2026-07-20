<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MealAttendance;
use App\Models\MonthlyBill;
use App\Models\Payment;
use App\Models\Setting;
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

    public function summary(): JsonResponse
    {
        $month = now()->format('Y-m');
        [$year, $monthNum] = explode('-', $month);

        $totalWalletCredits = Transaction::where('type', 'credit')->sum('amount');
        $totalMealDeductions = Transaction::where('type', 'debit')->sum('amount');
        $totalBillCollections = Payment::sum('amount');

        $monthWalletCredits = Transaction::where('type', 'credit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount');
        $monthMealDeductions = Transaction::where('type', 'debit')
            ->whereYear('created_at', $year)->whereMonth('created_at', $monthNum)
            ->sum('amount');
        $monthBillCollections = Payment::whereYear('paid_at', $year)->whereMonth('paid_at', $monthNum)
            ->sum('amount');

        $lunchPrice = (float) (Setting::where('key', 'lunch_price')->value('value') ?? 50);
        $dinnerPrice = (float) (Setting::where('key', 'dinner_price')->value('value') ?? 60);

        $students = Student::where('status', 'approved')->with('user')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->user->name,
                'room_number' => $s->room_number,
                'balance' => (float) $s->balance,
            ];
        });

        $recentActivity = collect();

        Transaction::with('student.user', 'creator')
            ->where('type', 'credit')
            ->latest()->take(10)->get()
            ->each(function ($t) use (&$recentActivity) {
                $recentActivity->push([
                    'id' => 'txn-' . $t->id,
                    'type' => 'wallet_credit',
                    'student_name' => $t->student->user->name ?? 'Unknown',
                    'amount' => (float) $t->amount,
                    'description' => $t->description ?? 'Advance payment',
                    'created_at' => $t->created_at,
                ]);
            });

        Payment::with('student.user')
            ->latest('paid_at')->take(10)->get()
            ->each(function ($p) use (&$recentActivity) {
                $recentActivity->push([
                    'id' => 'pay-' . $p->id,
                    'type' => 'bill_payment',
                    'student_name' => $p->student->user->name ?? 'Unknown',
                    'amount' => (float) $p->amount,
                    'description' => 'Bill payment (' . ($p->monthlyBill->month ?? 'N/A') . ')',
                    'created_at' => $p->paid_at,
                ]);
            });

        $recentActivity = $recentActivity->sortByDesc('created_at')->values()->take(15);

        return response()->json([
            'totals' => [
                'wallet_credits' => $totalWalletCredits,
                'meal_deductions' => $totalMealDeductions,
                'bill_collections' => $totalBillCollections,
                'net_wallet_in_use' => $totalWalletCredits - $totalMealDeductions,
            ],
            'monthly' => [
                'wallet_credits' => $monthWalletCredits,
                'meal_deductions' => $monthMealDeductions,
                'bill_collections' => $monthBillCollections,
            ],
            'prices' => [
                'lunch' => $lunchPrice,
                'dinner' => $dinnerPrice,
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
