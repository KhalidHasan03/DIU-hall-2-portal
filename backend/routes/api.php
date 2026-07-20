<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BackupController;
use App\Http\Controllers\Api\V1\BillController;
use App\Http\Controllers\Api\V1\ExpenseController;
use App\Http\Controllers\Api\V1\ManagerDashboardController;
use App\Http\Controllers\Api\V1\MealController;
use App\Http\Controllers\Api\V1\MenuController;
use App\Http\Controllers\Api\V1\NoticeController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\WalletController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\SettingController;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Controllers\Api\V1\StudentDashboardController;
use App\Http\Controllers\Api\V1\TutorDashboardController;
use App\Http\Controllers\Api\V1\UserController;
use Illuminate\Http\Request;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
        Route::put('/password', [AuthController::class, 'changePassword']);

        Route::prefix('notices')->group(function () {
            Route::get('/', [NoticeController::class, 'index']);
        });

        Route::prefix('student')->group(function () {
            Route::get('/dashboard', [StudentDashboardController::class, 'index']);
            Route::get('/menu/today', [MenuController::class, 'today']);
            Route::get('/menu/weekly', [MenuController::class, 'weekly']);
            Route::post('/meals/book', [MealController::class, 'book']);
            Route::delete('/meals/{mealAttendance}', [MealController::class, 'cancel']);
            Route::post('/meals/toggle', [MealController::class, 'studentToggle']);
            Route::get('/meals/today-status', [MealController::class, 'todayStatus']);
            Route::get('/meals/history', [MealController::class, 'history']);
            Route::get('/bills/current', [BillController::class, 'current']);
            Route::get('/bills/history', [BillController::class, 'history']);
            Route::get('/bills/{monthlyBill}', [BillController::class, 'show']);
            Route::get('/payments/history', [PaymentController::class, 'history']);
            Route::get('/wallet', [WalletController::class, 'balance']);
            Route::get('/wallet/history', [WalletController::class, 'history']);
        });

        Route::middleware('role:manager|super_admin')->prefix('manager')->group(function () {
            Route::get('/dashboard', [ManagerDashboardController::class, 'index']);
            Route::apiResource('menus', MenuController::class)->except(['show']);
            Route::get('/menus/{dailyMenu}', [MenuController::class, 'show']);
            Route::post('/meals/mark', [MealController::class, 'markAttendance']);
            Route::post('/meals/toggle', [MealController::class, 'toggle']);
            Route::get('/meals/today-status-all', [MealController::class, 'todayStatusAll']);
            Route::get('/meals/daily-report', [MealController::class, 'dailyReport']);
            Route::apiResource('expenses', ExpenseController::class);
            Route::get('/expenses/summary', [ExpenseController::class, 'summary']);
            Route::post('/bills/generate', [BillController::class, 'generate']);
            Route::get('/bills/pending', [BillController::class, 'pending']);
            Route::post('/payments/record', [PaymentController::class, 'record']);
            Route::post('/payments/advance', [PaymentController::class, 'advance']);
            Route::get('/payments/summary', [PaymentController::class, 'summary']);
            Route::get('/payments', [PaymentController::class, 'index']);
            Route::get('/students/meal-summary', [StudentController::class, 'mealSummary']);
            Route::get('/students/pending', [StudentController::class, 'pending']);
            Route::apiResource('students', StudentController::class);
            Route::post('/students/{student}/approve', [StudentController::class, 'approve']);
            Route::post('/students/{student}/reject', [StudentController::class, 'reject']);
            Route::get('/settings/meal', [SettingController::class, 'mealSettings']);
            Route::get('/reports/monthly', [ReportController::class, 'monthly']);
            Route::get('/reports/detailed', [ReportController::class, 'detailed']);
            Route::get('/reports/export', [ReportController::class, 'export']);
            Route::post('/notices', [NoticeController::class, 'store']);
            Route::put('/notices/{notice}', [NoticeController::class, 'update']);
            Route::delete('/notices/{notice}', [NoticeController::class, 'destroy']);
        });

        Route::middleware('role:hall_tutor|super_admin')->prefix('hall-tutor')->group(function () {
            Route::get('/dashboard', [TutorDashboardController::class, 'index']);
            Route::get('/reports/monthly', [ReportController::class, 'monthly']);
            Route::get('/reports/detailed', [ReportController::class, 'detailed']);
            Route::get('/reports/export', [ReportController::class, 'export']);
            Route::get('/income-expenses', [ReportController::class, 'incomeVsExpense']);
            Route::get('/due-students', [BillController::class, 'dueStudents']);
            Route::get('/students/pending', [StudentController::class, 'pending']);
            Route::post('/students/{student}/approve', [StudentController::class, 'approve']);
            Route::post('/students/{student}/reject', [StudentController::class, 'reject']);
            Route::post('/notices', [NoticeController::class, 'store']);
            Route::put('/notices/{notice}', [NoticeController::class, 'update']);
            Route::delete('/notices/{notice}', [NoticeController::class, 'destroy']);
        });

        Route::middleware('role:super_admin')->prefix('admin')->group(function () {
            Route::apiResource('users', UserController::class);
            Route::put('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);
            Route::get('/settings', [SettingController::class, 'index']);
            Route::put('/settings', [SettingController::class, 'update']);
            Route::apiResource('backups', BackupController::class)->only(['index', 'destroy']);
            Route::post('/backups/create', [BackupController::class, 'create']);
            Route::get('/roles', [RoleController::class, 'index']);
            Route::put('/roles/{role}', [RoleController::class, 'update']);
            Route::get('/permissions', [RoleController::class, 'permissions']);
        });
    });
});
