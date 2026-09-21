<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use OpenApi\Attributes as OA;

class ReportController extends Controller
{
    public function __construct(
        private ReportService $reports
    ) {}

    #[OA\Get(
        path: '/api/reports/export',
        summary: 'Export trade journal report (CSV/JSON)',
        tags: ['Reports'],
        security: [['sanctum' => []]],
    )]
    public function export(Request $request)
    {
        $request->validate([
            'format' => ['sometimes', 'string', 'in:json,csv'],
            'from' => ['sometimes', 'date'],
            'to' => ['sometimes', 'date', 'after_or_equal:from'],
            'type' => ['sometimes', 'string', 'in:journal,pnl,winrate,drawdown'],
        ]);

        $format = $request->input('format', 'json');
        $from = $request->filled('from') ? \Carbon\Carbon::parse($request->from) : now()->subMonth();
        $to = $request->filled('to') ? \Carbon\Carbon::parse($request->to) : now();
        $type = $request->input('type', 'journal');

        $user = Auth::user();

        $data = match ($type) {
            'pnl' => $this->reports->generatePnLReport($user, $from, $to),
            'winrate' => $this->reports->generateWinRateReport($user, $from, $to),
            'drawdown' => $this->reports->generateDrawdownReport($user, $from, $to),
            default => $this->reports->generateJournalReport($user, $from, $to),
        };

        if ($format === 'csv') {
            return $this->exportCsv($data, $type, $from, $to);
        }

        return response()->json($data);
    }

    #[OA\Get(
        path: '/api/reports/advanced',
        summary: 'Get advanced analytics (Pro/Enterprise only)',
        tags: ['Reports'],
        security: [['sanctum' => []]],
    )]
    public function advanced(Request $request)
    {
        $request->validate([
            'from' => ['sometimes', 'date'],
            'to' => ['sometimes', 'date', 'after_or_equal:from'],
        ]);

        $from = $request->filled('from') ? \Carbon\Carbon::parse($request->from) : now()->subMonths(3);
        $to = $request->filled('to') ? \Carbon\Carbon::parse($request->to) : now();

        $user = Auth::user();

        $pnl = $this->reports->generatePnLReport($user, $from, $to);
        $winRate = $this->reports->generateWinRateReport($user, $from, $to);
        $drawdown = $this->reports->generateDrawdownReport($user, $from, $to);

        // Advanced: streak analysis
        $streaks = $this->calculateStreaks($user, $from, $to);
        // Advanced: time-of-day analysis
        $timeAnalysis = $this->calculateTimeAnalysis($user, $from, $to);
        // Advanced: consecutive wins/losses
        $consecutive = $this->calculateConsecutive($user, $from, $to);

        return response()->json([
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'pnl_report' => $pnl,
            'winrate_report' => $winRate,
            'drawdown_report' => $drawdown,
            'streaks' => $streaks,
            'time_analysis' => $timeAnalysis,
            'consecutive' => $consecutive,
        ]);
    }

    private function exportCsv(array $data, string $type, \Carbon\Carbon $from, \Carbon\Carbon $to)
    {
        $filename = "xaupro_{$type}_{$from->format('Ymd')}_{$to->format('Ymd')}.csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($data, $type) {
            $handle = fopen('php://output', 'w');

            if ($type === 'journal') {
                fputcsv($handle, ['ID', 'Symbol', 'Direction', 'Entry', 'Exit', 'Lot', 'SL', 'TP', 'PnL', 'R:R', 'Status', 'Opened', 'Closed']);
                foreach ($data['trades'] as $trade) {
                    fputcsv($handle, [
                        $trade['id'], $trade['symbol'], $trade['direction'],
                        $trade['entry_price'], $trade['exit_price'], $trade['lot_size'],
                        $trade['stop_loss'], $trade['take_profit'], $trade['pnl'],
                        $trade['risk_reward'], $trade['status'],
                        $trade['opened_at'], $trade['closed_at'] ?? '',
                    ]);
                }
            } elseif ($type === 'pnl') {
                fputcsv($handle, ['Date', 'PnL', 'Trades', 'Wins', 'Losses']);
                foreach ($data['daily_pnl'] as $row) {
                    fputcsv($handle, [$row['date'], $row['pnl'], $row['trades'], $row['wins'], $row['losses']]);
                }
            } elseif ($type === 'drawdown') {
                fputcsv($handle, ['Date', 'Equity', 'Peak', 'Drawdown', 'Drawdown %']);
                foreach ($data['equity_curve'] as $row) {
                    fputcsv($handle, [$row['date'], $row['equity'], $row['trade_id'], $row['pnl'], '']);
                }
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function calculateStreaks(\App\Models\User $user, \Carbon\Carbon $from, \Carbon\Carbon $to): array
    {
        $trades = \App\Models\TradeJournal::where('user_id', $user->id)
            ->whereBetween('opened_at', [$from->startOfDay(), $to->endOfDay()])
            ->where('status', 'closed')
            ->orderBy('closed_at')
            ->get();

        $currentStreak = 0;
        $maxWinStreak = 0;
        $maxLossStreak = 0;
        $currentType = null; // 'win' or 'loss'

        foreach ($trades as $trade) {
            if ($trade->pnl > 0) {
                if ($currentType === 'win') {
                    $currentStreak++;
                } else {
                    $currentStreak = 1;
                    $currentType = 'win';
                }
                $maxWinStreak = max($maxWinStreak, $currentStreak);
            } elseif ($trade->pnl < 0) {
                if ($currentType === 'loss') {
                    $currentStreak++;
                } else {
                    $currentStreak = 1;
                    $currentType = 'loss';
                }
                $maxLossStreak = max($maxLossStreak, $currentStreak);
            }
        }

        return [
            'current_streak' => $currentStreak,
            'current_streak_type' => $currentType,
            'max_win_streak' => $maxWinStreak,
            'max_loss_streak' => $maxLossStreak,
        ];
    }

    private function calculateTimeAnalysis(\App\Models\User $user, \Carbon\Carbon $from, \Carbon\Carbon $to): array
    {
        $trades = \App\Models\TradeJournal::where('user_id', $user->id)
            ->whereBetween('opened_at', [$from->startOfDay(), $to->endOfDay()])
            ->where('status', 'closed')
            ->get();

        $byHour = [];
        foreach (range(0, 23) as $hour) {
            $hourTrades = $trades->filter(fn($t) => $t->opened_at->hour === $hour);
            $wins = $hourTrades->filter(fn($t) => $t->pnl > 0);
            $losses = $hourTrades->filter(fn($t) => $t->pnl < 0);

            $byHour[] = [
                'hour' => $hour,
                'trades' => $hourTrades->count(),
                'wins' => $wins->count(),
                'losses' => $losses->count(),
                'win_rate' => $hourTrades->count() > 0 ? round(($wins->count() / $hourTrades->count()) * 100, 2) : 0,
                'avg_pnl' => $hourTrades->count() > 0 ? round($hourTrades->avg('pnl'), 2) : 0,
            ];
        }

        return $byHour;
    }

    private function calculateConsecutive(\App\Models\User $user, \Carbon\Carbon $from, \Carbon\Carbon $to): array
    {
        $trades = \App\Models\TradeJournal::where('user_id', $user->id)
            ->whereBetween('opened_at', [$from->startOfDay(), $to->endOfDay()])
            ->where('status', 'closed')
            ->orderBy('closed_at')
            ->get();

        $consecutiveWins = [];
        $consecutiveLosses = [];
        $currentWin = 0;
        $currentLoss = 0;

        foreach ($trades as $trade) {
            if ($trade->pnl > 0) {
                $currentWin++;
                $currentLoss = 0;
                $consecutiveWins[] = $currentWin;
            } elseif ($trade->pnl < 0) {
                $currentLoss++;
                $currentWin = 0;
                $consecutiveLosses[] = $currentLoss;
            } else {
                $currentWin = 0;
                $currentLoss = 0;
            }
        }

        return [
            'consecutive_wins' => $consecutiveWins,
            'consecutive_losses' => $consecutiveLosses,
            'longest_win_streak' => max($consecutiveWins) ?? 0,
            'longest_loss_streak' => max($consecutiveLosses) ?? 0,
        ];
    }
}