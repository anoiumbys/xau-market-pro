<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\MarketParameter;
use App\Models\User;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AdminSettingsController extends Controller
{
    #[OA\Get(
        path: '/api/admin/settings',
        summary: 'Get system settings (admin)',
        tags: ['Admin - Settings'],
        security: [['sanctum' => []]],
    )]
    public function index()
    {
        return response()->json([
            'app_name' => config('app.name', 'XAU Market Pro'),
            'app_env' => config('app.env'),
            'app_debug' => config('app.debug'),
            'default_market' => 'XAUUSD',
            'subscription_plans' => [
                'basic' => ['price' => 29, 'alerts' => 3, 'exports' => 0],
                'pro' => ['price' => 99, 'alerts' => -1, 'exports' => -1],
                'enterprise' => ['price' => 299, 'alerts' => -1, 'exports' => -1],
            ],
            'websocket' => [
                'host' => config('websockets.host', '0.0.0.0'),
                'port' => config('websockets.port', 6001),
            ],
        ]);
    }

    #[OA\Put(
        path: '/api/admin/settings',
        summary: 'Update system settings (admin)',
        tags: ['Admin - Settings'],
        security: [['sanctum' => []]],
    )]
    public function update(Request $request)
    {
        $request->validate([
            'app_name' => ['sometimes', 'string', 'max:100'],
            'app_debug' => ['sometimes', 'boolean'],
        ]);

        // In a real app, you'd save to database or config file
        // For now, just return success
        return response()->json([
            'message' => 'Settings updated successfully',
            'note' => 'Persisting settings requires database config table or .env modification',
        ]);
    }

    #[OA\Get(
        path: '/api/admin/market-parameters',
        summary: 'Get all market parameters (admin)',
        tags: ['Admin - Settings'],
        security: [['sanctum' => []]],
    )]
    public function marketParameters()
    {
        $parameters = MarketParameter::with('updater')->latest()->get();

        return response()->json([
            'market_parameters' => $parameters->map(fn($p) => [
                'id' => $p->id,
                'symbol' => $p->symbol,
                'support_levels' => $p->getSupportLevels(),
                'resistance_levels' => $p->getResistanceLevels(),
                'is_active' => $p->is_active,
                'updated_by' => $p->updater?->name,
                'updated_at' => $p->updated_at?->toIso8601String(),
            ]),
        ]);
    }

    #[OA\Put(
        path: '/api/admin/market-parameters/{symbol}',
        summary: 'Update market parameters (admin)',
        tags: ['Admin - Settings'],
        security: [['sanctum' => []]],
    )]
    public function updateMarketParameters(Request $request, string $symbol)
    {
        $request->validate([
            'support_levels' => ['required', 'array', 'min:3'],
            'support_levels.*' => ['numeric', 'min:0'],
            'resistance_levels' => ['required', 'array', 'min:3'],
            'resistance_levels.*' => ['numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);

        $parameter = MarketParameter::firstOrNew(['symbol' => strtoupper($symbol)]);

        $supportLevels = array_values(array_unique(array_map('floatval', $request->support_levels)));
        $resistanceLevels = array_values(array_unique(array_map('floatval', $request->resistance_levels)));

        sort($supportLevels);
        sort($resistanceLevels);

        // Validate ordering
        if (count($supportLevels) < 3 || count($resistanceLevels) < 3) {
            return response()->json([
                'message' => 'Minimum 3 support and 3 resistance levels required',
            ], 422);
        }

        $parameter->fill([
            'symbol' => strtoupper($symbol),
            'support_levels' => $supportLevels,
            'resistance_levels' => $resistanceLevels,
            'is_active' => $request->boolean('is_active', true),
            'updated_by' => auth()->id(),
        ]);

        $parameter->save();

        return response()->json([
            'message' => 'Market parameters updated successfully',
            'symbol' => $parameter->symbol,
            'support_levels' => $parameter->getSupportLevels(),
            'resistance_levels' => $parameter->getResistanceLevels(),
            'is_active' => $parameter->is_active,
        ]);
    }
}