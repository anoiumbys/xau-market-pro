<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\TradeJournal;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class AdminReportController extends Controller
{
    #[OA\Get(
        path: '/api/admin/reports/overview',
        summary: 'Platform overview stats (admin)',
        tags: ['Admin - Reports'],
        security: [['sanctum' => []]],
    )]
    public function overview()
    {
        $totalUsers = User::count();
        $traders = User::where('role', 'trader')->count();
        $guests = User::where('role', 'guest')->count();
        $admins = User::where('role', 'admin')->count();

        $activeSubscriptions = Subscription::where('status', 'active')
            ->where('starts_at', '<=', now())
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })->count();

        $pendingSubscriptions = Subscription::where('status', 'pending')->count();
        $totalRevenue = Subscription::where('status', 'active')
            ->where('starts_at', '<=', now())
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })->get()
            ->sum(fn($s) => match ($s->plan_type) {
                'basic' => 29,
                'pro' => 99,
                'enterprise' => 299,
                default => 0,
            });

        $totalTrades = TradeJournal::where('status', 'closed')->count();
        $totalPnl = TradeJournal::where('status', 'closed')->sum('pnl');

        $newUsersThisMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)->count();
        $newSubscriptionsThisMonth = Subscription::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)->count();

        return response()->json([
            'users' => [
                'total' => $totalUsers,
                'traders' => $traders,
                'guests' => $guests,
                'admins' => $admins,
                'new_this_month' => $newUsersThisMonth,
            ],
            'subscriptions' => [
                'active' => $activeSubscriptions,
                'pending' => $pendingSubscriptions,
                'new_this_month' => $newSubscriptionsThisMonth,
                'monthly_revenue' => round($totalRevenue, 2),
            ],
            'trading' => [
                'total_closed_trades' => $totalTrades,
                'total_pnl' => round($totalPnl, 2),
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/admin/reports/users',
        summary: 'User analytics (admin)',
        tags: ['Admin - Reports'],
        security: [['sanctum' => []]],
    )]
    public function users(Request $request)
    {
        $from = $request->filled('from') ? Carbon::parse($request->from) : now()->subMonths(6);
        $to = $request->filled('to') ? Carbon::parse($request->to) : now();

        $registrations = User::whereBetween('created_at', [$from->startOfDay(), $to->endOfDay()])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $byRole = User::whereBetween('created_at', [$from->startOfDay(), $to->endOfDay()])
            ->selectRaw('role, COUNT(*) as count')
            ->groupBy('role')
            ->get();

        $activeUsers = User::whereHas('tradeJournals', function ($q) use ($from, $to) {
            $q->whereBetween('opened_at', [$from->startOfDay(), $to->endOfDay()]);
        })->count();

        return response()->json([
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'registrations' => $registrations,
            'by_role' => $byRole,
            'active_users' => $activeUsers,
        ]);
    }

    #[OA\Get(
        path: '/api/admin/reports/subscriptions',
        summary: 'Subscription analytics (admin)',
        tags: ['Admin - Reports'],
        security: [['sanctum' => []]],
    )]
    public function subscriptions(Request $request)
    {
        $from = $request->filled('from') ? Carbon::parse($request->from) : now()->subMonths(6);
        $to = $request->filled('to') ? Carbon::parse($request->to) : now();

        $byStatus = Subscription::whereBetween('created_at', [$from->startOfDay(), $to->endOfDay()])
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        $byPlan = Subscription::whereBetween('created_at', [$from->startOfDay(), $to->endOfDay()])
            ->selectRaw('plan_type, COUNT(*) as count')
            ->groupBy('plan_type')
            ->get();

        $monthly = Subscription::whereBetween('created_at', [$from->startOfDay(), $to->endOfDay()])
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $churn = Subscription::where('status', 'cancelled')
            ->whereBetween('updated_at', [$from->startOfDay(), $to->endOfDay()])
            ->count();

        return response()->json([
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'by_status' => $byStatus,
            'by_plan' => $byPlan,
            'monthly' => $monthly,
            'churn' => $churn,
        ]);
    }

    #[OA\Get(
        path: '/api/admin/reports/revenue',
        summary: 'Revenue analytics (admin)',
        tags: ['Admin - Reports'],
        security: [['sanctum' => []]],
    )]
    public function revenue(Request $request)
    {
        $from = $request->filled('from') ? Carbon::parse($request->from) : now()->subMonths(12);
        $to = $request->filled('to') ? Carbon::parse($request->to) : now();

        $activeSubs = Subscription::where('status', 'active')
            ->where('starts_at', '<=', $to)
            ->where(function ($q) use ($from) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>=', $from);
            })
            ->get();

        $monthlyRevenue = [];
        foreach ($activeSubs as $sub) {
            $price = match ($sub->plan_type) {
                'basic' => 29,
                'pro' => 99,
                'enterprise' => 299,
                default => 0,
            };
            $month = $sub->created_at->format('Y-m');
            $monthlyRevenue[$month] = ($monthlyRevenue[$month] ?? 0) + $price;
        }

        ksort($monthlyRevenue);

        $totalRevenue = array_sum($monthlyRevenue);

        return response()->json([
            'period' => ['from' => $from->toDateString(), 'to' => $to->toDateString()],
            'total_revenue' => round($totalRevenue, 2),
            'monthly_revenue' => array_map(fn($v) => round($v, 2), $monthlyRevenue),
            'avg_revenue_per_user' => count($activeSubs) > 0 ? round($totalRevenue / count($activeSubs), 2) : 0,
        ]);
    }
}