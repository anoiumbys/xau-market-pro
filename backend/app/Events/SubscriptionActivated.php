<?php

namespace App\Events;

use App\Models\Subscription;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SubscriptionActivated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Subscription $subscription
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->subscription->user_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'SubscriptionActivated';
    }

    public function broadcastWith(): array
    {
        return [
            'subscription_id' => $this->subscription->id,
            'plan' => $this->subscription->plan_type,
            'starts_at' => $this->subscription->starts_at?->toIso8601String(),
            'expires_at' => $this->subscription->expires_at?->toIso8601String(),
            'activated_at' => now()->toIso8601String(),
        ];
    }
}