<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PriceAlertResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'symbol' => $this->symbol,
            'condition' => $this->condition,
            'price_level' => (float) $this->price_level,
            'is_triggered' => $this->is_triggered,
            'condition_label' => $this->getConditionLabel(),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}