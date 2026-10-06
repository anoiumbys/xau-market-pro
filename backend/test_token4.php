<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

$user = User::where('email', 'admin@xaupro.test')->first();
if (!$user) {
    echo "User not found\n";
    exit;
}

echo "User ID: " . $user->id . "\n";

$result = $user->createToken('test-token', ['*']);
echo "Plain text token (full): " . $result->plainTextToken . "\n";
echo "Access token ID: " . $result->accessToken->id . "\n";

$storedToken = PersonalAccessToken::find($result->accessToken->id);
echo "Stored hash: " . $storedToken->token . "\n";

// The plainTextToken returned includes ID prefix: "4|actual_token"
// The actual token for hashing is just the part after "|"
$parts = explode('|', $result->plainTextToken, 2);
$actualToken = $parts[1] ?? $result->plainTextToken;
echo "Actual token for hashing: " . $actualToken . "\n";

$sha256 = hash('sha256', $actualToken);
echo "SHA-256 of actual token: " . $sha256 . "\n";
echo "Verification (SHA-256): " . ($sha256 === $storedToken->token ? 'YES' : 'NO') . "\n";