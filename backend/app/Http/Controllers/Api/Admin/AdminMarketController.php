<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\MarketDataResource;
use App\Models\Market;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AdminMarketController extends Controller
{
    #[OA\Get(
        path: '/api/admin/markets',
        summary: 'List all markets (admin)',
        tags: ['Admin - Markets'],
        security: [['sanctum' => []]],
    )]
    public function index()
    {
        $markets = Market::with('parameters')->latest()->get();
        return MarketDataResource::collection($markets);
    }

    #[OA\Post(
        path: '/api/admin/markets',
        summary: 'Create new market (admin)',
        tags: ['Admin - Markets'],
        security: [['sanctum' => []]],
    )]
    public function store(Request $request)
    {
        $request->validate([
            'symbol' => ['required', 'string', 'max:20', 'unique:markets,symbol'],
            'name' => ['required', 'string', 'max:100'],
            'asset_class' => ['required', 'string', 'max:30'],
            'is_active' => ['boolean'],
        ]);

        $market = Market::create([
            'symbol' => strtoupper($request->symbol),
            'name' => $request->name,
            'asset_class' => $request->asset_class,
            'is_active' => $request->boolean('is_active', false),
        ]);

        return (new MarketDataResource($market))->response()->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/admin/markets/{id}',
        summary: 'Get market details (admin)',
        tags: ['Admin - Markets'],
        security: [['sanctum' => []]],
    )]
    public function show(string $id)
    {
        $market = Market::with('parameters')->findOrFail($id);
        return new MarketDataResource($market);
    }

    #[OA\Put(
        path: '/api/admin/markets/{id}',
        summary: 'Update market (admin)',
        tags: ['Admin - Markets'],
        security: [['sanctum' => []]],
    )]
    public function update(Request $request, string $id)
    {
        $market = Market::findOrFail($id);

        $request->validate([
            'symbol' => ['sometimes', 'string', 'max:20', 'unique:markets,symbol,' . $market->id],
            'name' => ['sometimes', 'string', 'max:100'],
            'asset_class' => ['sometimes', 'string', 'max:30'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $data = $request->only(['name', 'asset_class', 'is_active']);
        if ($request->filled('symbol')) {
            $data['symbol'] = strtoupper($request->symbol);
        }

        $market->update($data);

        return new MarketDataResource($market->refresh());
    }

    #[OA\Put(
        path: '/api/admin/markets/{id}/toggle',
        summary: 'Toggle market active status (admin)',
        tags: ['Admin - Markets'],
        security: [['sanctum' => []]],
    )]
    public function toggleActive(string $id)
    {
        $market = Market::findOrFail($id);
        $market->update(['is_active' => !$market->is_active]);

        return new MarketDataResource($market->refresh());
    }

    #[OA\Delete(
        path: '/api/admin/markets/{id}',
        summary: 'Delete market (admin)',
        tags: ['Admin - Markets'],
        security: [['sanctum' => []]],
    )]
    public function destroy(string $id)
    {
        $market = Market::findOrFail($id);

        // Prevent deleting XAUUSD
        if ($market->symbol === 'XAUUSD') {
            return response()->json(['message' => 'Cannot delete primary market XAUUSD'], 422);
        }

        $market->delete();

        return response()->noContent();
    }
}