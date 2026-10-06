<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Laravel\Sanctum\PersonalAccessToken;

// Test the findToken method
$fullToken = '5|opWYKiXfRNz0iUifpbf3y6vyjPEIqJqcTLkyjdYU0251303b';
$token = PersonalAccessToken::findToken($fullToken);

if ($token) {
    echo "Token found!\n";
    echo "Tokenable ID: " . $token->tokenable_id . "\n";
    echo "Tokenable Type: " . $token->tokenable_type . "\n";
} else {
    echo "Token NOT found\n";
    
    // Debug
    [$id, $tokenPart] = explode('|', $fullToken, 2);
    echo "ID: $id\n";
    echo "Token part: $tokenPart\n";
    echo "SHA256 of token part: " . hash('sha256', $tokenPart) . "\n";
    
    $stored = PersonalAccessToken::find($id);
    if ($stored) {
        echo "Stored hash: " . $stored->token . "\n";
        echo "Hash equals: " . (hash_equals($stored->token, hash('sha256', $tokenPart)) ? 'YES' : 'NO') . "\n";
    } else {
        echo "No token with ID $id\n";
    }
}