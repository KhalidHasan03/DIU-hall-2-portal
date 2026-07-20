<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('settings')->insertOrIgnore([
            ['key' => 'lunch_cutoff_time', 'value' => '12:00', 'type' => 'string', 'group' => 'meal'],
            ['key' => 'dinner_cutoff_time', 'value' => '14:00', 'type' => 'string', 'group' => 'meal'],
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', ['lunch_cutoff_time', 'dinner_cutoff_time'])->delete();
    }
};
