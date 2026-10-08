<?php

namespace App\Console\Commands;

use App\Models\TradeJournal;
use App\Services\MarketDataService;
use Illuminate\Console\Command;

class CheckJournalSlTp extends Command
{
    protected $signature = 'journals:check-sl-tp';

    protected $description = 'Close open trades that hit stop loss or take profit';

    public function handle(MarketDataService $market): int
    {
        $prices = [];
        $closed = 0;
        $skipped = 0;

        TradeJournal::open()->each(function (TradeJournal $t) use ($market, &$prices, &$closed, &$skipped) {
            $symbol = strtoupper($t->symbol);
            if (!array_key_exists($symbol, $prices)) {
                $prices[$symbol] = $market->getCurrentPrice($symbol);
            }
            $price = $prices[$symbol];
            if ($price === null) {
                $skipped++;
                return;
            }

            $long = $t->direction === 'long';
            $sl = $t->stop_loss !== null ? (float) $t->stop_loss : null;
            $tp = $t->take_profit !== null ? (float) $t->take_profit : null;
            $exit = null;

            if ($sl !== null && ($long ? $price <= $sl : $price >= $sl)) {
                $exit = $sl;
            } elseif ($tp !== null && ($long ? $price >= $tp : $price <= $tp)) {
                $exit = $tp;
            }

            if ($exit === null) {
                return;
            }

            $t->exit_price = $exit;
            $t->pnl = $t->calculatePnl();
            $t->status = 'closed';
            $t->closed_at = now();
            $t->save();
            $closed++;
        });

        $this->info("Closed: {$closed}, skipped (no price): {$skipped}");

        return self::SUCCESS;
    }
}