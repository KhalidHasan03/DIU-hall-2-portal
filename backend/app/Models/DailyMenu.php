<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DailyMenu extends Model
{
    use SoftDeletes;

    protected $fillable = ['date', 'meal_type', 'menu_text', 'created_by'];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function mealAttendances(): HasMany
    {
        return $this->hasMany(MealAttendance::class);
    }
}
