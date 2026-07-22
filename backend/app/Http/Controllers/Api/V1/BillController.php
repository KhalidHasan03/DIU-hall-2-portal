<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MonthlyBill;
use App\Models\MealAttendance;
use App\Models\Student;
use App\Services\ActivityLogger;
use App\Services\MealRateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BillController extends Controller
{
    public function current(Request $request): JsonResponse
    {
        $student = $request->user()->student;
        if (!$student) return response()->json(null, 200);

        $month = $request->input('month', now()->format('Y-m'));
        $bill = MonthlyBill::where('student_id', $student->id)
            ->where('month', $month)
            ->first();

        if (!$bill) {
            return response()->json(null, 200);
        }

        $walletBalance = round((float) $student->balance, 2);
        $walletCovered = round(min((float) $bill->total_amount, $walletBalance), 2);

        $bill->total_amount = round((float) $bill->total_amount, 2);
        $bill->wallet_balance = $walletBalance;
        $bill->paid_amount = $walletCovered;
        $bill->due_amount = round(max(0, (float) $bill->total_amount - $walletBalance), 2);

        if ($walletBalance >= (float) $bill->total_amount) {
            $bill->status = 'paid';
        } elseif ($walletBalance > 0) {
            $bill->status = 'partial';
        }

        return response()->json($bill);
    }

    public function history(Request $request): JsonResponse
    {
        $student = $request->user()->student;
        if (!$student) return response()->json([], 200);

        return response()->json(
            MonthlyBill::where('student_id', $student->id)
                ->with('payments')
                ->orderBy('month', 'desc')
                ->get()
        );
    }

    public function generate(Request $request): JsonResponse
    {
        $month = $request->input('month', now()->format('Y-m'));
        [$year, $monthNum] = explode('-', $month);
        $mealRate = MealRateService::calculate($month);
        $students = Student::where('status', 'approved')->get();
        $generated = [];

        foreach ($students as $student) {
            $totalMeals = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', function ($q) use ($year, $monthNum) {
                    $q->whereYear('date', $year)->whereMonth('date', $monthNum);
                })->count();

            $total = round($totalMeals * $mealRate, 2);
            $walletBalance = round((float) $student->balance, 2);

            $status = $walletBalance >= $total ? 'paid' : ($walletBalance > 0 ? 'partial' : 'pending');

            $bill = MonthlyBill::updateOrCreate(
                ['student_id' => $student->id, 'month' => $month],
                [
                    'total_amount' => $total,
                    'status' => $status,
                    'generated_by' => $request->user()->id,
                ]
            );

            $generated[] = $bill;
        }

        ActivityLogger::log(
            $request->user(),
            "generated {$month} bills for " . count($generated) . " students",
            'monthly_bill',
            null,
            null,
            ['month' => $month, 'count' => count($generated)],
            $request
        );

        return response()->json(['message' => 'Bills generated.', 'count' => count($generated)]);
    }

    public function show(Request $request, MonthlyBill $monthlyBill): JsonResponse
    {
        $user = $request->user();
        if ($user->role === 'student' && $monthlyBill->student_id !== $user->student?->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json($monthlyBill->load('student.user', 'payments'));
    }

    public function pending(Request $request): JsonResponse
    {
        return response()->json(
            MonthlyBill::whereIn('status', ['pending', 'partial', 'overdue'])
                ->with('student.user')
                ->orderBy('month', 'desc')
                ->paginate(20)
        );
    }

    public function dueStudents(Request $request): JsonResponse
    {
        $month = $request->input('month', now()->format('Y-m'));
        $bills = MonthlyBill::where('month', $month)
            ->with('student.user')
            ->get();

        return response()->json($bills->map(function ($bill) {
            $walletBalance = round((float) ($bill->student?->balance ?? 0), 2);
            $paid = round(min((float) $bill->total_amount, $walletBalance), 2);
            return [
                'id' => $bill->id,
                'student_name' => $bill->student->user->name,
                'room_number' => $bill->student->room_number,
                'total_amount' => round((float) $bill->total_amount, 2),
                'wallet_balance' => $walletBalance,
                'paid' => $paid,
                'due' => round(max(0, (float) $bill->total_amount - $walletBalance), 2),
            ];
        }));
    }

    public function dueList(Request $request): JsonResponse
    {
        $month = $request->input('month', now()->format('Y-m'));
        [$year, $monthNum] = explode('-', $month);

        $students = Student::with('user')->where('status', 'approved')->get();

        $result = $students->map(function ($student) use ($month, $year, $monthNum) {
            $bill = MonthlyBill::where('student_id', $student->id)->where('month', $month)->first();
            $totalAmount = $bill ? round((float) $bill->total_amount, 2) : 0;
            $walletBalance = round((float) $student->balance, 2);
            $paid = round(min($totalAmount, $walletBalance), 2);
            $due = round(max(0, $totalAmount - $walletBalance), 2);

            $totalMeals = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();

            return [
                'student_id' => $student->id,
                'name' => $student->user->name,
                'room_number' => $student->room_number,
                'total_meals' => $totalMeals,
                'total_amount' => $totalAmount,
                'wallet_balance' => $walletBalance,
                'paid' => $paid,
                'due' => $due,
            ];
        });

        $sorted = $result->sortByDesc('due')->values();

        $ranked = $sorted->map(function ($item, $index) {
            $item['rank'] = $index + 1;
            return $item;
        });

        $totalDue = round($ranked->sum('due'), 2);
        $topDue = round($ranked->first()['due'] ?? 0, 2);
        $hasDueStudents = $ranked->contains(fn($s) => $s['due'] > 0);

        return response()->json([
            'month' => $month,
            'students' => $ranked,
            'total_due' => $totalDue,
            'top_due' => $topDue,
            'has_due_students' => $hasDueStudents,
        ]);
    }
}
