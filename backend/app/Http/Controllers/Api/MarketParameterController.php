<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MarketParameterResource;
use App\Models\MarketParameter;
use OpenApi\Attributes as OA;

class MarketParameterController extends Controller
{
    #[OA\Get(
        path: '/api/market-parameters/{symbol}',
        summary: 'Get market parameters (support/resistance levels)',
        tags: ['Market'],
        parameters: [
            new OA\Parameter(
                name: 'symbol',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', enum: ['XAUUSD'])
            ),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Success', content: new OA\JsonContent(ref: '#/components/schemas/MarketParameter')),
            new OA\Response(response: 404, description: 'Parameters not found'),
        ]
    )]
    public function show(string $symbol)
    {
        $parameter = MarketParameter::forSymbol($symbol)->active()->firstOrFail();
        
        return new MarketParameterResource($parameter);
    }
}