<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TastingRound extends Model
{
    protected $fillable = [
        'tasting_session_id',
        'drink_id',
        'round_number',
        'status',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function tastingSession(): BelongsTo
    {
        return $this->belongsTo(TastingSession::class);
    }

    public function drink(): BelongsTo
    {
        return $this->belongsTo(Drink::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(TastingReview::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function getAverageRatingAttribute(): float
    {
        return $this->reviews()->avg('rating') ?? 0;
    }
}
