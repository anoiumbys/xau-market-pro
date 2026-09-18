<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarketParameterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'symbol' => $this->symbol,
            'support_levels' => $this->support_levels ?? [],
            'resistance_levels' => $this->resistance_levels ?? [],
            'pivot_points' => $this->when(isset($this->pivot_points), $this->pivot_points),
            'updated_by' => $this->whenLoaded('updater', fn() => [
                'id' => $this->updater->id,
                'name' => $this->updater->name,
            ]),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}