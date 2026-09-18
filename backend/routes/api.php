<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MarketController;
use App\Http\Controllers\Api\PriceAlertController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\TradeJournalController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\MarketParameterController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Middleware\CheckSubscription;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

// Public market data
Route::get('/market/{symbol}', [MarketController::class, 'show']);
Route::get('/market-parameters/{symbol}', [MarketParameterController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get('/user', fn() => request()->user());

    // Price Alerts
    Route::apiResource('alerts', PriceAlertController::class)->only(['index', 'store', 'destroy']);

    // Subscription
    Route::post('/subscription', [SubscriptionController::class, 'store']);
    Route::get('/subscription', [SubscriptionController::class, 'show']);

    // Trade Journal
    Route::apiResource('journal', TradeJournalController::class);

    // Reports
    Route::get('/reports/export', [ReportController::class, 'export']);
});

// Subscription-gated routes (Pro/Enterprise features)
Route::middleware(['auth:sanctum', CheckSubscription::class.':pro'])->group(function () {
    // Advanced features for Pro/Enterprise
    Route::get('/reports/advanced', [ReportController::class, 'advanced']);
});

require __DIR__.'/channels.php';