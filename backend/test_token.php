<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

$user = User::find(11111111);
if (!$user) {
    echo "User not found\n";
    exit;
}

$result = $user->createToken('test-token', ['*']);
echo "Plain text token: " . $result->plainTextToken . "\n";
echo "Access token ID: " . $result->accessToken->id . "\n";

$storedToken = PersonalAccessToken::find($result->accessToken->id);
echo "Stored hash: " . $storedToken->token . "\n";

// Test verification
$plain = $result->plainTextToken;
echo "Verification (full): " . (password_verify($plain, $storedToken->token) ? 'YES' : 'NO') . "\n";