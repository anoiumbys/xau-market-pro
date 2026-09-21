import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-500 active:bg-primary-700 focus-visible:ring-primary-500 shadow-lg shadow-primary-500/25',
      secondary: 'bg-dark-800 text-dark-100 hover:bg-dark-700 active:bg-dark-600 border border-dark-600 focus-visible:ring-dark-500',
      gold: 'bg-gold-500 text-dark-950 hover:bg-gold-400 active:bg-gold-600 focus-visible:ring-gold-500 shadow-lg shadow-gold-500/25',
      ghost: 'bg-transparent text-dark-300 hover:bg-dark-800 active:bg-dark-700 focus-visible:ring-dark-500',
      danger: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-500 shadow-lg shadow-red-500/25',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 gap-2',
      lg: 'px-6 py-3 text-lg gap-2',
      icon: 'p-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';