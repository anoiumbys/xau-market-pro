import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Users, CreditCard, DollarSign, TrendingUp, Download, BarChart3 } from 'lucide-react';

const OVERVIEW_STATS = [
  {
    label: 'Total Users',
    value: '1,234',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  {
    label: 'Active Subscriptions',
    value: '567',
    icon: CreditCard,
    color: 'text-primary-400',
    bg: 'bg-primary-500/20',
  },
  {
    label: 'Monthly Revenue',
    value: '$45,678',
    icon: DollarSign,
    color: 'text-gold-400',
    bg: 'bg-gold-500/20',
  },
  {
    label: 'Total Trades',
    value: '89,432',
    icon: TrendingUp,
    color: 'text-green-400',
    bg: 'bg-green-500/20',
  },
];

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Reports</h1>
          <p className="mt-1 text-dark-400">Platform analytics and revenue reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_STATS.map((stat) => (
          <Card key={stat.label} hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-400">{stat.label}</p>
                  <p className="mt-1 text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={cn('rounded-xl p-3', stat.bg)}>
                  <stat.icon className={cn('h-6 w-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Registrations</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <BarChart3 className="h-16 w-16 text-dark-600" />
            <p className="text-dark-400">Chart placeholder - integrate with Recharts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Revenue</CardTitle>
            <CardDescription>Monthly recurring revenue by plan</CardDescription>
          </CardHeader>
          <CardContent className="flex h-80 items-center justify-center">
            <DollarSign className="h-16 w-16 text-dark-600" />
            <p className="text-dark-400">Chart placeholder - integrate with Recharts</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>Generate and download detailed reports</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="secondary"
            className="flex h-28 flex-col items-center justify-center gap-3 text-left"
          >
            <Users className="h-8 w-8" />
            <span className="font-medium">User Analytics</span>
            <span className="text-xs text-dark-400">Registrations, active users, retention</span>
            <Download className="ml-auto h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            className="flex h-28 flex-col items-center justify-center gap-3 text-left"
          >
            <CreditCard className="h-8 w-8" />
            <span className="font-medium">Subscription Report</span>
            <span className="text-xs text-dark-400">By status, plan, churn rate</span>
            <Download className="ml-auto h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            className="flex h-28 flex-col items-center justify-center gap-3 text-left"
          >
            <DollarSign className="h-8 w-8" />
            <span className="font-medium">Revenue Report</span>
            <span className="text-xs text-dark-400">Monthly revenue, ARPU, LTV</span>
            <Download className="ml-auto h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            className="flex h-28 flex-col items-center justify-center gap-3 text-left"
          >
            <TrendingUp className="h-8 w-8" />
            <span className="font-medium">Trading Analytics</span>
            <span className="text-xs text-dark-400">Volume, symbols, performance</span>
            <Download className="ml-auto h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { cn } from '@utils/cn';
