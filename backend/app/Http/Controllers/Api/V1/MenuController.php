<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    public function today(): JsonResponse
    {
        $today = now()->toDateString();
        $menus = DailyMenu::where('date', $today)->with('creator')->get();
        return response()->json($menus);
    }

    public function weekly(Request $request): JsonResponse
    {
        $start = now()->startOfWeek()->toDateString();
        $end = now()->endOfWeek()->toDateString();
        $menus = DailyMenu::whereBetween('date', [$start, $end])
            ->orderBy('date')->with('creator')->get();
        return response()->json($menus);
    }

    public function byDateRange(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
        ]);

        $menus = DailyMenu::whereBetween('date', [$validated['from'], $validated['to']])
            ->orderBy('date')->with('creator')->get();
        return response()->json($menus);
    }

    public function index(): JsonResponse
    {
        $menus = DailyMenu::with('creator')
            ->orderBy('date', 'desc')
            ->orderBy('meal_type')
            ->paginate(30);
        return response()->json($menus);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'meal_type' => 'required|in:lunch,dinner',
            'menu_text' => 'required|string',
        ]);

        $existing = DailyMenu::where('date', $validated['date'])
            ->where('meal_type', $validated['meal_type'])
            ->first();

        if ($existing) {
            $existing->update(['menu_text' => $validated['menu_text']]);
            return response()->json($existing->load('creator'), 200);
        }

        $validated['created_by'] = $request->user()->id;
        $menu = DailyMenu::create($validated);

        return response()->json($menu->load('creator'), 201);
    }

    public function show(DailyMenu $dailyMenu): JsonResponse
    {
        return response()->json($dailyMenu->load('creator'));
    }

    public function update(Request $request, DailyMenu $dailyMenu): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'sometimes|date',
            'meal_type' => 'sometimes|in:lunch,dinner',
            'menu_text' => 'sometimes|string',
        ]);

        $newDate = $validated['date'] ?? $dailyMenu->date->toDateString();
        $newType = $validated['meal_type'] ?? $dailyMenu->meal_type;

        $conflict = DailyMenu::where('date', $newDate)
            ->where('meal_type', $newType)
            ->where('id', '!=', $dailyMenu->id)
            ->first();

        if ($conflict) {
            $conflict->update(['menu_text' => $validated['menu_text'] ?? $dailyMenu->menu_text]);
            $dailyMenu->delete();
            return response()->json($conflict->load('creator'));
        }

        $dailyMenu->update($validated);
        return response()->json($dailyMenu->load('creator'));
    }

    public function destroy(DailyMenu $dailyMenu): JsonResponse
    {
        $dailyMenu->delete();
        return response()->json(['message' => 'Menu deleted.']);
    }
}
