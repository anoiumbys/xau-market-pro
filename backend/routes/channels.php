<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/

// Public market data channel
Broadcast::channel('market.{symbol}', function ($user, $symbol) {
    return ['symbol' => strtoupper($symbol)];
});

// Private price alerts channel - only for alert owner
Broadcast::channel('alerts.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Admin notifications channel - only for admins
Broadcast::channel('admin.notifications', function ($user) {
    return $user->role === 'admin';
});

// User-specific notifications
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Presence channel for market viewers (optional)
Broadcast::channel('presence.market.{symbol}', function ($user, $symbol) {
    return [
        'user_id' => $user->id,
        'user_name' => $user->name,
        'role' => $user->role,
    ];
});
