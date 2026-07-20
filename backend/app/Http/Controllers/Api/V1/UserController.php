<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::with('student');
        if ($request->role) {
            $query->where('role', $request->role);
        }
        return response()->json($query->orderBy('created_at', 'desc')->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:super_admin,hall_tutor,manager,student',
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        $user->assignRole($validated['role']);

        return response()->json($user, 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($user->load('student'));
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|in:super_admin,hall_tutor,manager,student',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($validated['role'])) {
            $user->syncRoles($validated['role']);
        }

        $user->update($validated);
        return response()->json($user);
    }

    public function toggleActive(User $user): JsonResponse
    {
        $user->update(['is_active' => !$user->is_active]);
        return response()->json(['message' => 'User status toggled.', 'is_active' => $user->is_active]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();
        return response()->json(['message' => 'User deleted.']);
    }
}
