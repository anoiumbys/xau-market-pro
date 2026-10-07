import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}

export function formatPnL(pnl: number | null): string {
  if (pnl === null) return '-';
  const prefix = pnl >= 0 ? '+' : '';
  return `${prefix}${formatPrice(pnl)}`;
}

export function formatPnLPercent(pnl: number | null, entryPrice: number | null): string {
  if (pnl === null || !entryPrice) return '-';
  const pct = (pnl / entryPrice) * 100;
  const prefix = pct >= 0 ? '+' : '';
  return `${prefix}${pct.toFixed(2)}%`;
}

export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'time' | 'datetime' = 'short'
): string {
  const d = new Date(date);
  const options: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit', hour12: false },
    datetime: {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  };
  return d.toLocaleDateString('en-US', options[format]);
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d, 'short');
}

export function getDirectionColor(direction: 'long' | 'short'): string {
  return direction === 'long' ? 'text-green-400' : 'text-red-400';
}

export function getDirectionBg(direction: 'long' | 'short'): string {
  return direction === 'long'
    ? 'bg-green-500/20 border-green-500/30'
    : 'bg-red-500/20 border-red-500/30';
}

export function getPnLColor(pnl: number | null): string {
  if (pnl === null) return 'text-dark-400';
  return pnl > 0 ? 'text-green-400' : pnl < 0 ? 'text-red-400' : 'text-dark-400';
}

export function getPnLBg(pnl: number | null): string {
  if (pnl === null) return 'bg-dark-700';
  return pnl > 0
    ? 'bg-green-500/20 border-green-500/30'
    : pnl < 0
      ? 'bg-red-500/20 border-red-500/30'
      : 'bg-dark-700';
}

export function getStatusColor(status: 'open' | 'closed' | 'cancelled'): string {
  switch (status) {
    case 'open':
      return 'text-blue-400';
    case 'closed':
      return 'text-green-400';
    case 'cancelled':
      return 'text-gray-400';
  }
}

export function getStatusBg(status: 'open' | 'closed' | 'cancelled'): string {
  switch (status) {
    case 'open':
      return 'bg-blue-500/20 border-blue-500/30';
    case 'closed':
      return 'bg-green-500/20 border-green-500/30';
    case 'cancelled':
      return 'bg-dark-700 border-dark-600';
  }
}

export function getAlertConditionLabel(condition: 'above' | 'below' | 'cross'): string {
  return condition === 'above' ? 'Above' : condition === 'below' ? 'Below' : 'Crosses';
}

export function getSubscriptionPlanColor(plan: 'basic' | 'pro' | 'enterprise'): string {
  switch (plan) {
    case 'basic':
      return 'text-gray-400';
    case 'pro':
      return 'text-primary-400';
    case 'enterprise':
      return 'text-gold-400';
  }
}

export function getSubscriptionPlanBg(plan: 'basic' | 'pro' | 'enterprise'): string {
  switch (plan) {
    case 'basic':
      return 'bg-gray-500/20 border-gray-500/30';
    case 'pro':
      return 'bg-primary-500/20 border-primary-500/30';
    case 'enterprise':
      return 'bg-gold-500/20 border-gold-500/30';
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
