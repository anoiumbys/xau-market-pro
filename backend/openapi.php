<?php

declare(strict_types=1);

use OpenApi\Attributes as OA;

return [
    'openapi' => '3.1.0',
    'info' => [
        'title' => 'XAU Market Pro API',
        'description' => 'Real-time Market Analysis & Risk Management Platform API',
        'version' => '1.0.0',
        'contact' => [
            'name' => 'XAU Market Pro Team',
            'email' => 'support@xaupro.test',
        ],
        'license' => [
            'name' => 'MIT',
            'url' => 'https://opensource.org/licenses/MIT',
        ],
    ],
    'servers' => [
        [
            'url' => '/api',
            'description' => 'API Base Path',
        ],
    ],
    'components' => [
        'securitySchemes' => [
            'sanctum' => [
                'type' => 'http',
                'scheme' => 'bearer',
                'bearerFormat' => 'JWT',
            ],
        ],
        'schemas' => [],
    ],
    'security' => [
        ['sanctum' => []],
    ],
    'tags' => [
        ['name' => 'Auth', 'description' => 'Authentication endpoints'],
        ['name' => 'Market', 'description' => 'Market data and chart endpoints'],
        ['name' => 'Alerts', 'description' => 'Price alert management'],
        ['name' => 'Subscription', 'description' => 'Subscription management'],
        ['name' => 'Journal', 'description' => 'Trade journal management'],
        ['name' => 'Reports', 'description' => 'Reports and exports'],
        ['name' => 'Admin', 'description' => 'Admin panel endpoints'],
    ],
    'paths' => [],
];