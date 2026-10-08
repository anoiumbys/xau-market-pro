<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Market extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'markets';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'symbol',
        'name',
        'asset_class',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function parameters(): HasMany
    {
        return $this->hasMany(MarketParameter::class, 'symbol', 'symbol');
    }

    public function priceAlerts(): HasMany
    {
        return $this->hasMany(PriceAlert::class, 'symbol', 'symbol');
    }

    public function tradeJournals(): HasMany
    {
        return $this->hasMany(TradeJournal::class, 'symbol', 'symbol');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeBySymbol($query, string $symbol)
    {
        return $query->where('symbol', strtoupper($symbol));
    }

    // Helper
    public static function getActiveSymbols(): array
    {
        return self::active()->pluck('symbol')->toArray();
    }
}
