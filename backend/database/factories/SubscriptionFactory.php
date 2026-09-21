<?php

namespace Database\Factories;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class SubscriptionFactory extends Factory
{
    protected $model = Subscription::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'user_id' => null,
            'plan_type' => fake()->randomElement(['basic', 'pro', 'enterprise']),
            'status' => fake()->randomElement(['pending', 'active', 'expired', 'cancelled']),
            'payment_ref' => Str::upper(Str::random(20)),
            'starts_at' => fake()->optional(0.7)->dateTimeBetween('-1 month', '+1 month'),
            'expires_at' => fake()->optional(0.8)->dateTimeBetween('+1 month', '+1 year'),
        ];
    }

    public function forUser(string $userId): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $userId,
        ]);
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'starts_at' => now()->subDays(fake()->numberBetween(1, 30)),
            'expires_at' => now()->addDays(fake()->numberBetween(30, 365)),
        ]);
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'starts_at' => null,
            'expires_at' => null,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'expired',
            'starts_at' => now()->subDays(fake()->numberBetween(60, 400)),
            'expires_at' => now()->subDays(fake()->numberBetween(1, 30)),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'starts_at' => now()->subDays(fake()->numberBetween(30, 180)),
            'expires_at' => now()->subDays(fake()->numberBetween(1, 30)),
        ]);
    }

    public function basic(): static
    {
        return $this->state(fn (array $attributes) => [
            'plan_type' => 'basic',
        ]);
    }

    public function pro(): static
    {
        return $this->state(fn (array $attributes) => [
            'plan_type' => 'pro',
        ]);
    }

    public function enterprise(): static
    {
        return $this->state(fn (array $attributes) => [
            'plan_type' => 'enterprise',
        ]);
    }
}