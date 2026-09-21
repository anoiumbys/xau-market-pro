<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password123'),
            'role' => fake()->randomElement(['guest', 'trader', 'admin']),
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }

    public function trader(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'trader',
            'email_verified_at' => now(),
        ]);
    }

    public function guest(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'guest',
            'email_verified_at' => now(),
        ]);
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}