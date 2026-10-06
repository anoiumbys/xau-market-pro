<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarketDataResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'symbol' => $this->symbol,
            'spot_price' => (float) $this->spot_price,
            'daily_high' => (float) $this->daily_high,
            'daily_low' => (float) $this->daily_low,
            'change_24h' => (float) $this->change_24h,
            'change_pct_24h' => (float) $this->change_pct_24h,
            'market_status' => $this->market_status,
            'timestamp' => $this->timestamp?->toIso8601String() ?? now()->toIso8601String(),
        ];
    }
}
