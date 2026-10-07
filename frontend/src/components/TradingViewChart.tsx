import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: 'light' | 'dark';
  height?: number | string;
  width?: number | string;
  autosize?: boolean;
  containerId?: string;
}

export function TradingViewChart({
  symbol = 'OANDA:XAUUSD',
  interval = 'D',
  theme = 'dark',
  height = 500,
  width = '100%',
  autosize = true,
  containerId = 'tradingview-chart',
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;

    initializedRef.current = true;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.type = 'text/javascript';

    const widgetConfig = {
      autosize,
      symbol,
      interval,
      timezone: 'Etc/UTC',
      theme,
      style: '1',
      locale: 'en',
      toolbar_bg: theme === 'dark' ? '#1a1a2e' : '#ffffff',
      enable_publishing: false,
      allow_symbol_change: true,
      container_id: containerId,
      studies: ['MAExp@tv-basicstudies', 'RSI@tv-basicstudies'],
      overrides: {
        'mainSeriesProperties.candleStyle.upColor': '#22c55e',
        'mainSeriesProperties.candleStyle.downColor': '#ef4444',
        'mainSeriesProperties.candleStyle.borderUpColor': '#22c55e',
        'mainSeriesProperties.candleStyle.borderDownColor': '#ef4444',
        'mainSeriesProperties.candleStyle.wickUpColor': '#22c55e',
        'mainSeriesProperties.candleStyle.wickDownColor': '#ef4444',
        'paneProperties.background': theme === 'dark' ? '#0f172a' : '#ffffff',
        'paneProperties.vertGridProperties.color': theme === 'dark' ? '#1e293b' : '#e2e8f0',
        'paneProperties.horzGridProperties.color': theme === 'dark' ? '#1e293b' : '#e2e8f0',
      },
    };

    script.innerHTML = JSON.stringify(widgetConfig);
    scriptRef.current = script;

    container.appendChild(script);

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      scriptRef.current = null;
      initializedRef.current = false;
    };
  }, [symbol, interval, theme, height, width, autosize, containerId]);

  return (
    <div
      ref={containerRef}
      key={`${symbol}-${theme}`}
      style={{
        height,
        width,
        minHeight: 500,
      }}
      className="w-full"
    />
  );
}
