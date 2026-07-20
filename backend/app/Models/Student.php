<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'student_id', 'room_number', 'department',
        'batch', 'emergency_contact', 'admission_date', 'status',
        'balance',
    ];

    protected function casts(): array
    {
        return [
            'admission_date' => 'date',
            'balance' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function mealAttendances(): HasMany
    {
        return $this->hasMany(MealAttendance::class);
    }

    public function monthlyBills(): HasMany
    {
        return $this->hasMany(MonthlyBill::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
