<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class MarketDataService
{
    private const CACHE_TTL = 30; // seconds

    public function getCurrentPrice(string $symbol): ?float
    {
        $cacheKey = "price:{$symbol}";

        return Cache::get($cacheKey);
    }

    public function getMarketData(string $symbol): ?array
    {
        $cacheKey = "market:{$symbol}";

        return Cache::get($cacheKey);
    }

    public function updatePrice(string $symbol, float $price, array $additional = []): void
    {
        $cacheKey = "price:{$symbol}";
        Cache::put($cacheKey, $price, self::CACHE_TTL);

        // Also update market data cache
        $marketKey = "market:{$symbol}";
        $marketData = Cache::get($marketKey, []);

        $marketData = array_merge($marketData, [
            'spot_price' => $price,
            'timestamp' => now()->toIso8601String(),
            'change_24h' => $additional['change_24h'] ?? 0,
            'change_pct_24h' => $additional['change_pct_24h'] ?? 0,
            'daily_high' => $additional['daily_high'] ?? $price,
            'daily_low' => $additional['daily_low'] ?? $price,
        ]);

        Cache::put($marketKey, $marketData, self::CACHE_TTL * 10);
    }

    public function fetchFromExternal(string $symbol): ?array
    {
        // In production, integrate with a real data provider
        // For now, return simulated data
        $basePrice = match ($symbol) {
            'XAUUSD' => 2350.00,
            'XAGUSD' => 28.50,
            default => 1.00,
        };

        // Simulate small price movements
        $variation = (random_int(-50, 50) / 100);
        $price = $basePrice + $variation;

        return [
            'symbol' => $symbol,
            'price' => round($price, 2),
            'change_24h' => round($variation, 2),
            'change_pct_24h' => round(($variation / $basePrice) * 100, 2),
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
