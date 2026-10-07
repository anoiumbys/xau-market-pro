import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Download, BarChart3, TrendingUp, FileText, DollarSign } from 'lucide-react';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-light-900 dark:text-white">Reports & Analytics</h1>
          <p className="mt-1 text-light-600 dark:text-dark-400">Analyze your trading performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="primary">
            <BarChart3 className="mr-2 h-4 w-4" />
            Advanced
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-600 dark:text-dark-400">Total PnL</p>
                <p className="mt-1 text-3xl font-bold text-light-900 dark:text-white">$0.00</p>
              </div>
              <div className="rounded-xl bg-green-500/20 p-3">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-600 dark:text-dark-400">Win Rate</p>
                <p className="mt-1 text-3xl font-bold text-light-900 dark:text-white">0.0%</p>
              </div>
              <div className="rounded-xl bg-primary-500/20 p-3">
                <TrendingUp className="h-6 w-6 text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-600 dark:text-dark-400">
                  Total Trades
                </p>
                <p className="mt-1 text-3xl font-bold text-light-900 dark:text-white">0</p>
              </div>
              <div className="rounded-xl bg-blue-500/20 p-3">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-light-600 dark:text-dark-400">
                  Profit Factor
                </p>
                <p className="mt-1 text-3xl font-bold text-light-900 dark:text-white">0.00</p>
              </div>
              <div className="rounded-xl bg-purple-500/20 p-3">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Generate detailed analytics for your trading</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Button
            variant="secondary"
            className="flex h-24 flex-col items-center justify-center gap-3"
          >
            <BarChart3 className="h-8 w-8" />
            <span className="font-medium">PnL Report</span>
            <span className="text-xs text-light-600 dark:text-dark-400">
              Daily & monthly breakdown
            </span>
          </Button>
          <Button
            variant="secondary"
            className="flex h-24 flex-col items-center justify-center gap-3"
          >
            <TrendingUp className="h-8 w-8" />
            <span className="font-medium">Win Rate Analysis</span>
            <span className="text-xs text-light-600 dark:text-dark-400">By direction & symbol</span>
          </Button>
          <Button
            variant="secondary"
            className="flex h-24 flex-col items-center justify-center gap-3"
          >
            <FileText className="h-8 w-8" />
            <span className="font-medium">Drawdown Report</span>
            <span className="text-xs text-light-600 dark:text-dark-400">
              Equity curve & drawdowns
            </span>
          </Button>
          <Button
            variant="secondary"
            className="flex h-24 flex-col items-center justify-center gap-3"
          >
            <Download className="h-8 w-8" />
            <span className="font-medium">Journal Export</span>
            <span className="text-xs text-light-600 dark:text-dark-400">All trades in CSV</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
