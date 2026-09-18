<?php

return [

    /*
     * The path to the openapi spec file.
     */
    'openapi_spec_path' => storage_path('api-docs'),

    /*
     * The path to the openapi spec file.
     */
    'openapi_spec_name' => 'openapi.yaml',

    /*
     * The path to the swagger ui assets.
     */
    'swagger_ui_asset_path' => env('L5_SWAGGER_UI_ASSETS_PATH', 'vendor/swagger-api/swagger-ui/dist/'),

    /*
     * The constants for the swagger ui.
     */
    'constants' => [
        'L5_SWAGGER_CONST_HOST' => env('L5_SWAGGER_CONST_HOST', 'http://localhost:8000'),
    ],

    /*
     * Apply a sort to the operation list of each API. It can be 'alpha' (sort by paths alphanumerically),
     * 'method' (sort by HTTP method), null (no sorting).
     */
    'operations_sort' => 'alpha',

    /*
     * The default validation spec URL.
     */
    'validator_url' => null,

    /*
     * The API title.
     */
    'title' => env('L5_SWAGGER_TITLE', 'XAU Market Pro API'),

    /*
     * The API description.
     */
    'description' => env('L5_SWAGGER_DESCRIPTION', 'Real-time Market Analysis & Risk Management Platform API'),

    /*
     * The API version.
     */
    'version' => env('L5_SWAGGER_VERSION', '1.0.0'),

    /*
     * The terms of service.
     */
    'terms_of_service' => env('L5_SWAGGER_TERMS_OF_SERVICE', ''),

    /*
     * The contact information.
     */
    'contact' => [
        'name' => env('L5_SWAGGER_CONTACT_NAME', 'XAU Market Pro Team'),
        'email' => env('L5_SWAGGER_CONTACT_EMAIL', 'support@xaupro.test'),
        'url' => env('L5_SWAGGER_CONTACT_URL', 'https://xaupro.test'),
    ],

    /*
     * The license information.
     */
    'license' => [
        'name' => env('L5_SWAGGER_LICENSE_NAME', 'MIT'),
        'url' => env('L5_SWAGGER_LICENSE_URL', 'https://opensource.org/licenses/MIT'),
    ],

    /*
     * The servers configuration.
     */
    'servers' => [
        [
            'url' => env('L5_SWAGGER_SERVER_URL', 'http://localhost:8000'),
            'description' => 'Local Development Server',
        ],
    ],

    /*
     * The base path for the API.
     */
    'base_path' => env('L5_SWAGGER_BASE_PATH', '/api'),

    /*
     * The security definitions.
     */
    'security_definitions' => [
        'sanctum' => [
            'type' => 'http',
            'scheme' => 'bearer',
            'bearerFormat' => 'JWT',
        ],
    ],

    /*
     * The security requirements.
     */
    'security' => [
        ['sanctum' => []],
    ],

    /*
     * The default response.
     */
    'default_response' => [
        'description' => 'Successful response',
    ],

    /*
     * The annotations to scan.
     */
    'annotations' => [
        'base' => [
            'paths' => [
                base_path('app/Http/Controllers/Api'),
                base_path('app/Http/Controllers/Auth'),
            ],
        ],
    ],

    /*
     * The paths to exclude from the scan.
     */
    'exclude' => [
        'tests/',
        'vendor/',
    ],

    /*
     * Generate a copy of the spec in JSON format.
     */
    'generate_json_copy' => true,

    /*
     * Generate a copy of the spec in YAML format.
     */
    'generate_yaml_copy' => true,

    /*
     * The path to save the generated spec.
     */
    'output_path' => storage_path('api-docs'),

];