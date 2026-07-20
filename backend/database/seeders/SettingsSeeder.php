<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'hostel_name', 'value' => 'DIU Hall Management', 'type' => 'string', 'group' => 'general'],
            ['key' => 'lunch_price', 'value' => '50', 'type' => 'integer', 'group' => 'meal'],
            ['key' => 'dinner_price', 'value' => '60', 'type' => 'integer', 'group' => 'meal'],
            ['key' => 'monthly_fee', 'value' => '2000', 'type' => 'integer', 'group' => 'fee'],
            ['key' => 'meal_deadline_hours', 'value' => '2', 'type' => 'integer', 'group' => 'meal'],
            ['key' => 'currency', 'value' => 'BDT', 'type' => 'string', 'group' => 'general'],
            ['key' => 'max_meals_per_day', 'value' => '2', 'type' => 'integer', 'group' => 'meal'],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
