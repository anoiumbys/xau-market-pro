<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

$users = User::all();
echo "Total users: " . $users->count() . "\n";
foreach ($users as $user) {
    echo "ID: " . $user->id . " Name: " . $user->name . " Email: " . $user->email . "\n";
}