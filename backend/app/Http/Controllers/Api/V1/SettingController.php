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
        $keys = ['lunch_cutoff_time', 'dinner_cutoff_time', 'lunch_price', 'dinner_price'];
        $settings = Setting::whereIn('key', $keys)->get()->keyBy('key')->map(fn($s) => $s->value);

        return response()->json($settings);
    }
}
