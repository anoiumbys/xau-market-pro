<?php

use BeyondCode\LaravelWebSockets\Dashboard\Http\Middleware\Authorize;

return [

    /*
     * Set a custom dashboard configuration
     */
    'dashboard' => [
        'port' => env('LARAVEL_WEBSOCKETS_PORT', 6001),
        'host' => env('LARAVEL_WEBSOCKETS_HOST', '0.0.0.0'),
        'path' => env('LARAVEL_WEBSOCKETS_PATH', 'laravel-websockets'),
        'middleware' => [
            'web',
            Authorize::class,
        ],
        'auth' => [
            'username' => env('LARAVEL_WEBSOCKETS_DASHBOARD_USERNAME', 'admin'),
            'password' => env('LARAVEL_WEBSOCKETS_DASHBOARD_PASSWORD', 'password'),
        ],
    ],

    /*
     * This package comes with multi tenancy built in.
     * Here you can configure the different apps that can use the webSockets server.
     *
     * Optionally you specify capacity so you can limit the maximum
     * concurrent connections for a specific app.
     *
     * Optionally you can disable client self registration.
     */
    'apps' => [
        [
            'id' => env('WEBSOCKETS_APP_ID', 'local'),
            'name' => env('APP_NAME', 'XAU Market Pro'),
            'key' => env('WEBSOCKETS_KEY', 'local'),
            'secret' => env('WEBSOCKETS_SECRET', 'secret'),
            'path' => env('LARAVEL_WEBSOCKETS_PATH', 'laravel-websockets'),
            'capacity' => null,
            'enable_client_messages' => false,
            'enable_statistics' => true,
            'allowed_origins' => [
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                env('APP_URL', 'http://localhost:8000'),
            ],
        ],
    ],

    /*
     * This class is responsible for finding the apps. The default provider
     * uses the apps defined in this config file.
     *
     * You can create a custom provider by implementing the
     * `BeyondCode\LaravelWebSockets\Apps\AppProvider` interface.
     */
    'app_provider' => BeyondCode\LaravelWebSockets\Apps\ConfigAppProvider::class,

    /*
     * This array contains the hosts of which you want to allow incoming requests.
     * Leave this empty if you want to allow requests from all hosts.
     */
    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        env('APP_URL', 'http://localhost:8000'),
    ],

    /*
     * The maximum request size in kilobytes that is allowed for an incoming WebSocket request.
     */
    'max_request_size_in_kb' => 250,

    /*
     * This path will be used to register the webhook callbacks.
     * The package will register a POST route at this path.
     */
    'webhook_path' => 'laravel-websockets/webhook',

    /*
     * This is the path where the webhook secret will be stored.
     * The secret is used to verify incoming webhook requests.
     */
    'webhook_secret' => env('LARAVEL_WEBSOCKETS_WEBHOOK_SECRET'),

    /*
     * The number of seconds after which the webhook will be retried.
     */
    'webhook_retry_interval' => 5,

    /*
     * The maximum number of times a webhook will be retried.
     */
    'webhook_max_retries' => 3,

    /*
     * The SSL context options for the WebSocket server.
     */
    'ssl' => [
        /*
         * Path to local certificate file on filesystem. It must be a PEM encoded file which
         * contains your certificate and private key. It can optionally contain the
         * certificate chain of issuers. The private key also may be contained
         * in a separate file specified by local_pk.
         */
        'local_cert' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT', null),
        'local_pk' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_PK', null),
        'passphrase' => env('LARAVEL_WEBSOCKETS_SSL_PASSPHRASE', null),
        'verify_peer' => false,
        'allow_self_signed' => true,
    ],

    /*
     * Channel manager options
     */
    'channel_manager' => \BeyondCode\LaravelWebSockets\Channels\ChannelManager::class,

    /*
     * Statistics options
     */
    'statistics' => [
        'model' => \BeyondCode\LaravelWebSockets\Statistics\Models\WebSocketsStatisticsEntry::class,
        'interval_in_seconds' => 60,
        'delete_statistics_older_than_days' => 30,
        'perform_dns_lookup' => false,
    ],

    /*
     * WebSocket server options
     */
    'server' => [
        'host' => env('LARAVEL_WEBSOCKETS_HOST', '0.0.0.0'),
        'port' => env('LARAVEL_WEBSOCKETS_PORT', 6001),
        'ping_interval' => 30,
        'ping_timeout' => 10,
    ],

];