<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    public function handle(Request $request, Closure $next, string $requiredPlan = 'pro'): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        $subscription = $user->activeSubscription;

        if (!$subscription || !$subscription->isActive()) {
            return response()->json([
                'message' => 'Active subscription required',
                'required_plan' => $requiredPlan,
                'current_plan' => $subscription?->plan_type ?? 'none',
            ], 403);
        }

        $planHierarchy = ['basic' => 1, 'pro' => 2, 'enterprise' => 3];
        $userLevel = $planHierarchy[$subscription->plan_type] ?? 0;
        $requiredLevel = $planHierarchy[$requiredPlan] ?? 2;

        if ($userLevel < $requiredLevel) {
            return response()->json([
                'message' => "Subscription plan '{$requiredPlan}' or higher required",
                'required_plan' => $requiredPlan,
                'current_plan' => $subscription->plan_type,
            ], 403);
        }

        return $next($request);
    }
}