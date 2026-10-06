<?php

namespace App\Services;

use App\Models\TradeJournal;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ReportService
{
    public function generatePnLReport(User $user, Carbon $from, Carbon $to): array
    {
        $trades = $this->getTradesInRange($user, $from, $to);

        $metrics = $this->calculateMetrics($trades);
        $dailyPnL = $this->calculateDailyPnL($trades);
        $monthlyPnL = $this->calculateMonthlyPnL($trades);

        return [
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'summary' => $metrics,
            'daily_pnl' => $dailyPnL,
            'monthly_pnl' => $monthlyPnL,
            'trades' => $trades->map(fn ($t) => $this->formatTrade($t))->toArray(),
        ];
    }

    public function generateJournalReport(User $user, Carbon $from, Carbon $to): array
    {
        $trades = $this->getTradesInRange($user, $from, $to);

        return [
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'total_trades' => $trades->count(),
            'trades' => $trades->map(fn ($t) => $this->formatTrade($t))->toArray(),
        ];
    }

    public function generateWinRateReport(User $user, Carbon $from, Carbon $to): array
    {
        $trades = $this->getTradesInRange($user, $from, $to)->where('status', 'closed');

        $metrics = $this->calculateMetrics($trades);

        $byDirection = [
            'long' => $this->calculateMetrics($trades->where('direction', 'long')),
            'short' => $this->calculateMetrics($trades->where('direction', 'short')),
        ];

        $bySymbol = $trades->groupBy('symbol')
            ->map(fn ($group) => $this->calculateMetrics($group))
            ->toArray();

        return [
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'overall' => $metrics,
            'by_direction' => $byDirection,
            'by_symbol' => $bySymbol,
        ];
    }

    public function generateDrawdownReport(User $user, Carbon $from, Carbon $to): array
    {
        $trades = $this->getTradesInRange($user, $from, $to)
            ->where('status', 'closed')
            ->sortBy('closed_at')
            ->values();

        $equityCurve = $this->calculateEquityCurve($trades);
        $drawdowns = $this->calculateDrawdowns($equityCurve);

        return [
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'max_drawdown' => max(array_column($drawdowns, 'drawdown_pct')) ?? 0,
            'max_drawdown_amount' => max(array_column($drawdowns, 'drawdown')) ?? 0,
            'current_drawdown' => end($drawdowns)['drawdown'] ?? 0,
            'equity_curve' => $equityCurve,
            'drawdown_periods' => $drawdowns,
        ];
    }

    private function getTradesInRange(User $user, Carbon $from, Carbon $to): Collection
    {
        return TradeJournal::where('user_id', $user->id)
            ->whereBetween('opened_at', [$from->startOfDay(), $to->endOfDay()])
            ->orderBy('opened_at')
            ->get();
    }

    private function calculateMetrics(Collection $trades): array
    {
        $closedTrades = $trades->where('status', 'closed');
        $totalTrades = $closedTrades->count();

        if ($totalTrades === 0) {
            return $this->emptyMetrics();
        }

        $winningTrades = $closedTrades->filter(fn ($t) => $t->pnl > 0);
        $losingTrades = $closedTrades->filter(fn ($t) => $t->pnl < 0);

        $grossProfit = $winningTrades->sum('pnl');
        $grossLoss = abs($losingTrades->sum('pnl'));
        $netPnL = $grossProfit - $grossLoss;

        $winRate = $totalTrades > 0 ? round(($winningTrades->count() / $totalTrades) * 100, 2) : 0;
        $avgWin = $winningTrades->count() > 0 ? round($grossProfit / $winningTrades->count(), 2) : 0;
        $avgLoss = $losingTrades->count() > 0 ? round($grossLoss / $losingTrades->count(), 2) : 0;
        $profitFactor = $grossLoss > 0 ? round($grossProfit / $grossLoss, 2) : ($grossProfit > 0 ? 999 : 0);

        $rrRatios = $closedTrades->pluck('risk_reward')->filter()->toArray();
        $avgRR = $rrRatios ? round(array_sum($rrRatios) / count($rrRatios), 2) : 0;

        $maxWin = $winningTrades->max('pnl') ?? 0;
        $maxLoss = $losingTrades->min('pnl') ?? 0;

        return [
            'total_trades' => $totalTrades,
            'winning_trades' => $winningTrades->count(),
            'losing_trades' => $losingTrades->count(),
            'win_rate' => $winRate,
            'gross_profit' => round($grossProfit, 2),
            'gross_loss' => round($grossLoss, 2),
            'net_pnl' => round($netPnL, 2),
            'avg_win' => $avgWin,
            'avg_loss' => $avgLoss,
            'profit_factor' => $profitFactor,
            'avg_rr' => $avgRR,
            'max_win' => round($maxWin, 2),
            'max_loss' => round($maxLoss, 2),
            'expectancy' => $totalTrades > 0 ? round(($winRate / 100 * $avgWin) - ((100 - $winRate) / 100 * $avgLoss), 2) : 0,
        ];
    }

    private function emptyMetrics(): array
    {
        return [
            'total_trades' => 0,
            'winning_trades' => 0,
            'losing_trades' => 0,
            'win_rate' => 0,
            'gross_profit' => 0,
            'gross_loss' => 0,
            'net_pnl' => 0,
            'avg_win' => 0,
            'avg_loss' => 0,
            'profit_factor' => 0,
            'avg_rr' => 0,
            'max_win' => 0,
            'max_loss' => 0,
            'expectancy' => 0,
        ];
    }

    private function calculateDailyPnL(Collection $trades): array
    {
        return $trades->where('status', 'closed')
            ->groupBy(fn ($t) => $t->closed_at->toDateString())
            ->map(fn ($group) => [
                'date' => $group->first()->closed_at->toDateString(),
                'pnl' => round($group->sum('pnl'), 2),
                'trades' => $group->count(),
                'wins' => $group->filter(fn ($t) => $t->pnl > 0)->count(),
                'losses' => $group->filter(fn ($t) => $t->pnl < 0)->count(),
            ])
            ->values()
            ->toArray();
    }

    private function calculateMonthlyPnL(Collection $trades): array
    {
        return $trades->where('status', 'closed')
            ->groupBy(fn ($t) => $t->closed_at->format('Y-m'))
            ->map(fn ($group) => [
                'month' => $group->first()->closed_at->format('Y-m'),
                'pnl' => round($group->sum('pnl'), 2),
                'trades' => $group->count(),
                'wins' => $group->filter(fn ($t) => $t->pnl > 0)->count(),
                'losses' => $group->filter(fn ($t) => $t->pnl < 0)->count(),
                'win_rate' => $group->count() > 0
                    ? round(($group->filter(fn ($t) => $t->pnl > 0)->count() / $group->count()) * 100, 2)
                    : 0,
            ])
            ->values()
            ->toArray();
    }

    private function calculateEquityCurve(Collection $trades): array
    {
        $equity = 0;
        $curve = [];

        foreach ($trades as $trade) {
            $equity += $trade->pnl ?? 0;
            $curve[] = [
                'date' => $trade->closed_at->toDateString(),
                'trade_id' => $trade->id,
                'pnl' => round($trade->pnl ?? 0, 2),
                'equity' => round($equity, 2),
            ];
        }

        return $curve;
    }

    private function calculateDrawdowns(array $equityCurve): array
    {
        $drawdowns = [];
        $peak = 0;

        foreach ($equityCurve as $point) {
            $equity = $point['equity'];

            if ($equity > $peak) {
                $peak = $equity;
            }

            $drawdown = $peak - $equity;
            $drawdownPct = $peak > 0 ? round(($drawdown / $peak) * 100, 2) : 0;

            $drawdowns[] = [
                'date' => $point['date'],
                'equity' => $equity,
                'peak' => $peak,
                'drawdown' => round($drawdown, 2),
                'drawdown_pct' => $drawdownPct,
            ];
        }

        return array_filter($drawdowns, fn ($d) => $d['drawdown'] > 0);
    }

    private function formatTrade(TradeJournal $trade): array
    {
        return [
            'id' => $trade->id,
            'symbol' => $trade->symbol,
            'direction' => $trade->direction,
            'entry_price' => (float) $trade->entry_price,
            'exit_price' => $trade->exit_price ? (float) $trade->exit_price : null,
            'lot_size' => (float) $trade->lot_size,
            'stop_loss' => $trade->stop_loss ? (float) $trade->stop_loss : null,
            'take_profit' => $trade->take_profit ? (float) $trade->take_profit : null,
            'pnl' => $trade->pnl ? (float) $trade->pnl : null,
            'risk_reward' => $trade->risk_reward ? (float) $trade->risk_reward : null,
            'status' => $trade->status,
            'notes' => $trade->notes,
            'opened_at' => $trade->opened_at->toIso8601String(),
            'closed_at' => $trade->closed_at?->toIso8601String(),
        ];
    }
}
