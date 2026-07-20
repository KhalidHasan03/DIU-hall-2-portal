<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('meal_attendance', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('daily_menu_id')->constrained('daily_menus')->cascadeOnDelete();
            $table->string('status', 20)->default('booked'); // booked, attended, cancelled
            $table->foreignId('marked_by')->nullable()->constrained('users');
            $table->timestamp('marked_at')->nullable();
            $table->timestamps();
            $table->unique(['student_id', 'daily_menu_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meal_attendance');
    }
};
