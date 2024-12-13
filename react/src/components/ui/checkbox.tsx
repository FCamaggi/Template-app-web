import * as React from 'react';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              type="checkbox"
              className={cn(
                'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500',
                error && 'border-red-500',
                className
              )}
              ref={ref}
              {...props}
            />
            <Check className="absolute top-0 left-0 h-4 w-4 text-white pointer-events-none opacity-0 check-icon" />
          </div>
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
Checkbox.displayName = 'Checkbox';
