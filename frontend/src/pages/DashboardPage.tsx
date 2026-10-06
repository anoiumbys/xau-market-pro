import { useEffect } from 'react';
import { useMarketStore, selectCurrentMarket } from '@stores/marketStore';
import { useJournalStore, selectStats } from '@stores/journalStore';
import { useAlertStore, selectPendingAlerts } from '@stores/alertStore';
import { useSubscriptionStore, selectHasActiveSubscription } from '@stores/subscriptionStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Badge, PlanBadge, DirectionBadge, StatusBadge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Link } from 'react-router-dom';
import { formatPrice, formatPnL, formatDate, getPnLColor, getPnLBg } from '@utils/cn';
import {
  TrendingUp,
  TrendingDown,
  BookOpen,
  Bell,
  CreditCard,
  BarChart3,
  Target,
  DollarSign,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@utils/cn';

const STAT_CARDS = [
  {
    title: 'XAUUSD Spot',
    value: '--',
    change: null,
    icon: Activity,
    color: 'text-gold-400',
    bg: 'bg-gold-500/20',
  },
  {
    title: 'Open Trades',
    value: '0',
    icon: BookOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  {
    title: 'Active Alerts',
    value: '0',
    icon: Bell,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
  },
  {
    title: 'Total PnL',
    value: '$0.00',
    icon: DollarSign,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
  },
] as const;

export function DashboardPage() {
  const currentMarket = useMarketStore(selectCurrentMarket);
  const stats = useJournalStore(selectStats);
  const pendingAlerts = useAlertStore(selectPendingAlerts);
  const hasSubscription = useSubscriptionStore(selectHasActiveSubscription);
  const fetchMarket = useMarketStore((state) => state.fetchMarket);
  const fetchStats = useJournalStore((state) => state.fetchStats);

  useEffect(() => {
    fetchMarket('XAUUSD');
    fetchStats();
  }, [fetchMarket, fetchStats]);

  const market = currentMarket;
  const spotPrice = market?.spot_price ?? 0;
  const change24h = market?.change_24h ?? 0;
  const changePct24h = market?.change_pct_24h ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-light-900 dark:text-white">Dashboard</h1>
          <p className="text-light-600 dark:text-dark-400 mt-1">Welcome back! Here's your trading overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/subscription">
            <Button variant="ghost" size="sm">
              <CreditCard className="w-4 h-4" />
              Subscription
            </Button>
          </Link>
          <Link to="/journal">
            <Button size="sm">
              <Target className="w-4 h-4" />
              New Trade
            </Button>
          </Link>
        </div>
      </div>

      {/* Market Header */}
      <Card className="bg-gradient-to-r from-primary-600/20 to-gold-500/10 border-primary-500/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-light-600 dark:text-dark-400">XAUUSD Spot Price</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-bold text-light-900 dark:text-white tabular-nums">{formatPrice(spotPrice)}</span>
                <div className={cn('flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium', change24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400')}>
                  {change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="tabular-nums">{change24h >= 0 ? '+' : ''}{formatPrice(change24h)} ({changePct24h >= 0 ? '+' : ''}{changePct24h.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-light-600 dark:text-dark-400">Daily High</p>
              <p className="text-2xl font-bold text-light-900 dark:text-white mt-1 tabular-nums">{formatPrice(market?.daily_high ?? 0)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-light-600 dark:text-dark-400">Daily Low</p>
              <p className="text-2xl font-bold text-light-900 dark:text-white mt-1 tabular-nums">{formatPrice(market?.daily_low ?? 0)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-light-600 dark:text-dark-400">Market Status</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={market?.market_status === 'open' ? 'success' : 'neutral'} dot>
                  {market?.market_status === 'open' ? 'Open' : 'Closed'}
                </Badge>
                <span className="text-sm text-light-600 dark:text-dark-400">Last updated: {market?.timestamp ? formatDate(market.timestamp, 'datetime') : '-'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-600 dark:text-dark-400">Open Trades</p>
                <p className="text-3xl font-bold text-light-900 dark:text-white mt-1">{stats?.open_trades ?? 0}</p>
              </div>
              <div className={cn('p-3 rounded-xl', 'bg-blue-500/20')}>
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-600 dark:text-dark-400">Active Alerts</p>
                <p className="text-3xl font-bold text-light-900 dark:text-white mt-1">{pendingAlerts.length}</p>
              </div>
              <div className={cn('p-3 rounded-xl', 'bg-purple-500/20')}>
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-600 dark:text-dark-400">Win Rate</p>
                <p className="text-3xl font-bold text-light-900 dark:text-white mt-1 tabular-nums">{stats?.win_rate?.toFixed(1) ?? '0.0'}%</p>
              </div>
              <div className={cn('p-3 rounded-xl', 'bg-primary-500/20')}>
                <Target className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-600 dark:text-dark-400">Total PnL</p>
                <p className={cn('text-3xl font-bold mt-1 tabular-nums', getPnLColor(stats?.total_pnl ?? null))}>
                  {formatPnL(stats?.total_pnl ?? null)}
                </p>
              </div>
              <div className={cn('p-3 rounded-xl', getPnLBg(stats?.total_pnl ?? null))}>
                <DollarSign className="w-6 h-6" style={{ color: stats?.total_pnl && stats.total_pnl >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/journal" className="block">
                <Button variant="secondary" className="w-full justify-start gap-3">
                  <BookOpen className="w-5 h-5" />
                  <span>Add Trade Entry</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
              <Link to="/alerts" className="block">
                <Button variant="secondary" className="w-full justify-start gap-3">
                  <Bell className="w-5 h-5" />
                  <span>Create Price Alert</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
              <Link to="/chart" className="block">
                <Button variant="secondary" className="w-full justify-start gap-3">
                  <Activity className="w-5 h-5" />
                  <span>View Chart</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
              <Link to="/reports" className="block">
                <Button variant="secondary" className="w-full justify-start gap-3">
                  <BarChart3 className="w-5 h-5" />
                  <span>View Reports</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
              {!hasSubscription && (
                <Link to="/subscription" className="block">
                  <Button variant="gold" className="w-full justify-start gap-3">
                    <CreditCard className="w-5 h-5" />
                    <span>Upgrade Subscription</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Current plan status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <PlanBadge plan="pro" />
                <p className="text-sm text-light-700 dark:text-dark-300">Pro Plan - Unlimited alerts & exports</p>
                <Button variant="ghost" size="sm" className="w-full">
                  Manage Subscription
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trades */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Trades</CardTitle>
                <CardDescription>Your latest trade journal entries</CardDescription>
              </div>
              <Link to="/journal">
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Direction</th>
                      <th>Entry</th>
                      <th>Exit</th>
                      <th>PnL</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats ? (
                      <>
                        <tr>
                          <td className="text-center text-light-600 dark:text-dark-400 py-8" colSpan={7}>
                            No trades yet. <Link to="/journal" className="text-primary-400 hover:underline">Add your first trade</Link>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td className="text-center text-light-600 dark:text-dark-400 py-8" colSpan={7}>
                          Loading...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}