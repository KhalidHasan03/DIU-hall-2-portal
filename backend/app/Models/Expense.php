<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category', 'description', 'amount', 'expense_date',
        'vendor', 'receipt_image', 'recorded_by',
        'status', 'approved_by', 'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'expense_date' => 'date',
            'approved_at' => 'datetime',
        ];
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
