<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Account is deactivated.'], 403);
        }

        if ($user->role === 'student') {
            $student = $user->student;
            if (!$student || $student->status === 'pending') {
                return response()->json(['message' => 'Your registration is pending approval. Please wait for the hall tutor to approve your account.'], 403);
            }
            if ($student->status === 'inactive' || $student->status === 'rejected') {
                return response()->json(['message' => 'Your account has been rejected. Contact the hall administration.'], 403);
            }
        }

        $token = $user->createToken('api-token')->plainTextToken;

        ActivityLogger::log(
            $user,
            "logged in",
            'user',
            $user->id,
            null,
            null,
            $request
        );

        return response()->json([
            'user' => $user,
            'token' => $token,
            'role' => $user->role,
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'password' => 'required|min:8',
            'room_number' => 'required|string|max:20',
            'department' => 'required|string|max:255',
            'emergency_contact' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'is_active' => true,
        ]);
        $user->assignRole('student');

        Student::create([
            'user_id' => $user->id,
            'student_id' => 'STU-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
            'room_number' => $validated['room_number'],
            'department' => $validated['department'],
            'emergency_contact' => $validated['emergency_contact'] ?? null,
            'admission_date' => now(),
            'status' => 'pending',
        ]);

        $user->load('student');

        ActivityLogger::log(
            $user,
            "registered as student (Room {$validated['room_number']})",
            'student',
            $user->student->id,
            null,
            $validated,
            $request
        );

        return response()->json(['message' => 'Registration successful! Your account is pending approval by the hall tutor.'], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('student');

        return response()->json([
            'user' => $user,
            'role' => $user->role,
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
        ]);

        $user->update($validated);

        return response()->json(['user' => $user->load('student'), 'message' => 'Profile updated.']);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $user = $request->user();

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return response()->json([
            'user' => $user->load('student'),
            'avatar_url' => Storage::disk('public')->url($path),
            'message' => 'Avatar uploaded.',
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect.'], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['message' => 'Password changed successfully.']);
    }
}
