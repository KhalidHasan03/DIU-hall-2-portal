<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\MealAttendance;

class MealRateService
{
    public static function calculate(?string $month = null): float
    {
        $month = $month ?: now()->format('Y-m');
        [$year, $monthNum] = explode('-', $month);

        $totalExpenses = (float) Expense::whereYear('expense_date', $year)
            ->whereMonth('expense_date', $monthNum)
            ->sum('amount');

        $totalMeals = MealAttendance::where('status', 'attended')
            ->whereHas('dailyMenu', function ($q) use ($year, $monthNum) {
                $q->whereYear('date', $year)->whereMonth('date', $monthNum);
            })->count();

        if ($totalMeals <= 0 || $totalExpenses <= 0) {
            return 0;
        }

        return round($totalExpenses / $totalMeals, 2);
    }
}
