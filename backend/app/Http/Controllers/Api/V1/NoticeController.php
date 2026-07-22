<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Notice::where('is_active', true)->with('publisher');
        $role = $request->user()->role;
        $query->where(function ($q) use ($role) {
            $q->where('target_role', 'all')
              ->orWhere('target_role', $role);
        });

        return response()->json($query->orderBy('created_at', 'desc')->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_role' => 'required|in:all,student,manager,hall_tutor',
        ]);

        $validated['published_by'] = $request->user()->id;
        $notice = Notice::create($validated);

        ActivityLogger::log(
            $request->user(),
            "published notice: {$notice->title}",
            'notice',
            $notice->id,
            null,
            $validated,
            $request
        );

        return response()->json($notice, 201);
    }

    public function update(Request $request, Notice $notice): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'target_role' => 'sometimes|in:all,student,manager,hall_tutor',
            'is_active' => 'sometimes|boolean',
        ]);

        $oldData = $notice->only(array_keys($validated));
        $notice->update($validated);

        ActivityLogger::log(
            $request->user(),
            "updated notice: {$notice->title}",
            'notice',
            $notice->id,
            $oldData,
            $validated,
            $request
        );

        return response()->json($notice);
    }

    public function destroy(Request $request, Notice $notice): JsonResponse
    {
        $noticeTitle = $notice->title;
        $notice->delete();

        ActivityLogger::log(
            $request->user(),
            "deleted notice: {$noticeTitle}",
            'notice',
            $notice->id,
            null,
            null,
            $request
        );

        return response()->json(['message' => 'Notice deleted.']);
    }
}
