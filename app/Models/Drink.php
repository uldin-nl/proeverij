<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Drink extends Model
{
    protected $fillable = [
        'name',
        'description',
        'type',
        'alcohol_percentage',
        'brand',
        'origin',
        'image_url',
    ];

    protected $casts = [
        'alcohol_percentage' => 'decimal:2',
    ];

    public function tastingRounds(): HasMany
    {
        return $this->hasMany(TastingRound::class);
    }

    public function getTypeDisplayAttribute(): string
    {
        return match ($this->type) {
            'beer' => 'Bier',
            'wine' => 'Wijn',
            'spirits' => 'Sterke drank',
            'cocktail' => 'Cocktail',
            default => 'Anders',
        };
    }
}
