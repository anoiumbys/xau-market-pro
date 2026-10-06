import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Users, CreditCard, BookOpen, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@utils/cn';

const STATS = [
  { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { label: 'Active Subscriptions', value: '567', change: '+8%', icon: CreditCard, color: 'text-primary-400', bg: 'bg-primary-500/20' },
  { label: 'Total Trades', value: '89,432', change: '+23%', icon: BookOpen, color: 'text-green-400', bg: 'bg-green-500/20' },
  { label: 'Monthly Revenue', value: '$45,678', change: '+15%', icon: DollarSign, color: 'text-gold-400', bg: 'bg-gold-500/20' },
];

const RECENT_ACTIVITY = [
  { action: 'New user registered', user: 'john@example.com', time: '2 min ago', type: 'user' },
  { action: 'Subscription approved', user: 'jane@example.com', plan: 'Pro', time: '15 min ago', type: 'subscription' },
  { action: 'Trade executed', user: 'trader@example.com', symbol: 'XAUUSD', pnl: '+$245.50', time: '1 hour ago', type: 'trade' },
  { action: 'Price alert triggered', user: 'alert@example.com', price: '2,350.00', time: '2 hours ago', type: 'alert' },
  { action: 'New user registered', user: 'mike@example.com', time: '3 hours ago', type: 'user' },
];

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-light-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-light-600 dark:text-dark-400 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label} hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-light-600 dark:text-dark-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-light-900 dark:text-white mt-1 tabular-nums">{stat.value}</p>
                  <p className={cn('text-sm mt-1', stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400')}>
                    {stat.change} vs last month
                  </p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bg)}>
                  <stat.icon className={cn('w-6 h-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Registrations</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-light-400 dark:text-dark-600" />
            <p className="text-light-600 dark:text-dark-400">Chart placeholder - integrate with Recharts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly recurring revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center">
            <DollarSign className="w-16 h-16 text-light-400 dark:text-dark-600" />
            <p className="text-light-600 dark:text-dark-400">Chart placeholder - integrate with Recharts</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activity</CardDescription>
          </div>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-light-100/50 dark:bg-dark-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={cn('p-2 rounded-lg', activity.type === 'user' && 'bg-blue-500/20', activity.type === 'subscription' && 'bg-primary-500/20', activity.type === 'trade' && 'bg-green-500/20', activity.type === 'alert' && 'bg-purple-500/20')}>
                    {activity.type === 'user' && <Users className="w-5 h-5 text-blue-400" />}
                    {activity.type === 'subscription' && <CreditCard className="w-5 h-5 text-primary-400" />}
                    {activity.type === 'trade' && <BookOpen className="w-5 h-5 text-green-400" />}
                    {activity.type === 'alert' && <Activity className="w-5 h-5 text-purple-400" />}
                  </div>
                  <div>
                    <p className="font-medium text-light-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-light-600 dark:text-dark-400">{activity.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-light-600 dark:text-dark-400">{activity.time}</p>
                  {activity.pnl && <p className="text-sm text-green-400 font-medium">{activity.pnl}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}