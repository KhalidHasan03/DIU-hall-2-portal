<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Role::with('permissions')->get());
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $role->syncPermissions($validated['permissions']);
        return response()->json(['message' => 'Role permissions updated.']);
    }

    public function permissions(): JsonResponse
    {
        return response()->json(Permission::all());
    }
}
