<?php

namespace Database\Factories;

use App\Models\TradeJournal;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TradeJournalFactory extends Factory
{
    protected $model = TradeJournal::class;

    public function definition(): array
    {
        $direction = fake()->randomElement(['long', 'short']);
        $entryPrice = fake()->randomFloat(4, 1800, 2500);
        $lotSize = fake()->randomFloat(4, 0.01, 5.0);
        $stopLoss = $direction === 'long'
            ? fake()->randomFloat(4, 1700, $entryPrice - 1)
            : fake()->randomFloat(4, $entryPrice + 1, 2600);
        $takeProfit = $direction === 'long'
            ? fake()->randomFloat(4, $entryPrice + 1, 2600)
            : fake()->randomFloat(4, 1700, $entryPrice - 1);
        $status = fake()->randomElement(['open', 'closed', 'cancelled']);
        $exitPrice = $status === 'closed' ? fake()->randomFloat(4, 1800, 2500) : null;
        $openedAt = fake()->dateTimeBetween('-6 months', 'now');
        $closedAt = $status === 'closed' ? fake()->dateTimeBetween($openedAt, 'now') : null;

        return [
            'id' => Str::uuid(),
            'user_id' => null,
            'symbol' => fake()->randomElement(['XAUUSD', 'XAGUSD', 'EURUSD', 'BTCUSD']),
            'direction' => $direction,
            'entry_price' => $entryPrice,
            'exit_price' => $exitPrice,
            'lot_size' => $lotSize,
            'stop_loss' => $stopLoss,
            'take_profit' => $takeProfit,
            'pnl' => $exitPrice ? $this->calculatePnl($direction, $entryPrice, $exitPrice, $lotSize) : null,
            'risk_reward' => $this->calculateRiskReward($direction, $entryPrice, $stopLoss, $takeProfit),
            'status' => $status,
            'notes' => fake()->optional(0.5)->sentence(),
            'opened_at' => $openedAt,
            'closed_at' => $closedAt,
        ];
    }

    private function calculatePnl(string $direction, float $entry, float $exit, float $lot): float
    {
        $contractSize = 100;
        $directionMultiplier = $direction === 'long' ? 1 : -1;
        return round(($exit - $entry) * $lot * $contractSize * $directionMultiplier, 2);
    }

    private function calculateRiskReward(string $direction, float $entry, float $sl, float $tp): float
    {
        $risk = abs($entry - $sl);
        $reward = abs($tp - $entry);
        if ($risk <= 0) {
            return 0;
        }
        return round($reward / $risk, 4);
    }

    public function forUser(string $userId): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $userId,
        ]);
    }

    public function forSymbol(string $symbol): static
    {
        return $this->state(fn (array $attributes) => [
            'symbol' => strtoupper($symbol),
        ]);
    }

    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'open',
            'exit_price' => null,
            'pnl' => null,
            'closed_at' => null,
        ]);
    }

    public function closed(float $exitPrice = null): static
    {
        return $this->state(function (array $attributes) use ($exitPrice) {
            $direction = $attributes['direction'] ?? fake()->randomElement(['long', 'short']);
            $entry = $attributes['entry_price'] ?? fake()->randomFloat(4, 1800, 2500);
            $lot = $attributes['lot_size'] ?? fake()->randomFloat(4, 0.01, 5.0);
            $sl = $attributes['stop_loss'] ?? ($direction === 'long'
                ? fake()->randomFloat(4, 1700, $entry - 1)
                : fake()->randomFloat(4, $entry + 1, 2600));
            $tp = $attributes['take_profit'] ?? ($direction === 'long'
                ? fake()->randomFloat(4, $entry + 1, 2600)
                : fake()->randomFloat(4, 1700, $entry - 1));
            $exit = $exitPrice ?? fake()->randomFloat(4, 1800, 2500);

            return [
                'status' => 'closed',
                'exit_price' => $exit,
                'pnl' => $this->calculatePnl($direction, $entry, $exit, $lot),
                'risk_reward' => $this->calculateRiskReward($direction, $entry, $sl, $tp),
                'closed_at' => now(),
            ];
        });
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'exit_price' => null,
            'pnl' => null,
            'closed_at' => null,
        ]);
    }

    public function long(): static
    {
        return $this->state(fn (array $attributes) => [
            'direction' => 'long',
        ]);
    }

    public function short(): static
    {
        return $this->state(fn (array $attributes) => [
            'direction' => 'short',
        ]);
    }

    public function profitable(): static
    {
        return $this->state(function (array $attributes) {
            $direction = $attributes['direction'] ?? 'long';
            $entry = $attributes['entry_price'] ?? 2350;
            $lot = $attributes['lot_size'] ?? 0.1;
            $exit = $direction === 'long'
                ? fake()->randomFloat(4, $entry + 5, 2500)
                : fake()->randomFloat(4, 1800, $entry - 5);

            return [
                'status' => 'closed',
                'exit_price' => $exit,
                'pnl' => $this->calculatePnl($direction, $entry, $exit, $lot),
                'closed_at' => now(),
            ];
        });
    }

    public function losing(): static
    {
        return $this->state(function (array $attributes) {
            $direction = $attributes['direction'] ?? 'long';
            $entry = $attributes['entry_price'] ?? 2350;
            $lot = $attributes['lot_size'] ?? 0.1;
            $exit = $direction === 'long'
                ? fake()->randomFloat(4, 1800, $entry - 5)
                : fake()->randomFloat(4, $entry + 5, 2500);

            return [
                'status' => 'closed',
                'exit_price' => $exit,
                'pnl' => $this->calculatePnl($direction, $entry, $exit, $lot),
                'closed_at' => now(),
            ];
        });
    }

    public function recent(int $days = 30): static
    {
        return $this->state(fn (array $attributes) => [
            'opened_at' => fake()->dateTimeBetween("-$days days", 'now'),
        ]);
    }
}