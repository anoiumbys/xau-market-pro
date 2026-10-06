<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

$user = User::find(11111111);
echo "User find(11111111): " . ($user ? $user->name : 'NULL') . "\n";

$user2 = User::where('id', 11111111)->first();
echo "User where id=11111111: " . ($user2 ? $user2->name : 'NULL') . "\n";

$user3 = User::whereKey(11111111)->first();
echo "User whereKey(11111111): " . ($user3 ? $user3->name : 'NULL') . "\n";

echo "Model key name: " . $user->getKeyName() . "\n";
echo "Model key type: " . $user->getKeyType() . "\n";
echo "Model incrementing: " . ($user->incrementing ? 'true' : 'false') . "\n";