<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'plan_type' => $this->plan_type,
            'status' => $this->status,
            'payment_ref' => $this->payment_ref,
            'starts_at' => $this->starts_at?->toIso8601String(),
            'expires_at' => $this->expires_at?->toIso8601String(),
            'is_active' => $this->isActive(),
            'days_remaining' => $this->daysRemaining(),
            'limits' => $this->getPlanLimits(),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
