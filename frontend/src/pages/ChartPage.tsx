import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { TrendingUp, ExternalLink } from 'lucide-react';

export function ChartPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Chart</h1>
        <p className="text-dark-400 mt-1">XAUUSD real-time chart with TradingView</p>
      </div>

      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle>XAUUSD Chart</CardTitle>
          <CardDescription>Real-time gold price chart powered by TradingView</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px] flex items-center justify-center">
          <div className="text-center p-8">
            <TrendingUp className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">TradingView Chart</h3>
            <p className="text-dark-400 mb-6">Chart will be embedded here using TradingView widget</p>
            <a
              href="https://www.tradingview.com/chart/?symbol=XAUUSD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300"
            >
              Open in TradingView <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}