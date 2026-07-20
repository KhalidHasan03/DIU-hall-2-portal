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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('category', 30); // food, utilities, maintenance, staff, furniture, other
            $table->text('description');
            $table->decimal('amount', 10, 2);
            $table->date('expense_date');
            $table->string('vendor')->nullable();
            $table->string('receipt_image')->nullable();
            $table->foreignId('recorded_by')->constrained('users');
            $table->string('status', 20)->default('pending'); // pending, approved, rejected
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
