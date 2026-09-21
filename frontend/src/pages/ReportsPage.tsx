import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Download, BarChart3, TrendingUp, FileText } from 'lucide-react';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-dark-400 mt-1">Analyze your trading performance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="primary">
            <BarChart3 className="w-4 h-4 mr-2" />
            Advanced
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-400">Total PnL</p>
                <p className="text-3xl font-bold text-white mt-1">$0.00</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500/20">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-400">Win Rate</p>
                <p className="text-3xl font-bold text-white mt-1">0.0%</p>
              </div>
              <div className="p-3 rounded-xl bg-primary-500/20">
                <TrendingUp className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-400">Total Trades</p>
                <p className="text-3xl font-bold text-white mt-1">0</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card hover>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-400">Profit Factor</p>
                <p className="text-3xl font-bold text-white mt-1">0.00</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500/20">
                <BarChart3 className="w-6 h-6 text-purple-400" />
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
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="secondary" className="h-24 flex flex-col items-center justify-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <span className="font-medium">PnL Report</span>
            <span className="text-xs text-dark-400">Daily & monthly breakdown</span>
          </Button>
          <Button variant="secondary" className="h-24 flex flex-col items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <span className="font-medium">Win Rate Analysis</span>
            <span className="text-xs text-dark-400">By direction & symbol</span>
          </Button>
          <Button variant="secondary" className="h-24 flex flex-col items-center justify-center gap-3">
            <FileText className="w-8 h-8" />
            <span className="font-medium">Drawdown Report</span>
            <span className="text-xs text-dark-400">Equity curve & drawdowns</span>
          </Button>
          <Button variant="secondary" className="h-24 flex flex-col items-center justify-center gap-3">
            <Download className="w-8 h-8" />
            <span className="font-medium">Journal Export</span>
            <span className="text-xs text-dark-400">All trades in CSV</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}