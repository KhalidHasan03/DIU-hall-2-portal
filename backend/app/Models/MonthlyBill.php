<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonthlyBill extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'student_id', 'month', 'total_lunches', 'total_dinners',
        'lunch_amount', 'dinner_amount', 'total_amount',
        'status', 'generated_by', 'approved_by', 'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getPaidAmountAttribute(): float
    {
        return $this->payments()->sum('amount');
    }

    public function getDueAmountAttribute(): float
    {
        return max(0, $this->total_amount - $this->paid_amount);
    }
}
