<?php

use App\Jobs\CheckPriceAlerts;
use Illuminate\Support\Facades\Schedule;

// Tutup otomatis trade yang menyentuh Stop Loss / Take Profit
Schedule::command('journals:check-sl-tp')->everyMinute()->withoutOverlapping();

// Cek price alert setiap menit
Schedule::job(new CheckPriceAlerts)->everyMinute();
