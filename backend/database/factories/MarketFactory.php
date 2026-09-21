<?php

namespace Database\Factories;

use App\Models\Market;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MarketFactory extends Factory
{
    protected $model = Market::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'symbol' => strtoupper(fake()->unique()->regexify('[A-Z]{3,6}[A-Z]{3}')),
            'name' => fake()->words(3, true),
            'asset_class' => fake()->randomElement(['COMMODITY', 'FOREX', 'CRYPTO', 'INDEX', 'STOCK']),
            'is_active' => fake()->boolean(30),
        ];
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

    public function xauusd(): static
    {
        return $this->state(fn (array $attributes) => [
            'symbol' => 'XAUUSD',
            'name' => 'Gold / US Dollar',
            'asset_class' => 'COMMODITY',
            'is_active' => true,
        ]);
    }

    public function xagusd(): static
    {
        return $this->state(fn (array $attributes) => [
            'symbol' => 'XAGUSD',
            'name' => 'Silver / US Dollar',
            'asset_class' => 'COMMODITY',
            'is_active' => false,
        ]);
    }

    public function eurusd(): static
    {
        return $this->state(fn (array $attributes) => [
            'symbol' => 'EURUSD',
            'name' => 'Euro / US Dollar',
            'asset_class' => 'FOREX',
            'is_active' => false,
        ]);
    }

    public function btcusd(): static
    {
        return $this->state(fn (array $attributes) => [
            'symbol' => 'BTCUSD',
            'name' => 'Bitcoin / US Dollar',
            'asset_class' => 'CRYPTO',
            'is_active' => false,
        ]);
    }
}