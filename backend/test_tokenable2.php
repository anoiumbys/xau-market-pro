<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Laravel\Sanctum\PersonalAccessToken;
use App\Models\User;

$accessToken = PersonalAccessToken::find(5);
if ($accessToken) {
    echo "Token found!\n";
    echo "Tokenable Type: " . $accessToken->tokenable_type . "\n";
    echo "Tokenable ID: " . $accessToken->tokenable_id . "\n";
    
    // Try to load the relationship manually
    $tokenable = $accessToken->tokenable;
    if ($tokenable) {
        echo "Tokenable loaded via relationship: " . get_class($tokenable) . "\n";
    } else {
        echo "Tokenable is NULL via relationship\n";
        
        // Try to find the user directly
        $user = User::find($accessToken->tokenable_id);
        if ($user) {
            echo "User found directly: " . $user->name . "\n";
        } else {
            echo "User NOT found directly\n";
        }
        
        // Check if the morphTo is using the correct class
        $morphClass = $accessToken->tokenable_type;
        echo "Morph class: $morphClass\n";
        echo "Class exists: " . (class_exists($morphClass) ? 'YES' : 'NO') . "\n";
        
        // Try to instantiate
        if (class_exists($morphClass)) {
            $instance = new $morphClass;
            echo "Instance created: " . get_class($instance) . "\n";
        }
    }
}