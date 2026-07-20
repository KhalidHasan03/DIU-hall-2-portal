<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function balance(Request $request): JsonResponse
    {
        $student = $request->user()->student;
        if (!$student) {
            return response()->json(['balance' => 0, 'message' => 'Student profile not found.'], 404);
        }

        return response()->json([
            'balance' => (float) $student->balance,
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $student = $request->user()->student;
        if (!$student) {
            return response()->json([], 200);
        }

        $transactions = $student->transactions()
            ->with('creator')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($transactions);
    }
}
