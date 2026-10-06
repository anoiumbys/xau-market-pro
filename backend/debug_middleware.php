<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$kernel = $app->make('Illuminate\Contracts\Http\Kernel');
$middlewares = $kernel->getMiddleware();
foreach($middlewares as $m) {
    echo is_string($m) ? $m : get_class($m);
    echo PHP_EOL;
}