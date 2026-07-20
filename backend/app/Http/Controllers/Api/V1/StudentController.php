<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DailyMenu;
use App\Models\MealAttendance;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Student::with('user');
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('room_number', 'like', "%{$request->search}%")
                  ->orWhereHas('user', function ($uq) use ($request) {
                      $uq->where('name', 'like', "%{$request->search}%")
                         ->orWhere('email', 'like', "%{$request->search}%");
                  });
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(20));
    }

    public function pending(): JsonResponse
    {
        $students = Student::where('status', 'pending')
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($students);
    }

    public function approve(Student $student): JsonResponse
    {
        $student->update(['status' => 'approved']);
        $student->user->update(['is_active' => true]);

        return response()->json(['message' => 'Student approved successfully.', 'student' => $student->fresh()->load('user')]);
    }

    public function reject(Request $request, Student $student): JsonResponse
    {
        $request->validate(['reason' => 'nullable|string|max:500']);

        $student->update(['status' => 'rejected']);
        $student->user->update(['is_active' => false]);

        return response()->json(['message' => 'Student rejected.', 'student' => $student->fresh()->load('user')]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'room_number' => 'required|string|max:20',
            'department' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'emergency_contact' => 'sometimes|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'student',
            'is_active' => true,
        ]);
        $user->assignRole('student');

        $student = Student::create([
            'user_id' => $user->id,
            'student_id' => 'STU-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
            'room_number' => $validated['room_number'],
            'department' => $validated['department'] ?? 'N/A',
            'batch' => 'N/A',
            'emergency_contact' => $validated['emergency_contact'] ?? null,
            'admission_date' => now(),
            'status' => 'approved',
        ]);

        return response()->json($student->load('user'), 201);
    }

    public function show(Student $student): JsonResponse
    {
        return response()->json($student->load('user'));
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'room_number' => 'sometimes|string|max:20',
            'department' => 'sometimes|string|max:255',
            'emergency_contact' => 'sometimes|string|max:20',
            'status' => 'sometimes|in:approved,pending,rejected,inactive',
        ]);

        $student->update($validated);

        if ($request->has('name')) {
            $student->user->update(['name' => $request->name]);
        }
        if ($request->has('phone')) {
            $student->user->update(['phone' => $request->phone]);
        }
        if ($request->has('email')) {
            $student->user->update(['email' => $request->email]);
        }

        return response()->json($student->fresh()->load('user'));
    }

    public function destroy(Student $student): JsonResponse
    {
        $student->user->delete();
        $student->delete();
        return response()->json(['message' => 'Student deleted.']);
    }

    public function mealSummary(Request $request): JsonResponse
    {
        $date = now()->toDateString();
        $month = now()->format('Y-m');
        [$year, $monthNum] = explode('-', $month);

        $todayMenus = DailyMenu::whereDate('date', $date)->get();
        $lunchMenuId = $todayMenus->firstWhere('meal_type', 'lunch')?->id;
        $dinnerMenuId = $todayMenus->firstWhere('meal_type', 'dinner')?->id;

        $students = Student::with('user')->where('status', 'approved')->get();

        $result = $students->map(function ($student) use ($lunchMenuId, $dinnerMenuId, $date, $year, $monthNum) {
            $lunchToday = $lunchMenuId
                ? MealAttendance::where('student_id', $student->id)
                    ->where('daily_menu_id', $lunchMenuId)
                    ->whereIn('status', ['booked', 'attended'])
                    ->exists()
                : false;

            $dinnerToday = $dinnerMenuId
                ? MealAttendance::where('student_id', $student->id)
                    ->where('daily_menu_id', $dinnerMenuId)
                    ->whereIn('status', ['booked', 'attended'])
                    ->exists()
                : false;

            $monthLunches = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'lunch')->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();

            $monthDinners = MealAttendance::where('student_id', $student->id)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'dinner')->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();

            return [
                'id' => $student->id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'room_number' => $student->room_number,
                'status' => $student->status,
                'balance' => (float) $student->balance,
                'lunch_today' => $lunchToday,
                'dinner_today' => $dinnerToday,
                'month_lunches' => $monthLunches,
                'month_dinners' => $monthDinners,
                'total_month_meals' => $monthLunches + $monthDinners,
                'student_id' => $student->student_id,
            ];
        });

        return response()->json($result);
    }
}
