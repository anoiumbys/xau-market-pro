<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TradeJournalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'symbol' => $this->symbol,
            'direction' => $this->direction,
            'entry_price' => (float) $this->entry_price,
            'exit_price' => $this->exit_price ? (float) $this->exit_price : null,
            'lot_size' => (float) $this->lot_size,
            'stop_loss' => $this->stop_loss ? (float) $this->stop_loss : null,
            'take_profit' => $this->take_profit ? (float) $this->take_profit : null,
            'pnl' => $this->pnl ? (float) $this->pnl : null,
            'risk_reward' => $this->risk_reward ? (float) $this->risk_reward : null,
            'status' => $this->status,
            'notes' => $this->notes,
            'opened_at' => $this->opened_at->toIso8601String(),
            'closed_at' => $this->closed_at?->toIso8601String(),
            'direction_label' => $this->getDirectionLabel(),
            'status_label' => $this->getStatusLabel(),
            'is_profitable' => $this->isProfitable(),
        ];
    }
}
