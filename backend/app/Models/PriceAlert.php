<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PriceAlert extends Model
{
    use HasFactory;

    protected $table = 'price_alerts';

    protected $fillable = [
        'user_id',
        'symbol',
        'condition',
        'price_level',
        'is_triggered',
    ];

    protected function casts(): array
    {
        return [
            'price_level' => 'decimal:4',
            'is_triggered' => 'boolean',
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('is_triggered', false);
    }

    public function scopeTriggered($query)
    {
        return $query->where('is_triggered', true);
    }

    public function scopeForSymbol($query, string $symbol)
    {
        return $query->where('symbol', strtoupper($symbol));
    }

    // Helpers
    public function checkTrigger(float $currentPrice): bool
    {
        if ($this->is_triggered) {
            return false;
        }

        $triggered = match ($this->condition) {
            'above' => $currentPrice > $this->price_level,
            'below' => $currentPrice < $this->price_level,
            'cross' => abs($currentPrice - $this->price_level) < 0.01,
            default => false,
        };

        if ($triggered) {
            $this->update(['is_triggered' => true]);
        }

        return $triggered;
    }

    public function getConditionLabel(): string
    {
        return match ($this->condition) {
            'above' => 'Above',
            'below' => 'Below',
            'cross' => 'Crosses',
            default => $this->condition,
        };
    }
}
