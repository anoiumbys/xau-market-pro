<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class MarketParameter extends Model
{
    use HasFactory;

    protected $table = 'market_parameters';

    protected $fillable = [
        'symbol',
        'support_levels',
        'resistance_levels',
        'updated_by',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'support_levels' => 'array',
            'resistance_levels' => 'array',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForSymbol($query, string $symbol)
    {
        return $query->where('symbol', strtoupper($symbol));
    }

    // Computed attributes
    protected function supportLevels(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                return is_array($value) ? array_map('floatval', $value) : [];
            },
            set: function ($value) {
                return array_values(array_filter(array_map('floatval', (array) $value)));
            }
        );
    }

    protected function resistanceLevels(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                return is_array($value) ? array_map('floatval', $value) : [];
            },
            set: function ($value) {
                return array_values(array_filter(array_map('floatval', (array) $value)));
            }
        );
    }

    // Helpers
    public function getSupportLevels(): array
    {
        return $this->support_levels ?? [];
    }

    public function getResistanceLevels(): array
    {
        return $this->resistance_levels ?? [];
    }

    public function getNearestSupport(float $currentPrice): ?float
    {
        $supports = array_filter($this->getSupportLevels(), fn($level) => $level < $currentPrice);
        return $supports ? max($supports) : null;
    }

    public function getNearestResistance(float $currentPrice): ?float
    {
        $resistances = array_filter($this->getResistanceLevels(), fn($level) => $level > $currentPrice);
        return $resistances ? min($resistances) : null;
    }

    public function calculatePivotPoints(float $high, float $low, float $close): array
    {
        $pivot = ($high + $low + $close) / 3;
        
        return [
            'pivot' => round($pivot, 2),
            'r1' => round(2 * $pivot - $low, 2),
            'r2' => round($pivot + ($high - $low), 2),
            'r3' => round($high + 2 * ($pivot - $low), 2),
            's1' => round(2 * $pivot - $high, 2),
            's2' => round($pivot - ($high - $low), 2),
            's3' => round($low - 2 * ($high - $pivot), 2),
        ];
    }

    public function validateLevels(): array
    {
        $errors = [];
        
        if (count($this->getSupportLevels()) < 3) {
            $errors[] = 'Minimum 3 support levels required';
        }
        
        if (count($this->getResistanceLevels()) < 3) {
            $errors[] = 'Minimum 3 resistance levels required';
        }

        // Check for duplicates
        $supports = $this->getSupportLevels();
        $resistances = $this->getResistanceLevels();
        
        if (count($supports) !== count(array_unique($supports))) {
            $errors[] = 'Support levels must be unique';
        }
        
        if (count($resistances) !== count(array_unique($resistances))) {
            $errors[] = 'Resistance levels must be unique';
        }

        // Check ordering
        if ($supports !== array_values(array_unique($supports)) || $supports !== array_reverse(array_reverse($supports))) {
            // Just warn, don't error
        }

        return $errors;
    }
}