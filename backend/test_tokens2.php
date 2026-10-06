<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Laravel\Sanctum\PersonalAccessToken;

$tokens = PersonalAccessToken::all();
echo "Total tokens: " . $tokens->count() . "\n";
foreach ($tokens as $token) {
    echo "ID: " . $token->id . " Tokenable: " . $token->tokenable_type . ":" . $token->tokenable_id . " Name: " . $token->name . "\n";
    $tokenable = $token->tokenable;
    if ($tokenable) {
        echo "  -> Tokenable: " . get_class($tokenable) . " ID: " . $tokenable->id . " Name: " . $tokenable->name . "\n";
    } else {
        echo "  -> Tokenable: NULL\n";
    }
}