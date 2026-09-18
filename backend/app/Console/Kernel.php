<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        \App\Console\Commands\GenerateOpenApi::class,
        \App\Console\Commands\CleanupTriggeredAlerts::class,
        \App\Console\Commands\UpdateMarketDailyRange::class,
        \App\Console\Commands\GenerateDailyMarketSummary::class,
        \App\Console\Commands\CheckSubscriptionExpirations::class,
        \App\Console\Commands\CleanupAuditLogs::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('inspire')->hourly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}