<?php

namespace Database\Factories;

use App\Models\MarketParameter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MarketParameterFactory extends Factory
{
    protected $model = MarketParameter::class;

    public function definition(): array
    {
        $basePrice = fake()->randomFloat(2, 1800, 2500);
        $supportCount = fake()->numberBetween(3, 6);
        $resistanceCount = fake()->numberBetween(3, 6);

        $supportLevels = [];
        $resistanceLevels = [];

        for ($i = 0; $i < $supportCount; $i++) {
            $supportLevels[] = round($basePrice - fake()->randomFloat(2, 10, 100) - $i * fake()->randomFloat(2, 5, 30), 2);
        }

        for ($i = 0; $i < $resistanceCount; $i++) {
            $resistanceLevels[] = round($basePrice + fake()->randomFloat(2, 10, 100) + $i * fake()->randomFloat(2, 5, 30), 2);
        }

        return [
            'id' => Str::uuid(),
            'symbol' => fake()->randomElement(['XAUUSD', 'XAGUSD', 'EURUSD', 'BTCUSD']),
            'support_levels' => $supportLevels,
            'resistance_levels' => $resistanceLevels,
            'updated_by' => null,
            'is_active' => fake()->boolean(80),
        ];
    }

    public function forSymbol(string $symbol): static
    {
        return $this->state(fn (array $attributes) => [
            'symbol' => strtoupper($symbol),
        ]);
    }

    public function xauusd(): static
    {
        return $this->state(fn (array $attributes) => [
            'symbol' => 'XAUUSD',
            'support_levels' => [2320.00, 2300.00, 2280.00, 2260.00],
            'resistance_levels' => [2370.00, 2390.00, 2410.00, 2430.00],
            'is_active' => true,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function updatedBy(User|string $user): static
    {
        $userId = $user instanceof User ? $user->id : $user;
        return $this->state(fn (array $attributes) => [
            'updated_by' => $userId,
        ]);
    }
}