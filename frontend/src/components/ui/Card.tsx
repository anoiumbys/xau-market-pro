import { ReactNode } from 'react';
import { cn } from '@utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gold?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover, gold, padding = 'md' }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-xl border bg-light-50 backdrop-blur-sm dark:bg-dark-900/80',
        gold
          ? 'border-gold-500/30 shadow-xl shadow-gold-500/10 dark:border-gold-500/30'
          : 'border-light-200 shadow-xl dark:border-dark-700',
        hover &&
          'transition-all duration-300 hover:border-light-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] dark:hover:border-dark-600',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-light-900 dark:text-dark-50', className)}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('mt-1 text-sm text-light-600 dark:text-dark-400', className)}>{children}</p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 flex items-center justify-end gap-3 border-t border-light-200 pt-4 dark:border-dark-700',
        className
      )}
    >
      {children}
    </div>
  );
}
