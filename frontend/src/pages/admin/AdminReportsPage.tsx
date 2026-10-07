import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Users, CreditCard, DollarSign, TrendingUp, Download, BarChart3 } from 'lucide-react';

const OVERVIEW_STATS = [
  { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { label: 'Active Subscriptions', value: '567', icon: CreditCard, color: 'text-primary-400', bg: 'bg-primary-500/20' },
  { label: 'Monthly Revenue', value: '$45,678', icon: DollarSign, color: 'text-gold-400', bg: 'bg-gold-500/20' },
  { label: 'Total Trades', value: '89,432', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/20' },
];

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Reports</h1>
          <p className="text-dark-400 mt-1">Platform analytics and revenue reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OVERVIEW_STATS.map((stat) => (
          <Card key={stat.label} hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-dark-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bg)}>
                  <stat.icon className={cn('w-6 h-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Registrations</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <BarChart3 className="w-16 h-16 text-dark-600" />
            <p className="text-dark-400">Chart placeholder - integrate with Recharts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Revenue</CardTitle>
            <CardDescription>Monthly recurring revenue by plan</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <DollarSign className="w-16 h-16 text-dark-600" />
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
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="secondary" className="h-28 flex flex-col items-center justify-center gap-3 text-left">
            <Users className="w-8 h-8" />
            <span className="font-medium">User Analytics</span>
            <span className="text-xs text-dark-400">Registrations, active users, retention</span>
            <Download className="w-5 h-5 ml-auto" />
          </Button>
          <Button variant="secondary" className="h-28 flex flex-col items-center justify-center gap-3 text-left">
            <CreditCard className="w-8 h-8" />
            <span className="font-medium">Subscription Report</span>
            <span className="text-xs text-dark-400">By status, plan, churn rate</span>
            <Download className="w-5 h-5 ml-auto" />
          </Button>
          <Button variant="secondary" className="h-28 flex flex-col items-center justify-center gap-3 text-left">
            <DollarSign className="w-8 h-8" />
            <span className="font-medium">Revenue Report</span>
            <span className="text-xs text-dark-400">Monthly revenue, ARPU, LTV</span>
            <Download className="w-5 h-5 ml-auto" />
          </Button>
          <Button variant="secondary" className="h-28 flex flex-col items-center justify-center gap-3 text-left">
            <TrendingUp className="w-8 h-8" />
            <span className="font-medium">Trading Analytics</span>
            <span className="text-xs text-dark-400">Volume, symbols, performance</span>
            <Download className="w-5 h-5 ml-auto" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { cn } from '@utils/cn';