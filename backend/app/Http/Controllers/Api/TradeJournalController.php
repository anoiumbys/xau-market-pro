<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTradeJournalRequest;
use App\Http\Requests\UpdateTradeJournalRequest;
use App\Http\Resources\TradeJournalResource;
use App\Models\TradeJournal;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class TradeJournalController extends Controller
{
    #[OA\Get(
        path: '/api/journal',
        summary: 'List user trade journal entries',
        tags: ['Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function index(Request $request)
    {
        $query = $request->user()->tradeJournals()->latest('opened_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('symbol')) {
            $query->where('symbol', strtoupper($request->symbol));
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

    #[OA\Post(
        path: '/api/journal',
        summary: 'Create a new trade journal entry',
        tags: ['Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function store(StoreTradeJournalRequest $request)
    {
        $trade = $request->user()->tradeJournals()->create([
            'symbol' => strtoupper($request->symbol),
            'direction' => $request->direction,
            'entry_price' => $request->entry_price,
            'lot_size' => $request->lot_size,
            'stop_loss' => $request->stop_loss,
            'take_profit' => $request->take_profit,
            'notes' => $request->notes,
            'opened_at' => now(),
            'status' => 'open',
        ]);

        return (new TradeJournalResource($trade))
            ->response()
            ->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/journal/{id}',
        summary: 'Get a specific trade journal entry',
        tags: ['Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function show(Request $request, string $id)
    {
        $trade = $request->user()->tradeJournals()->findOrFail($id);
        return new TradeJournalResource($trade);
    }

    #[OA\Put(
        path: '/api/journal/{id}',
        summary: 'Update a trade journal entry',
        tags: ['Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function update(UpdateTradeJournalRequest $request, string $id)
    {
        $trade = $request->user()->tradeJournals()->findOrFail($id);

        $data = $request->validated();

        // Auto-calculate PnL and risk_reward if exit_price provided
        if ($request->filled('exit_price')) {
            $data['exit_price'] = $request->exit_price;
            $data['status'] = 'closed';
            $data['closed_at'] = now();
            $data['pnl'] = $trade->calculatePnl();
            $data['risk_reward'] = $trade->calculateRiskReward();
        }

        $trade->update($data);

        return new TradeJournalResource($trade->refresh());
    }

    #[OA\Delete(
        path: '/api/journal/{id}',
        summary: 'Delete a trade journal entry',
        tags: ['Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function destroy(Request $request, string $id)
    {
        $trade = $request->user()->tradeJournals()->findOrFail($id);
        $trade->delete();

        return response()->noContent();
    }

    #[OA\Post(
        path: '/api/journal/{id}/close',
        summary: 'Close an open trade',
        tags: ['Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function close(Request $request, string $id)
    {
        $request->validate([
            'exit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $trade = $request->user()->tradeJournals()->findOrFail($id);

        if ($trade->status !== 'open') {
            return response()->json([
                'message' => 'Only open trades can be closed.',
            ], 422);
        }

        $trade->close($request->exit_price);

        return new TradeJournalResource($trade->refresh());
    }

    #[OA\Get(
        path: '/api/journal/stats/summary',
        summary: 'Get trade journal statistics summary',
        tags: ['Trade Journal'],
        security: [['sanctum' => []]],
    )]
    public function stats(Request $request)
    {
        $query = $request->user()->tradeJournals();

        if ($request->filled('from')) {
            $query->whereDate('opened_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('opened_at', '<=', $request->to);
        }

        $trades = $query->get();

        $totalTrades = $trades->count();
        $closedTrades = $trades->where('status', 'closed');
        $winningTrades = $closedTrades->where('pnl', '>', 0);
        $losingTrades = $closedTrades->where('pnl', '<', 0);
        $openTrades = $trades->where('status', 'open');

        $totalPnl = $closedTrades->sum('pnl');
        $winRate = $closedTrades->count() > 0
            ? round(($winningTrades->count() / $closedTrades->count()) * 100, 2)
            : 0;

        $avgWin = $winningTrades->avg('pnl') ?? 0;
        $avgLoss = $losingTrades->avg('pnl') ?? 0;
        $profitFactor = $avgLoss !== 0
            ? round(abs($avgWin / $avgLoss), 2)
            : ($avgWin > 0 ? 999 : 0);

        return response()->json([
            'total_trades' => $totalTrades,
            'open_trades' => $openTrades->count(),
            'closed_trades' => $closedTrades->count(),
            'winning_trades' => $winningTrades->count(),
            'losing_trades' => $losingTrades->count(),
            'win_rate' => $winRate,
            'total_pnl' => round($totalPnl, 2),
            'avg_win' => round($avgWin, 2),
            'avg_loss' => round($avgLoss, 2),
            'profit_factor' => $profitFactor,
            'best_trade' => $winningTrades->max('pnl') ?? 0,
            'worst_trade' => $losingTrades->min('pnl') ?? 0,
        ]);
    }
}