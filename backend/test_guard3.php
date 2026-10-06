<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Http\Request;
use Laravel\Sanctum\Sanctum;
use Laravel\Sanctum\Guard;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Support\Arr;

// Create a mock request with the Authorization header
$request = Request::create('/api/user', 'GET', [], [], [], [
    'HTTP_AUTHORIZATION' => 'Bearer 5|opWYKiXfRNz0iUifpbf3y6vyjPEIqJqcTLkyjdYU0251303b',
    'HTTP_ACCEPT' => 'application/json',
]);

// Get the auth factory
$auth = $app->make(AuthFactory::class);

// Check stateful guards
echo "Stateful guards (sanctum.guard): ";
print_r(config('sanctum.guard'));

foreach (Arr::wrap(config('sanctum.guard', 'web')) as $guard) {
    echo "Checking guard: $guard\n";
    $user = $auth->guard($guard)->user();
    if ($user) {
        echo "  User found: " . $user->name . "\n";
    } else {
        echo "  No user\n";
    }
}

// Get token from request
$token = $request->bearerToken();
echo "Bearer token from request: $token\n";

// Check if valid bearer token
$model = new Sanctum::$personalAccessTokenModel;
echo "Token model key type: " . $model->getKeyType() . "\n";

if (! is_null($token) && str_contains($token, '|')) {
    [$id, $tokenPart] = explode('|', $token, 2);
    echo "ID: $id\n";
    echo "Token part: $tokenPart\n";
    echo "ctype_digit(ID): " . (ctype_digit($id) ? 'true' : 'false') . "\n";
    echo "!empty(tokenPart): " . (!empty($tokenPart) ? 'true' : 'false') . "\n";
}

// Try findToken
$accessToken = $model::findToken($token);
if ($accessToken) {
    echo "Access token found!\n";
    echo "Tokenable: " . get_class($accessToken->tokenable) . "\n";
    echo "Tokenable ID: " . $accessToken->tokenable_id . "\n";
} else {
    echo "Access token NOT found\n";
}