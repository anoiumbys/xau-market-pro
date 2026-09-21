<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Resources\SubscriptionResource;
use App\Models\Subscription;
use App\Models\User;
use App\Events\NewSubscriptionPending;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

class SubscriptionController extends Controller
{
    #[OA\Post(
        path: '/api/subscription',
        summary: 'Subscribe to a plan (simulation)',
        tags: ['Subscription'],
        security: [['sanctum' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(ref: '#/components/schemas/SubscriptionCreate')
        ),
        responses: [
            new OA\Response(response: 201, description: 'Subscription request created', content: new OA\JsonContent(ref: '#/components/schemas/Subscription')),
            new OA\Response(response: 422, description: 'Validation error'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function store(StoreSubscriptionRequest $request)
    {
        $user = $request->user();
        
        // Check if user already has an active subscription
        if ($user->hasActiveSubscription()) {
            return response()->json([
                'message' => 'You already have an active subscription',
            ], 422);
        }

        $planType = $request->input('plan_type');
        $paymentRef = 'SIM-' . strtoupper(Str::random(6));

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_type' => $planType,
            'status' => 'pending',
            'payment_ref' => $paymentRef,
            'starts_at' => null,
            'expires_at' => null,
        ]);

        // Notify admins
        NewSubscriptionPending::dispatch($subscription);

        return (new SubscriptionResource($subscription))
            ->response()
            ->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/subscription',
        summary: 'Get current user subscription',
        tags: ['Subscription'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(response: 200, description: 'Success', content: new OA\JsonContent(ref: '#/components/schemas/Subscription')),
            new OA\Response(response: 404, description: 'No subscription found'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function show(Request $request)
    {
        $subscription = $request->user()->activeSubscription;
        
        if (!$subscription) {
            return response()->json([
                'message' => 'No active subscription found',
            ], 404);
        }

        return new SubscriptionResource($subscription);
    }
}