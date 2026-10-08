<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TradeJournal extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'trade_journal';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'symbol',
        'direction',
        'entry_price',
        'exit_price',
        'lot_size',
        'stop_loss',
        'take_profit',
        'pnl',
        'risk_reward',
        'status',
        'notes',
        'opened_at',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'entry_price' => 'decimal:4',
            'exit_price' => 'decimal:4',
            'lot_size' => 'decimal:4',
            'stop_loss' => 'decimal:4',
            'take_profit' => 'decimal:4',
            'pnl' => 'decimal:2',
            'risk_reward' => 'decimal:4',
            'opened_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function scopeForSymbol($query, string $symbol)
    {
        return $query->where('symbol', strtoupper($symbol));
    }

    public function scopeLong($query)
    {
        return $query->where('direction', 'long');
    }

    public function scopeShort($query)
    {
        return $query->where('direction', 'short');
    }

    public function scopeDateRange($query, $from, $to)
    {
        return $query->whereBetween('opened_at', [$from, $to]);
    }

    // Computed attributes
    protected function pnl(): Attribute
    {
        return Attribute::make(
            get: function ($value, $attributes) {
                if ($value !== null) {
                    return (float) $value;
                }

                // Auto-calculate if exit_price exists
                if (! empty($attributes['exit_price']) && ! empty($attributes['entry_price'])) {
                    $contractSize = 100; // XAUUSD contract size
                    $direction = $attributes['direction'] === 'long' ? 1 : -1;

                    return round(
                        ($attributes['exit_price'] - $attributes['entry_price'])
                        * $attributes['lot_size']
                        * $contractSize
                        * $direction, 2
                    );
                }

                return null;
            }
        );
    }

    protected function riskReward(): Attribute
    {
        return Attribute::make(
            get: function ($value, $attributes) {
                if ($value !== null) {
                    return (float) $value;
                }

                if (! empty($attributes['stop_loss']) && ! empty($attributes['take_profit']) && ! empty($attributes['entry_price'])) {
                    $direction = $attributes['direction'] === 'long' ? 1 : -1;
                    $risk = abs($attributes['entry_price'] - $attributes['stop_loss']);
                    $reward = abs($attributes['take_profit'] - $attributes['entry_price']);

                    if ($risk > 0) {
                        return round($reward / $risk, 4);
                    }
                }

                return null;
            }
        );
    }

    // Helpers
    public function calculatePnl(): ?float
    {
        if (! $this->exit_price) {
            return null;
        }

        $contractSize = 100; // XAUUSD
        $direction = $this->direction === 'long' ? 1 : -1;

        return round(
            ($this->exit_price - $this->entry_price)
            * $this->lot_size
            * $contractSize
            * $direction, 2
        );
    }

    public function calculateRiskReward(): ?float
    {
        if (! $this->stop_loss || ! $this->take_profit) {
            return null;
        }

        $risk = abs($this->entry_price - $this->stop_loss);
        $reward = abs($this->take_profit - $this->entry_price);

        if ($risk <= 0) {
            return null;
        }

        return round($reward / $risk, 4);
    }

    public function close(float $exitPrice): void
    {
        $this->update([
            'exit_price' => $exitPrice,
            'status' => 'closed',
            'closed_at' => now(),
            'pnl' => $this->calculatePnl(),
        ]);
    }

    public function getDirectionLabel(): string
    {
        return $this->direction === 'long' ? 'Long' : 'Short';
    }

    public function getStatusLabel(): string
    {
        return match ($this->status) {
            'open' => 'Open',
            'closed' => 'Closed',
            'cancelled' => 'Cancelled',
            default => $this->status,
        };
    }

    public function isProfitable(): ?bool
    {
        if ($this->pnl === null) {
            return null;
        }

        return $this->pnl > 0;
    }
}
