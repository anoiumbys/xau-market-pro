<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AuditLogFactory extends Factory
{
    protected $model = AuditLog::class;

    public function definition(): array
    {
        $actions = [
            'created', 'updated', 'deleted', 'approved', 'rejected',
            'activated', 'suspended', 'role_changed', 'login', 'logout',
            'password_changed', 'email_verified', 'subscription_created',
            'subscription_updated', 'subscription_cancelled', 'alert_triggered',
            'trade_opened', 'trade_closed', 'parameter_updated',
        ];
        $entities = [
            'User', 'Market', 'Subscription', 'PriceAlert', 'TradeJournal',
            'MarketParameter', 'AuditLog',
        ];

        return [
            'id' => Str::uuid(),
            'actor_id' => null,
            'action' => fake()->randomElement($actions),
            'entity' => fake()->randomElement($entities),
            'entity_id' => fake()->optional(0.7)->uuid(),
            'old_value' => fake()->optional(0.5)->randomElement([
                null,
                ['name' => fake()->name(), 'email' => fake()->safeEmail()],
                ['status' => 'pending', 'plan_type' => 'basic'],
                ['price_level' => fake()->randomFloat(4, 1800, 2500)],
                ['support_levels' => [2300, 2280], 'resistance_levels' => [2400, 2420]],
            ]),
            'new_value' => fake()->optional(0.5)->randomElement([
                null,
                ['name' => fake()->name(), 'email' => fake()->safeEmail()],
                ['status' => 'active', 'plan_type' => 'pro'],
                ['price_level' => fake()->randomFloat(4, 1800, 2500)],
                ['support_levels' => [2320, 2300, 2280], 'resistance_levels' => [2370, 2390, 2410]],
            ]),
            'ip_address' => fake()->optional(0.8)->ipv4(),
            'user_agent' => fake()->optional(0.8)->userAgent(),
        ];
    }

    public function forActor(User|string $actor): static
    {
        $actorId = $actor instanceof User ? $actor->id : $actor;

        return $this->state(fn (array $attributes) => [
            'actor_id' => $actorId,
        ]);
    }

    public function forEntity(string $entity, ?string $entityId = null): static
    {
        return $this->state(fn (array $attributes) => [
            'entity' => $entity,
            'entity_id' => $entityId ?? fake()->uuid(),
        ]);
    }

    public function forAction(string $action): static
    {
        return $this->state(fn (array $attributes) => [
            'action' => $action,
        ]);
    }

    public function recent(int $days = 30): static
    {
        return $this->state(fn (array $attributes) => [
            'created_at' => fake()->dateTimeBetween("-$days days", 'now'),
        ]);
    }
}
