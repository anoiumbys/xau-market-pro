<?php

namespace App\Events;

use App\Models\PriceAlert;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PriceAlertTriggered implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public PriceAlert $alert,
        public float $currentPrice
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("alerts.{$this->alert->user_id}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'PriceAlertTriggered';
    }

    public function broadcastWith(): array
    {
        return [
            'alert_id' => $this->alert->id,
            'symbol' => $this->alert->symbol,
            'condition' => $this->alert->condition,
            'price_level' => (float) $this->alert->price_level,
            'current_price' => $this->currentPrice,
            'triggered_at' => now()->toIso8601String(),
        ];
    }
}
