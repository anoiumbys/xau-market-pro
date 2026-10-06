<?php

namespace Database\Factories;

use App\Models\PriceAlert;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PriceAlertFactory extends Factory
{
    protected $model = PriceAlert::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'user_id' => null,
            'symbol' => fake()->randomElement(['XAUUSD', 'XAGUSD', 'EURUSD', 'BTCUSD']),
            'condition' => fake()->randomElement(['above', 'below', 'cross']),
            'price_level' => fake()->randomFloat(4, 1800, 2500),
            'is_triggered' => fake()->boolean(20),
        ];
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

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_triggered' => false,
        ]);
    }

    public function triggered(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_triggered' => true,
        ]);
    }

    public function above(?float $price = null): static
    {
        return $this->state(fn (array $attributes) => [
            'condition' => 'above',
            'price_level' => $price ?? fake()->randomFloat(4, 2350, 2500),
        ]);
    }

    public function below(?float $price = null): static
    {
        return $this->state(fn (array $attributes) => [
            'condition' => 'below',
            'price_level' => $price ?? fake()->randomFloat(4, 1800, 2300),
        ]);
    }

    public function crosses(?float $price = null): static
    {
        return $this->state(fn (array $attributes) => [
            'condition' => 'cross',
            'price_level' => $price ?? fake()->randomFloat(4, 2000, 2400),
        ]);
    }
}
