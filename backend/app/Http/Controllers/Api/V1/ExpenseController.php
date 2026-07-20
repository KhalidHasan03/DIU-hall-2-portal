<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Expense::with('recorder');
        if ($request->category) {
            $query->where('category', $request->category);
        }
        if ($request->from) {
            $query->where('expense_date', '>=', $request->from);
        }
        if ($request->to) {
            $query->where('expense_date', '<=', $request->to);
        }
        return response()->json($query->orderBy('expense_date', 'desc')->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:food,utilities,maintenance,staff,furniture,other',
            'description' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'vendor' => 'nullable|string|max:255',
            'receipt_image' => 'nullable|string|max:255',
        ]);

        $validated['recorded_by'] = $request->user()->id;
        $expense = Expense::create($validated);

        return response()->json($expense, 201);
    }

    public function show(Expense $expense): JsonResponse
    {
        return response()->json($expense->load('recorder', 'approver'));
    }

    public function update(Request $request, Expense $expense): JsonResponse
    {
        $validated = $request->validate([
            'category' => 'sometimes|in:food,utilities,maintenance,staff,furniture,other',
            'description' => 'sometimes|string',
            'amount' => 'sometimes|numeric|min:0',
            'expense_date' => 'sometimes|date',
            'vendor' => 'nullable|string|max:255',
        ]);

        $expense->update($validated);
        return response()->json($expense);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        $expense->delete();
        return response()->json(['message' => 'Expense deleted.']);
    }

    public function summary(Request $request): JsonResponse
    {
        $month = $request->input('month', now()->format('Y-m'));
        [$year, $monthNum] = explode('-', $month);

        $expenses = Expense::whereYear('expense_date', $year)->whereMonth('expense_date', $monthNum)->get();
        $total = $expenses->sum('amount');
        $byCategory = $expenses->groupBy('category')->map(function ($items) {
            return $items->sum('amount');
        });

        return response()->json([
            'total' => $total,
            'by_category' => $byCategory,
            'month' => $month,
        ]);
    }
}
