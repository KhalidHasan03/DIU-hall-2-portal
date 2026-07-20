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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monthly_bill_id')->constrained('monthly_bills')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('payment_method', 30); // cash, bank_transfer, mobile_bkash, nagad, other
            $table->string('transaction_ref')->nullable();
            $table->timestamp('paid_at');
            $table->foreignId('recorded_by')->constrained('users');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
