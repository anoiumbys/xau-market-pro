<?php

namespace App\Services;

use App\Models\Market;
use App\Models\MarketParameter;
use App\Models\TradeJournal;

class IndicatorService
{
    /**
     * Calculate trend bias based on price vs support/resistance
     */
    public function calculateTrend(float $currentPrice, array $supportLevels, array $resistanceLevels): string
    {
        if (empty($supportLevels) && empty($resistanceLevels)) {
            return 'NEUTRAL';
        }

        $nearestSupport = $this->getNearestSupport($currentPrice, $supportLevels);
        $nearestResistance = $this->getNearestResistance($currentPrice, $resistanceLevels);

        // Price near resistance -> BEARISH pressure
        // Price near support -> BULLISH pressure
        // Price in middle -> NEUTRAL

        if ($nearestSupport && $nearestResistance) {
            $range = $nearestResistance - $nearestSupport;
            $position = ($currentPrice - $nearestSupport) / $range;

            if ($position >= 0.7) {
                return 'BEARISH'; // Near resistance
            } elseif ($position <= 0.3) {
                return 'BULLISH'; // Near support
            }
        } elseif ($nearestSupport) {
            $distance = ($currentPrice - $nearestSupport) / $currentPrice;
            if ($distance <= 0.01) {
                return 'BULLISH'; // Very close to support
            }
        } elseif ($nearestResistance) {
            $distance = ($nearestResistance - $currentPrice) / $currentPrice;
            if ($distance <= 0.01) {
                return 'BEARISH'; // Very close to resistance
            }
        }

        return 'NEUTRAL';
    }

    /**
     * Calculate classic pivot points
     */
    public function calculatePivotPoints(float $high, float $low, float $close): array
    {
        $pivot = ($high + $low + $close) / 3;
        
        return [
            'pivot' => round($pivot, 2),
            'r1' => round(2 * $pivot - $low, 2),
            'r2' => round($pivot + ($high - $low), 2),
            'r3' => round($high + 2 * ($pivot - $low), 2),
            's1' => round(2 * $pivot - $high, 2),
            's2' => round($pivot - ($high - $low), 2),
            's3' => round($low - 2 * ($high - $pivot), 2),
        ];
    }

    /**
     * Calculate Fibonacci retracement levels
     */
    public function calculateFibonacciLevels(float $high, float $low): array
    {
        $diff = $high - $low;
        
        return [
            '0' => round($high, 2),
            '0.236' => round($high - $diff * 0.236, 2),
            '0.382' => round($high - $diff * 0.382, 2),
            '0.5' => round($high - $diff * 0.5, 2),
            '0.618' => round($high - $diff * 0.618, 2),
            '0.786' => round($high - $diff * 0.786, 2),
            '1' => round($low, 2),
        ];
    }

    /**
     * Get market status based on forex hours
     */
    public function getMarketStatus(): string
    {
        $now = now('UTC');
        $dayOfWeek = $now->dayOfWeek; // 0 = Sunday, 6 = Saturday
        $hour = $now->hour;

        // Forex market: Sunday 22:00 UTC to Friday 22:00 UTC
        if ($dayOfWeek === 0 && $hour < 22) {
            return 'CLOSED'; // Sunday before open
        }
        if ($dayOfWeek === 5 && $hour >= 22) {
            return 'CLOSED'; // Friday after close
        }
        if ($dayOfWeek === 6) {
            return 'CLOSED'; // Saturday
        }

        return 'OPEN';
    }

    /**
     * Get next market status change time
     */
    public function getNextMarketChange(): ?string
    {
        $now = now('UTC');
        $dayOfWeek = $now->dayOfWeek;
        $hour = $now->hour;

        if ($this->getMarketStatus() === 'OPEN') {
            // Market is open, next close is Friday 22:00 UTC
            if ($dayOfWeek < 5) {
                return $now->next(5)->setTime(22, 0, 0)->toIso8601String();
            } elseif ($dayOfWeek === 5 && $hour < 22) {
                return $now->setTime(22, 0, 0)->toIso8601String();
            }
        } else {
            // Market is closed, next open is Sunday 22:00 UTC
            if ($dayOfWeek === 0 && $hour < 22) {
                return $now->setTime(22, 0, 0)->toIso8601String();
            } elseif ($dayOfWeek === 0 && $hour >= 22) {
                return $now->addWeek()->setTime(22, 0, 0)->toIso8601String();
            } elseif ($dayOfWeek === 6) {
                return $now->addDay()->setTime(22, 0, 0)->toIso8601String();
            } else {
                return $now->next(0)->setTime(22, 0, 0)->toIso8601String();
            }
        }

        return null;
    }

    /**
     * Calculate daily range statistics
     */
    public function calculateDailyRange(array $prices): array
    {
        if (empty($prices)) {
            return ['high' => null, 'low' => null, 'open' => null, 'close' => null];
        }

        return [
            'high' => round(max($prices), 2),
            'low' => round(min($prices), 2),
            'open' => round($prices[0], 2),
            'close' => round(end($prices), 2),
        ];
    }

    private function getNearestSupport(float $price, array $supports): ?float
    {
        $valid = array_filter($supports, fn($level) => $level < $price);
        return $valid ? max($valid) : null;
    }

    private function getNearestResistance(float $price, array $resistances): ?float
    {
        $valid = array_filter($resistances, fn($level) => $level > $price);
        return $valid ? min($valid) : null;
    }
}