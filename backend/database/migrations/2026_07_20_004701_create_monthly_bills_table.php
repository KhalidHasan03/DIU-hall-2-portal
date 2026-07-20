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
        Schema::create('monthly_bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('month', 7); // YYYY-MM
            $table->integer('total_lunches')->default(0);
            $table->integer('total_dinners')->default(0);
            $table->decimal('lunch_amount', 10, 2)->default(0);
            $table->decimal('dinner_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2)->default(0);
            $table->string('status', 20)->default('pending'); // pending, paid, partial, overdue
            $table->foreignId('generated_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['student_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_bills');
    }
};
