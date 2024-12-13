// src/components/ui/button.tsx
import { cn } from '@/utils/cn';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'destructive'
    | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      default:
        'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 border border-transparent',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-transparent',
      ghost:
        'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:ring-gray-500 border border-transparent',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent',
      outline:
        'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-500',
    };

    const sizes = {
      default: 'h-10 py-2 px-4 text-sm',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-12 px-8 text-base',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
