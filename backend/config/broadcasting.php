<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcasting Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default broadcaster that will be used by the
    | framework when an event needs to be broadcast. You may set this to
    | one of the connections defined in the "connections" array below.
    |
    | Supported: "pusher", "ably", "websockets", "log", "null"
    |
    */

    'default' => env('BROADCAST_DRIVER', 'pusher'),

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the broadcast connections that will be used
    | to broadcast events to other systems or over websockets. Samples of
    | each available type of connection are provided below.
    |
    */

    'connections' => [

        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            'options' => [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => env('PUSHER_SCHEME', 'http') === 'https',
                'host' => env('PUSHER_HOST', '127.0.0.1'),
                'port' => env('PUSHER_PORT', 6001),
                'scheme' => env('PUSHER_SCHEME', 'http'),
            ],
            'client_options' => [
                // Guzzle client options: https://docs.guzzlephp.org/en/stable/request-options.html
            ],
        ],

        'ably' => [
            'driver' => 'ably',
            'key' => env('ABLY_KEY'),
        ],

        'websockets' => [
            'driver' => 'websockets',
            'key' => env('WEBSOCKETS_KEY', 'local'),
            'secret' => env('WEBSOCKETS_SECRET', 'secret'),
            'app_id' => env('WEBSOCKETS_APP_ID', 'local'),
            'options' => [
                'host' => env('WEBSOCKETS_HOST', '127.0.0.1'),
                'port' => env('WEBSOCKETS_PORT', 6001),
                'scheme' => env('WEBSOCKETS_SSL', false) ? 'https' : 'http',
                'useTLS' => env('WEBSOCKETS_SSL', false),
            ],
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];