<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Laravel\Sanctum\PersonalAccessToken;

$accessToken = PersonalAccessToken::find(5);
if ($accessToken) {
    echo "Token found!\n";
    echo "ID: " . $accessToken->id . "\n";
    echo "Tokenable Type: " . $accessToken->tokenable_type . "\n";
    echo "Tokenable ID: " . $accessToken->tokenable_id . "\n";
    echo "Tokenable relation: " . get_class($accessToken->tokenable()) . "\n";
    
    $tokenable = $accessToken->tokenable;
    if ($tokenable) {
        echo "Tokenable loaded: " . get_class($tokenable) . "\n";
        echo "Tokenable ID: " . $tokenable->id . "\n";
    } else {
        echo "Tokenable is NULL\n";
    }
} else {
    echo "Token NOT found\n";
}