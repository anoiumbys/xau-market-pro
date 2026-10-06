<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Http\Request;
use Laravel\Sanctum\Sanctum;
use Laravel\Sanctum\Guard;
use Illuminate\Contracts\Auth\Factory as AuthFactory;

// Create a mock request with the Authorization header
$request = Request::create('/api/user', 'GET', [], [], [], [
    'HTTP_AUTHORIZATION' => 'Bearer 5|opWYKiXfRNz0iUifpbf3y6vyjPEIqJqcTLkyjdYU0251303b',
    'HTTP_ACCEPT' => 'application/json',
]);

// Get the auth factory
$auth = $app->make(AuthFactory::class);

// Create the Sanctum guard
$guard = new Guard($auth, config('sanctum.expiration'), config('sanctum.guard.provider', null), config('sanctum.last_used_at', true));

// Test authentication
$user = $guard($request);

if ($user) {
    echo "User authenticated!\n";
    echo "User ID: " . $user->id . "\n";
    echo "User Name: " . $user->name . "\n";
    echo "User Email: " . $user->email . "\n";
} else {
    echo "Authentication failed\n";
}