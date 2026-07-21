<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Setting::all()->groupBy('group'));
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required',
        ]);

        foreach ($validated['settings'] as $item) {
            Setting::where('key', $item['key'])->update(['value' => $item['value']]);
        }

        return response()->json(['message' => 'Settings updated.']);
    }

    public function mealSettings(): JsonResponse
    {
        $keys = ['lunch_cutoff_time', 'dinner_cutoff_time', 'meal_rate'];
        $settings = Setting::whereIn('key', $keys)->get()->keyBy('key')->map(fn($s) => $s->value);

        return response()->json($settings);
    }

    public function updateMealSettings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lunch_cutoff_time' => 'sometimes|string|date_format:H:i',
            'dinner_cutoff_time' => 'sometimes|string|date_format:H:i',
        ]);

        foreach ($validated as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }

        return response()->json(['message' => 'Meal settings updated.']);
    }
}
