<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Super Admin',
                'email' => 'admin@hmems.local',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'phone' => '01700000000',
                'is_active' => true,
            ],
            [
                'name' => 'Hall Tutor',
                'email' => 'tutor@hmems.local',
                'password' => Hash::make('password'),
                'role' => 'hall_tutor',
                'phone' => '01700000001',
                'is_active' => true,
            ],
            [
                'name' => 'Manager',
                'email' => 'manager@hmems.local',
                'password' => Hash::make('password'),
                'role' => 'manager',
                'phone' => '01700000002',
                'is_active' => true,
            ],
            [
                'name' => 'Student User',
                'email' => 'student@hmems.local',
                'password' => Hash::make('password'),
                'role' => 'student',
                'phone' => '01700000003',
                'is_active' => true,
            ],
        ];

        foreach ($users as $data) {
            $role = $data['role'];
            unset($data['role']);

            $user = User::firstOrCreate(
                ['email' => $data['email']],
                $data
            );

            $user->assignRole($role);
            $user->update(['role' => $role]);

            if ($role === 'student' && !$user->student) {
                \App\Models\Student::create([
                    'user_id' => $user->id,
                    'student_id' => 'STU-' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                    'room_number' => '3rd Floor, Room 12',
                    'department' => 'N/A',
                    'batch' => 'N/A',
                    'admission_date' => now()->subMonths(6),
                    'status' => 'approved',
                ]);
            }
        }
    }
}
