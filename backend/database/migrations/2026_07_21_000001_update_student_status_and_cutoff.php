<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('status', 20)->default('pending')->change();
        });

        DB::table('students')->where('status', 'active')->update(['status' => 'approved']);

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
