<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PriceAlertResource;
use App\Models\PriceAlert;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AdminPriceAlertController extends Controller
{
    #[OA\Get(
        path: '/api/admin/alerts',
        summary: 'List all price alerts (admin)',
        tags: ['Admin - Alerts'],
        security: [['sanctum' => []]],
    )]
    public function index(Request $request)
    {
        $query = PriceAlert::with('user')->latest();

        if ($request->filled('symbol')) {
            $query->where('symbol', strtoupper($request->symbol));
        }
        if ($request->filled('is_triggered')) {
            $query->where('is_triggered', $request->boolean('is_triggered'));
        }
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $alerts = $query->paginate($request->integer('per_page', 20));

        return PriceAlertResource::collection($alerts);
    }

    #[OA\Get(
        path: '/api/admin/alerts/{id}',
        summary: 'Get alert details (admin)',
        tags: ['Admin - Alerts'],
        security: [['sanctum' => []]],
    )]
    public function show(string $id)
    {
        $alert = PriceAlert::with('user')->findOrFail($id);
        return new PriceAlertResource($alert);
    }

    #[OA\Delete(
        path: '/api/admin/alerts/{id}',
        summary: 'Delete alert (admin)',
        tags: ['Admin - Alerts'],
        security: [['sanctum' => []]],
    )]
    public function destroy(string $id)
    {
        $alert = PriceAlert::findOrFail($id);
        $alert->delete();

        return response()->noContent();
    }
}