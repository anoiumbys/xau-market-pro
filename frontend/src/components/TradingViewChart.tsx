import { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  theme?: 'light' | 'dark';
  height?: number | string;
  width?: number | string;
  autosize?: boolean;
}

/**
 * TradingView Advanced Chart embed.
 * Mirrors the official embed snippet exactly:
 * container > widget div + script sibling (config as script JSON, no container_id).
 */
export function TradingViewChart({
  symbol = 'OANDA:XAUUSD',
  interval = 'D',
  theme = 'dark',
  height = 500,
  width = '100%',
  autosize = true,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setFailed(false);
    // Clear any previous embed (StrictMode remount / retry).
    container.querySelectorAll('script[data-tv-widget]').forEach((s) => s.remove());

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.type = 'text/javascript';
    script.dataset.tvWidget = 'advanced-chart';

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
    script.onerror = () => setFailed(true);
    container.appendChild(script);

    return () => {
      script.onerror = null;
      if (script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, [symbol, interval, theme, autosize, retryKey]);

  return (
    <div
      key={`${symbol}-${theme}-${retryKey}`}
      ref={containerRef}
      className="tradingview-widget-container w-full overflow-hidden rounded-xl"
      style={{ height, width, minHeight: 500 }}
    >
      <div className="tradingview-widget-container__widget h-full w-full" />
      {failed && (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="text-sm text-light-600 dark:text-dark-300">
            Chart TradingView gagal dimuat (CDN diblokir adblock/Jaringan).
          </p>
          <button
            type="button"
            onClick={() => setRetryKey((k) => k + 1)}
            className="btn-secondary btn-sm"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Coba lagi
          </button>
        </div>
      )}
    </div>
  );
}
