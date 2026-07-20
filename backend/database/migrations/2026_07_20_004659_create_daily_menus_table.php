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
        Schema::create('daily_menus', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('meal_type', 10); // lunch, dinner
            $table->text('menu_text');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['date', 'meal_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_menus');
    }
};
