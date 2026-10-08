<?php

use App\Http\Controllers\Api\Admin\AdminMarketController;
use App\Http\Controllers\Api\Admin\AdminPriceAlertController;
use App\Http\Controllers\Api\Admin\AdminReportController;
use App\Http\Controllers\Api\Admin\AdminSettingsController;
use App\Http\Controllers\Api\Admin\AdminSubscriptionController;
use App\Http\Controllers\Api\Admin\AdminTradeJournalController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\MarketController;
use App\Http\Controllers\Api\MarketParameterController;
use App\Http\Controllers\Api\PriceAlertController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\TradeJournalController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Middleware\AdminOnly;
use App\Http\Middleware\CheckSubscription;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

// Public market data
Route::get('/market/{symbol}', [MarketController::class, 'show']);
Route::get('/market-parameters/{symbol}', [MarketParameterController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get('/user', fn () => request()->user());
    Route::put('/user/profile', [AuthenticatedSessionController::class, 'updateProfile']);

    // Price Alerts
    Route::apiResource('alerts', PriceAlertController::class)->only(['index', 'store', 'destroy']);

    // Subscription
    Route::post('/subscription', [SubscriptionController::class, 'store']);
    Route::get('/subscription', [SubscriptionController::class, 'show']);

    // Trade Journal (specific routes must come before apiResource)
    Route::get('/journal/stats/summary', [TradeJournalController::class, 'stats']);
    Route::post('/journal/{id}/close', [TradeJournalController::class, 'close']);
    Route::apiResource('journal', TradeJournalController::class);

    // Reports
    Route::get('/reports/export', [ReportController::class, 'export']);
});

// Subscription-gated routes (Pro/Enterprise features)
Route::middleware(['auth:sanctum', CheckSubscription::class.':pro'])->group(function () {
    // Advanced features for Pro/Enterprise
    Route::get('/reports/advanced', [ReportController::class, 'advanced']);
});

// Admin routes (require admin role)
Route::middleware(['auth:sanctum', AdminOnly::class])->prefix('admin')->group(function () {
    // Users
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::put('/users/{id}/role', [AdminUserController::class, 'updateRole']);
    Route::put('/users/{id}/ban', [AdminUserController::class, 'ban']);
    Route::put('/users/{id}/unban', [AdminUserController::class, 'unban']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

    // Markets
    Route::get('/markets', [AdminMarketController::class, 'index']);
    Route::post('/markets', [AdminMarketController::class, 'store']);
    Route::get('/markets/{id}', [AdminMarketController::class, 'show']);
    Route::put('/markets/{id}', [AdminMarketController::class, 'update']);
    Route::put('/markets/{id}/toggle', [AdminMarketController::class, 'toggleActive']);
    Route::delete('/markets/{id}', [AdminMarketController::class, 'destroy']);

    // Subscriptions
    Route::get('/subscriptions', [AdminSubscriptionController::class, 'index']);
    Route::get('/subscriptions/{id}', [AdminSubscriptionController::class, 'show']);
    Route::put('/subscriptions/{id}/approve', [AdminSubscriptionController::class, 'approve']);
    Route::put('/subscriptions/{id}/reject', [AdminSubscriptionController::class, 'reject']);
    Route::put('/subscriptions/{id}/cancel', [AdminSubscriptionController::class, 'cancel']);
    Route::put('/subscriptions/{id}/extend', [AdminSubscriptionController::class, 'extend']);

    // Price Alerts
    Route::get('/alerts', [AdminPriceAlertController::class, 'index']);
    Route::get('/alerts/{id}', [AdminPriceAlertController::class, 'show']);
    Route::delete('/alerts/{id}', [AdminPriceAlertController::class, 'destroy']);

    // Trade Journal
    Route::get('/journal', [AdminTradeJournalController::class, 'index']);
    Route::get('/journal/{id}', [AdminTradeJournalController::class, 'show']);
    Route::delete('/journal/{id}', [AdminTradeJournalController::class, 'destroy']);

    // Reports (platform-wide)
    Route::get('/reports/overview', [AdminReportController::class, 'overview']);
    Route::get('/reports/users', [AdminReportController::class, 'users']);
    Route::get('/reports/subscriptions', [AdminReportController::class, 'subscriptions']);
    Route::get('/reports/revenue', [AdminReportController::class, 'revenue']);

    // Settings
    Route::get('/settings', [AdminSettingsController::class, 'index']);
    Route::put('/settings', [AdminSettingsController::class, 'update']);
    Route::get('/market-parameters', [AdminSettingsController::class, 'marketParameters']);
    Route::put('/market-parameters/{symbol}', [AdminSettingsController::class, 'updateMarketParameters']);
});

require __DIR__.'/channels.php';
