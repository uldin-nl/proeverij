<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TastingReview extends Model
{
    protected $fillable = [
        'tasting_round_id',
        'user_id',
        'rating',
        'review',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function tastingRound(): BelongsTo
    {
        return $this->belongsTo(TastingRound::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getStarsAttribute(): string
    {
        return str_repeat('⭐', $this->rating);
    }
}
