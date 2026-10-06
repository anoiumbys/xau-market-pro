import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { TradingViewChart } from '@components/TradingViewChart';

export function ChartPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-light-900 dark:text-white">Chart</h1>
        <p className="text-light-600 dark:text-dark-400 mt-1">XAUUSD real-time chart with TradingView</p>
      </div>

      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle>XAUUSD Chart</CardTitle>
          <CardDescription>Real-time gold price chart powered by TradingView</CardDescription>
        </CardHeader>
        <CardContent className="h-[500px]">
          <TradingViewChart
            symbol="OANDA:XAUUSD"
            interval="D"
            theme="dark"
            height={500}
            width="100%"
          />
        </CardContent>
      </Card>
    </div>
  );
}