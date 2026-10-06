<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TradeJournalResource;
use App\Models\TradeJournal;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AdminTradeJournalController extends Controller
{
    #[OA\Get(
        path: '/api/admin/journal',
        summary: 'List all trade journals (admin)',
        tags: ['Admin - Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function index(Request $request)
    {
        $query = TradeJournal::with('user')->latest('opened_at');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->filled('symbol')) {
            $query->where('symbol', strtoupper($request->symbol));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('direction')) {
            $query->where('direction', $request->direction);
        }
        if ($request->filled('from')) {
            $query->whereDate('opened_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('opened_at', '<=', $request->to);
        }

        $trades = $query->paginate($request->integer('per_page', 20));

        return TradeJournalResource::collection($trades);
    }

    #[OA\Get(
        path: '/api/admin/journal/{id}',
        summary: 'Get trade journal details (admin)',
        tags: ['Admin - Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function show(string $id)
    {
        $trade = TradeJournal::with('user')->findOrFail($id);

        return new TradeJournalResource($trade);
    }

    #[OA\Delete(
        path: '/api/admin/journal/{id}',
        summary: 'Delete trade journal (admin)',
        tags: ['Admin - Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function destroy(string $id)
    {
        $trade = TradeJournal::findOrFail($id);
        $trade->delete();

        return response()->noContent();
    }
}
