<?php

namespace App\Http\Controllers\Api\Admin;

use App\Events\SubscriptionActivated;
use App\Http\Controllers\Controller;
use App\Http\Resources\SubscriptionResource;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AdminSubscriptionController extends Controller
{
    #[OA\Get(
        path: '/api/admin/subscriptions',
        summary: 'List all subscriptions (admin)',
        tags: ['Admin - Subscriptions'],
        security: [['sanctum' => []]],
    )]
    public function index(Request $request)
    {
        $query = Subscription::with('user')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('plan_type')) {
            $query->where('plan_type', $request->plan_type);
        }

        $subscriptions = $query->paginate($request->integer('per_page', 20));

        return SubscriptionResource::collection($subscriptions);
    }

    #[OA\Get(
        path: '/api/admin/subscriptions/{id}',
        summary: 'Get subscription details (admin)',
        tags: ['Admin - Subscriptions'],
        security: [['sanctum' => []]],
    )]
    public function show(string $id)
    {
        $subscription = Subscription::with('user')->findOrFail($id);

        return new SubscriptionResource($subscription);
    }

    #[OA\Put(
        path: '/api/admin/subscriptions/{id}/approve',
        summary: 'Approve subscription (admin)',
        tags: ['Admin - Subscriptions'],
        security: [['sanctum' => []]],
    )]
    public function approve(Request $request, string $id)
    {
        $subscription = Subscription::with('user')->findOrFail($id);

        if ($subscription->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending subscriptions can be approved',
            ], 422);
        }

        $request->validate([
            'duration_days' => ['sometimes', 'integer', 'min:1', 'max:3650'],
        ]);

        $duration = $request->integer('duration_days', 30);
        $startsAt = now();
        $expiresAt = $startsAt->copy()->addDays($duration);

        $subscription->update([
            'status' => 'active',
            'starts_at' => $startsAt,
            'expires_at' => $expiresAt,
        ]);

        // Notify user
        SubscriptionActivated::dispatch($subscription);

        return new SubscriptionResource($subscription->refresh());
    }

    #[OA\Put(
        path: '/api/admin/subscriptions/{id}/reject',
        summary: 'Reject subscription (admin)',
        tags: ['Admin - Subscriptions'],
        security: [['sanctum' => []]],
    )]
    public function reject(Request $request, string $id)
    {
        $subscription = Subscription::findOrFail($id);

        if ($subscription->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending subscriptions can be rejected',
            ], 422);
        }

        $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $subscription->update([
            'status' => 'rejected',
        ]);

        // TODO: Send notification to user with reason

        return new SubscriptionResource($subscription->refresh());
    }

    #[OA\Put(
        path: '/api/admin/subscriptions/{id}/cancel',
        summary: 'Cancel subscription (admin)',
        tags: ['Admin - Subscriptions'],
        security: [['sanctum' => []]],
    )]
    public function cancel(string $id)
    {
        $subscription = Subscription::findOrFail($id);

        if (! in_array($subscription->status, ['active', 'pending'])) {
            return response()->json([
                'message' => 'Only active or pending subscriptions can be cancelled',
            ], 422);
        }

        $subscription->update([
            'status' => 'cancelled',
        ]);

        return new SubscriptionResource($subscription->refresh());
    }

    #[OA\Put(
        path: '/api/admin/subscriptions/{id}/extend',
        summary: 'Extend subscription (admin)',
        tags: ['Admin - Subscriptions'],
        security: [['sanctum' => []]],
    )]
    public function extend(Request $request, string $id)
    {
        $subscription = Subscription::findOrFail($id);

        if ($subscription->status !== 'active') {
            return response()->json([
                'message' => 'Only active subscriptions can be extended',
            ], 422);
        }

        $request->validate([
            'additional_days' => ['required', 'integer', 'min:1', 'max:3650'],
        ]);

        $additionalDays = $request->integer('additional_days');
        $newExpiry = ($subscription->expires_at ?? now())->addDays($additionalDays);

        $subscription->update([
            'expires_at' => $newExpiry,
        ]);

        return new SubscriptionResource($subscription->refresh());
    }
}
