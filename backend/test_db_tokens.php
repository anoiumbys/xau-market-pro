<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$tokens = DB::table('personal_access_tokens')->get();
echo "Total tokens: " . $tokens->count() . "\n";
foreach ($tokens as $token) {
    echo "ID: " . $token->id . " Tokenable Type: " . $token->tokenable_type . " Tokenable ID: " . $token->tokenable_id . " (type: " . gettype($token->tokenable_id) . ")\n";
}