<?php

namespace App\Events;

use App\Models\Subscription;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewSubscriptionPending implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Subscription $subscription
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('admin.notifications'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'NewSubscriptionPending';
    }

    public function broadcastWith(): array
    {
        return [
            'subscription_id' => $this->subscription->id,
            'user_name' => $this->subscription->user->name,
            'user_email' => $this->subscription->user->email,
            'plan' => $this->subscription->plan_type,
            'created_at' => $this->subscription->created_at->toIso8601String(),
        ];
    }
}
