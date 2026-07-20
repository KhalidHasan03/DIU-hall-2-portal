<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage_users',
            'manage_settings',
            'approve_reports',
            'view_analytics',
            'manage_menus',
            'mark_meals',
            'manage_expenses',
            'generate_bills',
            'record_payments',
            'view_due_list',
            'book_meals',
            'view_bill',
            'make_payment',
            'view_notices',
            'create_notices',
            'export_reports',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions(Permission::all());

        $hallTutor = Role::firstOrCreate(['name' => 'hall_tutor', 'guard_name' => 'web']);
        $hallTutor->syncPermissions([
            'approve_reports', 'view_analytics', 'view_due_list',
            'view_notices', 'create_notices', 'export_reports',
        ]);

        $manager = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $manager->syncPermissions([
            'view_analytics', 'manage_menus', 'mark_meals',
            'manage_expenses', 'generate_bills', 'record_payments',
            'view_due_list', 'view_notices', 'create_notices', 'export_reports',
        ]);

        $student = Role::firstOrCreate(['name' => 'student', 'guard_name' => 'web']);
        $student->syncPermissions([
            'book_meals', 'view_bill', 'make_payment', 'view_notices',
        ]);
    }
}
