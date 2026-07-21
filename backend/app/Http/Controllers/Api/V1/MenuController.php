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
        $end = now()->toDateString();
        $menus = DailyMenu::whereBetween('date', [$start, $end])
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

        $validated['created_by'] = $request->user()->id;
        $menu = DailyMenu::create($validated);

        return response()->json($menu, 201);
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

        $dailyMenu->update($validated);
        return response()->json($dailyMenu);
    }

    public function destroy(DailyMenu $dailyMenu): JsonResponse
    {
        $dailyMenu->delete();
        return response()->json(['message' => 'Menu deleted.']);
    }
}
