<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class TastingSession extends Model
{
    protected $fillable = [
        'name',
        'description',
        'host_id',
        'status',
        'max_rounds',
        'current_round',
        'invite_code',
        'starts_at',
        'ends_at',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($session) {
            if (empty($session->invite_code)) {
                $session->invite_code = strtoupper(Str::random(8));
            }
        });
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(SessionParticipant::class);
    }

    public function rounds(): HasMany
    {
        return $this->hasMany(TastingRound::class);
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function canStart(): bool
    {
        return $this->status === 'draft' && $this->participants()->count() > 0;
    }
}
