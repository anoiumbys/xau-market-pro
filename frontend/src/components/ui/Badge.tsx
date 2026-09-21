import { ReactNode } from 'react';
import { cn } from '@utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'gold' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
  dotColor?: string;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className,
  dot,
  dotColor,
}: BadgeProps) {
  const variantClasses = {
    primary: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
    gold: 'bg-gold-500/20 text-gold-400 border border-gold-500/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    neutral: 'bg-dark-700 text-dark-400 border border-dark-600',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'rounded-full',
            dotColor || {
              primary: 'bg-primary-400',
              gold: 'bg-gold-400',
              success: 'bg-green-400',
              warning: 'bg-yellow-400',
              danger: 'bg-red-400',
              neutral: 'bg-dark-400',
            }[variant]
          )}
          style={{ width: size === 'sm' ? 6 : size === 'md' ? 6 : 8, height: size === 'sm' ? 6 : size === 'md' ? 6 : 8 }}
        />
      )}
      {children}
    </span>
  );
}

// Specialized badges
export function StatusBadge({ status }: { status: 'open' | 'closed' | 'cancelled' }) {
  const configs = {
    open: { label: 'Open', variant: 'primary' as const, dotColor: 'bg-blue-400' },
    closed: { label: 'Closed', variant: 'success' as const, dotColor: 'bg-green-400' },
    cancelled: { label: 'Cancelled', variant: 'neutral' as const, dotColor: 'bg-gray-400' },
  };
  const config = configs[status];
  return <Badge variant={config.variant} dot dotColor={config.dotColor}>{config.label}</Badge>;
}

export function DirectionBadge({ direction }: { direction: 'long' | 'short' }) {
  return (
    <Badge
      variant={direction === 'long' ? 'success' : 'danger'}
      dot
      dotColor={direction === 'long' ? 'bg-green-400' : 'bg-red-400'}
    >
      {direction === 'long' ? 'Long' : 'Short'}
    </Badge>
  );
}

export function PlanBadge({ plan }: { plan: 'basic' | 'pro' | 'enterprise' }) {
  const configs = {
    basic: { variant: 'neutral' as const, label: 'Basic' },
    pro: { variant: 'primary' as const, label: 'Pro' },
    enterprise: { variant: 'gold' as const, label: 'Enterprise' },
  };
  const config = configs[plan];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function AlertConditionBadge({ condition }: { condition: 'above' | 'below' | 'cross' }) {
  const labels = { above: 'Above', below: 'Below', cross: 'Crosses' };
  const variants = { above: 'success' as const, below: 'danger' as const, cross: 'warning' as const };
  return <Badge variant={variants[condition]}>{labels[condition]}</Badge>;
}

export function SubscriptionStatusBadge({ status }: { status: 'pending' | 'active' | 'expired' | 'cancelled' | 'rejected' }) {
  const configs = {
    pending: { variant: 'warning' as const, label: 'Pending' },
    active: { variant: 'success' as const, label: 'Active' },
    expired: { variant: 'neutral' as const, label: 'Expired' },
    cancelled: { variant: 'danger' as const, label: 'Cancelled' },
    rejected: { variant: 'danger' as const, label: 'Rejected' },
  };
  const config = configs[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function UserRoleBadge({ role }: { role: 'guest' | 'trader' | 'admin' }) {
  const configs = {
    guest: { variant: 'neutral' as const, label: 'Guest' },
    trader: { variant: 'primary' as const, label: 'Trader' },
    admin: { variant: 'gold' as const, label: 'Admin' },
  };
  const config = configs[role];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}