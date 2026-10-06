<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PriceTick implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $symbol,
        public float $price,
        public float $change24h,
        public float $changePct24h
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel("market.{$this->symbol}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'PriceTick';
    }

    public function broadcastWith(): array
    {
        return [
            'price' => $this->price,
            'timestamp' => now()->toIso8601String(),
            'change_24h' => $this->change24h,
            'change_pct_24h' => $this->changePct24h,
        ];
    }
}
