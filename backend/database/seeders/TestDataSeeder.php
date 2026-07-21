<?php

namespace Database\Seeders;

use App\Models\DailyMenu;
use App\Models\Expense;
use App\Models\MealAttendance;
use App\Models\MonthlyBill;
use App\Models\Student;
use App\Models\Transaction;
use App\Models\User;
use App\Services\MealRateService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $manager = User::where('email', 'manager@hmems.local')->first();
        $tutor = User::where('email', 'tutor@hmems.local')->first();
        if (!$manager || !$tutor) return;

        $bangladeshiStudents = [
            ['name' => 'Md. Ariful Islam', 'room' => '1st Floor, Room 101', 'dept' => 'CSE', 'batch' => '63'],
            ['name' => 'Sadia Akter', 'room' => '1st Floor, Room 102', 'dept' => 'EEE', 'batch' => '63'],
            ['name' => 'Md. Hasan Ali', 'room' => '1st Floor, Room 103', 'dept' => 'BBA', 'batch' => '63'],
            ['name' => 'Nusrat Jahan', 'room' => '2nd Floor, Room 201', 'dept' => 'English', 'batch' => '64'],
            ['name' => 'Rakib Hossain', 'room' => '2nd Floor, Room 202', 'dept' => 'CSE', 'batch' => '64'],
            ['name' => 'Taslima Begum', 'room' => '2nd Floor, Room 203', 'dept' => 'Law', 'batch' => '62'],
            ['name' => 'Md. Kamrul Hasan', 'room' => '3rd Floor, Room 301', 'dept' => 'Economics', 'batch' => '65'],
            ['name' => 'Farzana Yeasmin', 'room' => '3rd Floor, Room 302', 'dept' => 'Pharmacy', 'batch' => '63'],
            ['name' => 'Shahinur Rahman', 'room' => '3rd Floor, Room 303', 'dept' => 'CSE', 'batch' => '62'],
            ['name' => 'Jannatul Ferdous', 'room' => '4th Floor, Room 401', 'dept' => 'EEE', 'batch' => '64'],
            ['name' => 'Md. Sohel Rana', 'room' => '4th Floor, Room 402', 'dept' => 'BBA', 'batch' => '65'],
            ['name' => 'Mst. Sumaiya Khatun', 'room' => '4th Floor, Room 403', 'dept' => 'English', 'batch' => '63'],
            ['name' => 'Tanvir Ahmed', 'room' => '5th Floor, Room 501', 'dept' => 'CSE', 'batch' => '61'],
            ['name' => 'Sharmin Sultana', 'room' => '5th Floor, Room 502', 'dept' => 'Law', 'batch' => '64'],
            ['name' => 'Md. Jubayer Ali', 'room' => '5th Floor, Room 503', 'dept' => 'Economics', 'batch' => '62'],
            ['name' => 'Popy Rani Das', 'room' => '6th Floor, Room 601', 'dept' => 'Pharmacy', 'batch' => '65'],
            ['name' => 'Md. Mehedi Hasan', 'room' => '6th Floor, Room 602', 'dept' => 'CSE', 'batch' => '61'],
            ['name' => 'Khadiza Akter', 'room' => '6th Floor, Room 603', 'dept' => 'EEE', 'batch' => '63'],
            ['name' => 'Abu Sayeed', 'room' => '7th Floor, Room 701', 'dept' => 'BBA', 'batch' => '64'],
            ['name' => 'Mim Khatun', 'room' => '7th Floor, Room 702', 'dept' => 'English', 'batch' => '65'],
        ];

        $studentIds = [];
        foreach ($bangladeshiStudents as $i => $info) {
            $email = 'student' . ($i + 1) . '@diu.edu.bd';
            $phone = '017' . str_pad(mt_rand(10000000, 99999999), 8, '0', STR_PAD_LEFT);

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $info['name'],
                    'phone' => $phone,
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'is_active' => true,
                ]
            );
            $user->assignRole('student');

            $student = Student::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'student_id' => 'DIU-HM-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                    'room_number' => $info['room'],
                    'department' => $info['dept'],
                    'batch' => $info['batch'],
                    'emergency_contact' => '017' . str_pad(mt_rand(10000000, 99999999), 8, '0', STR_PAD_LEFT),
                    'admission_date' => now()->subMonths(rand(6, 24)),
                    'status' => 'approved',
                    'balance' => rand(0, 1) ? rand(200, 3000) : 0,
                    'meal_debt' => 0,
                ]
            );
            if ($student->balance > 0) {
                Transaction::firstOrCreate(
                    ['student_id' => $student->id, 'reference_type' => 'advance_payment', 'type' => 'credit'],
                    [
                        'amount' => $student->balance,
                        'balance_before' => 0,
                        'balance_after' => $student->balance,
                        'description' => 'Initial wallet top-up',
                        'created_by' => $manager->id,
                    ]
                );
            }
            $studentIds[] = $student->id;
        }

        $today = now();
        $startOfMonth = $today->copy()->startOfMonth();
        $endOfMonth = $today->copy()->endOfMonth();

        $bengaliFoods = [
            'lunch' => [
                'Rice, Dal, Aloo Bhaji & Begun Bhaja',
                'Rice, Chicken Curry, Dal & Salad',
                'Biryani with Borhani & Salad',
                'Khichuri, Beef Curry & Tomato Achar',
                'Rice, Fish Curry, Dal & Shobji',
                'Polao, Chicken Roast & Salad',
                'Rice, Beef Bhuna, Dal & Aloo Bhorta',
                'Rice, Egg Curry, Dal & Mixed Vegetable',
                'Tehari with Beef & Salad',
                'Rice, Murgir Jhol, Dal & Shukto',
            ],
            'dinner' => [
                'Roti, Beef Curry & Salad',
                'Fried Rice, Chicken Manchurian & Soup',
                'Paratha, Dal & Aloo Vorta',
                'Ruti, Mutton Rezala & Salad',
                'Khichuri, Dim Bhaji & Shobji',
                'Naan, Chicken Tikka Masala & Salad',
                'Roti, Fish Curry & Vegetable',
                'Polao, Beef Kala Bhuna & Salad',
                'Ruti, Chicken Curry & Dal',
                'Biriyani, Salad & Raita',
            ],
        ];

        $expenseCategories = ['food', 'food', 'food', 'utilities', 'maintenance', 'food', 'staff', 'food', 'utilities', 'food'];
        $expenseDescriptions = [
            'Weekly market purchase — rice, dal, vegetables',
            'Chicken and beef from Kawran Bazar',
            'Cooking oil, spices & condiments',
            'Monthly electricity bill',
            'Plumbing repair — 3rd floor washroom',
            'Fish purchase from local market',
            'Cook staff monthly salary',
            'Dairy & eggs for the week',
            'Gas bill for the month',
            'Bulk rice purchase from Sadarghat',
        ];

        foreach (range(0, 3) as $week) {
            $expenseDate = $startOfMonth->copy()->addDays($week * 7 + rand(1, 3));
            if ($expenseDate->gt($today)) break;
            Expense::create([
                'category' => $expenseCategories[$week] ?? 'food',
                'description' => $expenseDescriptions[$week] ?? 'Kitchen supplies',
                'amount' => rand(15, 50) * 100,
                'expense_date' => $expenseDate,
                'recorded_by' => $manager->id,
                'status' => 'approved',
                'approved_by' => $tutor->id,
                'approved_at' => $expenseDate,
            ]);
        }

        $currentDate = $startOfMonth->copy();
        while ($currentDate->lte($endOfMonth)) {
            $dateStr = $currentDate->toDateString();
            $lunchMenu = DailyMenu::firstOrCreate(
                ['date' => $dateStr, 'meal_type' => 'lunch'],
                ['menu_text' => $bengaliFoods['lunch'][array_rand($bengaliFoods['lunch'])], 'created_by' => $manager->id]
            );
            $dinnerMenu = DailyMenu::firstOrCreate(
                ['date' => $dateStr, 'meal_type' => 'dinner'],
                ['menu_text' => $bengaliFoods['dinner'][array_rand($bengaliFoods['dinner'])], 'created_by' => $manager->id]
            );

            if ($currentDate->lte($today)) {
                foreach ($studentIds as $sid) {
                    foreach ([$lunchMenu->id, $dinnerMenu->id] as $menuId) {
                        $chance = rand(1, 100);
                        if ($chance <= 75) {
                            $status = $chance <= 60 ? 'attended' : 'cancelled';
                            MealAttendance::firstOrCreate(
                                ['student_id' => $sid, 'daily_menu_id' => $menuId],
                                [
                                    'status' => $status,
                                    'marked_by' => $manager->id,
                                    'marked_at' => $currentDate->copy()->addHours(rand(8, 20)),
                                ]
                            );
                        }
                    }
                }
            }
            $currentDate->addDay();
        }

        $month = $today->format('Y-m');
        $mealRate = MealRateService::calculate($month);
        [$year, $monthNum] = explode('-', $month);

        foreach ($studentIds as $sid) {
            $student = Student::find($sid);
            if (!$student) continue;

            $attendedMealIds = MealAttendance::where('student_id', $sid)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->pluck('id');

            if ($attendedMealIds->isNotEmpty() && $mealRate > 0) {
                $totalMealCost = round(count($attendedMealIds) * $mealRate, 2);
                $balanceBefore = (float) $student->balance;
                $newBalance = max(0, round($balanceBefore - $totalMealCost, 2));
                $student->update(['balance' => $newBalance]);

                if ($balanceBefore > 0) {
                    Transaction::create([
                        'student_id' => $sid,
                        'type' => 'debit',
                        'amount' => min($totalMealCost, $balanceBefore),
                        'balance_before' => $balanceBefore,
                        'balance_after' => $newBalance,
                        'description' => 'Seed: Meal deductions for ' . $month,
                        'reference_type' => 'meal_batch',
                        'created_by' => $manager->id,
                    ]);
                }

                if ($newBalance <= 0 && $totalMealCost > $balanceBefore) {
                    $debt = round($totalMealCost - $balanceBefore, 2);
                    $student->update(['meal_debt' => $debt]);
                }
            }

            $totalMeals = MealAttendance::where('student_id', $sid)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();

            if ($totalMeals <= 0) continue;

            $lunches = MealAttendance::where('student_id', $sid)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'lunch')->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();
            $dinners = MealAttendance::where('student_id', $sid)
                ->where('status', 'attended')
                ->whereHas('dailyMenu', fn($q) => $q->where('meal_type', 'dinner')->whereYear('date', $year)->whereMonth('date', $monthNum))
                ->count();

            $totalAmount = $totalMeals * $mealRate;

            if ($totalAmount <= 0) continue;

            $walletBalance = (float) ($student->balance ?? 0);

            $status = $walletBalance >= $totalAmount ? 'paid' : ($walletBalance > 0 ? 'partial' : 'pending');

            $bill = MonthlyBill::firstOrCreate(
                ['student_id' => $sid, 'month' => $month],
                [
                    'total_lunches' => $lunches,
                    'total_dinners' => $dinners,
                    'lunch_amount' => 0,
                    'dinner_amount' => 0,
                    'total_amount' => $totalAmount,
                    'status' => $status,
                    'generated_by' => $manager->id,
                ]
            );
        }

        if ($manager) {
            Expense::create([
                'category' => 'food',
                'description' => 'Bulk rice, dal, and cooking oil purchase for ' . $month,
                'amount' => rand(200, 600) * 10,
                'expense_date' => $today->copy()->subDays(rand(1, 7)),
                'recorded_by' => $manager->id,
                'status' => 'approved',
                'approved_by' => $tutor->id,
                'approved_at' => $today->copy()->subDays(rand(1, 5)),
            ]);
        }
    }
}
