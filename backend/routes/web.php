<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'XAU Market Pro API']);
});

Route::get('/{any}', function () {
    return response()->json(['message' => 'XAU Market Pro API']);
})->where('any', '^(?!api/).*$');
