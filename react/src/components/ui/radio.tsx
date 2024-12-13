import * as React from 'react';
import { cn } from '@/utils/cn';

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="radio"
            className={cn(
              'h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500',
              error && 'border-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {label && (
          <div className="ml-3 text-sm">
            <label
              className={cn(
                'font-medium text-gray-700',
                error && 'text-red-500'
              )}
            >
              {label}
            </label>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);
Radio.displayName = 'Radio';
