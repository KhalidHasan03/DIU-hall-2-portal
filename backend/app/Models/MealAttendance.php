<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MealAttendance extends Model
{
    protected $table = 'meal_attendance';

    protected $fillable = [
        'student_id', 'daily_menu_id', 'status',
        'marked_by', 'marked_at',
    ];

    protected function casts(): array
    {
        return [
            'marked_at' => 'datetime',
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function dailyMenu(): BelongsTo
    {
        return $this->belongsTo(DailyMenu::class);
    }

    public function marker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }
}
