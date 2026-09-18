<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePriceAlertRequest;
use App\Http\Resources\PriceAlertResource;
use App\Models\PriceAlert;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class PriceAlertController extends Controller
{
    #[OA\Get(
        path: '/api/alerts',
        summary: 'List user price alerts',
        tags: ['Alerts'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Success', content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/PriceAlert')),
                    new OA\Property(property: 'links', type: 'object'),
                    new OA\Property(property: 'meta', type: 'object'),
                ]
            )),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function index(Request $request)
    {
        $alerts = $request->user()->priceAlerts()->latest()->paginate(20);
        
        return PriceAlertResource::collection($alerts);
    }

    #[OA\Post(
        path: '/api/alerts',
        summary: 'Create a new price alert',
        tags: ['Alerts'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/PriceAlertCreate')
        ),
        responses: [
            new OA\Response(response: 201, description: 'Created', content: new OA\JsonContent(ref: '#/components/schemas/PriceAlert')),
            new OA\Response(response: 422, description: 'Validation error'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function store(StorePriceAlertRequest $request)
    {
        $alert = $request->user()->priceAlerts()->create($request->validated());
        
        return new PriceAlertResource($alert);
    }

    #[OA\Delete(
        path: '/api/alerts/{id}',
        summary: 'Delete a price alert',
        tags: ['Alerts'],
        security: [['sanctum' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        responses: [
            new OA\Response(response: 204, description: 'Deleted'),
            new OA\Response(response: 404, description: 'Not found'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function destroy(Request $request, string $id)
    {
        $alert = $request->user()->priceAlerts()->findOrFail($id);
        $alert->delete();
        
        return response()->noContent();
    }
}