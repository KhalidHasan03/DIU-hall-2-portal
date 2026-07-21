<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->insertOrIgnore([
            'key' => 'meal_rate',
            'value' => '0',
            'type' => 'decimal',
            'group' => 'meal',
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'meal_rate')->delete();
    }
};
