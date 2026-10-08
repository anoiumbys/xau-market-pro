<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MarketDataResource;
use App\Models\Market;
use App\Services\IndicatorService;
use App\Services\MarketDataService;
use OpenApi\Attributes as OA;

class MarketController extends Controller
{
    public function __construct(
        private MarketDataService $marketData,
        private IndicatorService $indicators
    ) {}

    #[OA\Get(
        path: '/api/market/{symbol}',
        summary: 'Get market data for a symbol',
        tags: ['Market'],
        parameters: [
            new OA\Parameter(
                name: 'symbol',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', enum: ['XAUUSD'])
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Success', content: new OA\JsonContent(ref: '#/components/schemas/MarketData')),
            new OA\Response(response: 404, description: 'Market not found'),
        ]
    )]
    public function show(string $symbol)
    {
        $market = Market::where('symbol', strtoupper($symbol))
            ->where('is_active', true)
            ->firstOrFail();

        // Get cached data or fetch fresh
        $marketData = $this->marketData->getMarketData($symbol);

        if (! $marketData) {
            $marketData = $this->marketData->fetchFromExternal($symbol);
            if ($marketData) {
                $this->marketData->updatePrice($symbol, $marketData['price'], $marketData);
            }
        }

        // Get market parameters for S/R levels
        $parameters = $market->parameters()->active()->first();

        // NOTE: MarketDataService::updatePrice() caches the price under
        // 'spot_price', while fetchFromExternal() returns it as 'price'.
        // Accept both so spot is never silently 0.
        $price = $marketData['spot_price'] ?? $marketData['price'] ?? 0;

        $response = (object) [
            'symbol' => $market->symbol,
            'spot_price' => $price,
            'daily_high' => $marketData['daily_high'] ?? $price,
            'daily_low' => $marketData['daily_low'] ?? $price,
            'change_24h' => $marketData['change_24h'] ?? 0,
            'change_pct_24h' => $marketData['change_pct_24h'] ?? 0,
            'market_status' => $this->indicators->getMarketStatus(),
            'timestamp' => now(),
        ];

        return new MarketDataResource($response);
    }
}
