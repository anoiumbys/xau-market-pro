<?php

namespace App\Jobs;

use App\Events\PriceAlertTriggered;
use App\Models\PriceAlert;
use App\Services\MarketDataService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CheckPriceAlerts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public ?string $symbol = null
    ) {}

    public function handle(MarketDataService $marketData): void
    {
        $query = PriceAlert::pending()
            ->with('user');

        if ($this->symbol) {
            $query->forSymbol($this->symbol);
        }

        $alerts = $query->chunk(100, function ($alerts) use ($marketData) {
            foreach ($alerts as $alert) {
                try {
                    $currentPrice = $marketData->getCurrentPrice($alert->symbol);
                    
                    if ($currentPrice && $alert->checkTrigger($currentPrice)) {
                        // Fire event for real-time notification
                        PriceAlertTriggered::dispatch($alert, $currentPrice);
                        
                        Log::info('Price alert triggered', [
                            'alert_id' => $alert->id,
                            'user_id' => $alert->user_id,
                            'symbol' => $alert->symbol,
                            'condition' => $alert->condition,
                            'price_level' => $alert->price_level,
                            'current_price' => $currentPrice,
                        ]);
                    }
                } catch (\Throwable $e) {
                    Log::error('Failed to check price alert', [
                        'alert_id' => $alert->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        });
    }
}