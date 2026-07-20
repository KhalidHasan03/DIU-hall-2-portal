<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\MonthlyBill;
use App\Models\MealAttendance;
use App\Models\Setting;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillController extends Controller
{
    public function current(Request $request): JsonResponse
    {
        $student = $request->user()->student;
        if (!$student) return response()->json(null, 200);

        $month = $request->input('month', now()->format('Y-m'));
        $bill = MonthlyBill::where('student_id', $student->id)
            ->where('month', $month)
            ->with('payments')
            ->first();

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
        $lunchPrice = Setting::where('key', 'lunch_price')->value('value') ?? 50;
        $dinnerPrice = Setting::where('key', 'dinner_price')->value('value') ?? 60;
        $students = Student::where('status', 'approved')->get();
        $generated = [];

        foreach ($students as $student) {
            $lunches = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', function ($q) use ($year, $monthNum) {
                    $q->where('meal_type', 'lunch')
                      ->whereYear('date', $year)->whereMonth('date', $monthNum);
                })->count();

            $dinners = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', function ($q) use ($year, $monthNum) {
                    $q->where('meal_type', 'dinner')
                      ->whereYear('date', $year)->whereMonth('date', $monthNum);
                })->count();

            $lunchAmount = $lunches * (int)$lunchPrice;
            $dinnerAmount = $dinners * (int)$dinnerPrice;
            $total = $lunchAmount + $dinnerAmount;

            $bill = MonthlyBill::updateOrCreate(
                ['student_id' => $student->id, 'month' => $month],
                [
                    'total_lunches' => $lunches,
                    'total_dinners' => $dinners,
                    'lunch_amount' => $lunchAmount,
                    'dinner_amount' => $dinnerAmount,
                    'total_amount' => $total,
                    'generated_by' => $request->user()->id,
                ]
            );

            $generated[] = $bill;
        }

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
        $students = MonthlyBill::where('month', $month)
            ->whereIn('status', ['pending', 'partial', 'overdue'])
            ->with('student.user')
            ->get();

        return response()->json($students->map(function ($bill) {
            $paid = $bill->payments()->sum('amount');
            return [
                'id' => $bill->id,
                'student_name' => $bill->student->user->name,
                'room_number' => $bill->student->room_number,
                'total_amount' => $bill->total_amount,
                'paid' => $paid,
                'due' => max(0, $bill->total_amount - $paid),
            ];
        }));
    }
}
