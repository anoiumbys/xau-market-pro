<?php

use App\Jobs\CheckPriceAlerts;
use Illuminate\Support\Facades\Schedule;

return function (Schedule $schedule) {
    // Check price alerts every minute
    $schedule->job(new CheckPriceAlerts)->everyMinute();

    // Clean up triggered alerts older than 30 days (daily at 2 AM)
    $schedule->command('alerts:cleanup --days=30')->dailyAt('02:00');

    // Update market daily range (every hour during market hours)
    $schedule->command('market:update-daily-range')->hourly()->between('22:00', '21:00');

    // Generate daily market summary (daily at 22:00 UTC - market close)
    $schedule->command('market:daily-summary')->dailyAt('22:00');

    // Check subscription expirations (daily at 03:00)
    $schedule->command('subscriptions:check-expirations')->dailyAt('03:00');

    // Clean up old audit logs (weekly on Sunday at 04:00)
    $schedule->command('audit:cleanup --days=365')->weeklyOn(0, '04:00');
};
