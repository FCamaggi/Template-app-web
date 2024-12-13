// src/components/ui/dialog.tsx

import * as React from 'react';
import { cn } from '@/utils/cn';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const DialogContext = React.createContext<{
  open: boolean;
  onClose: () => void;
} | null>(null);

export function Dialog({ open, onClose, children, className }: DialogProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ open, onClose }}>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 transition-opacity"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Trick to center modal */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* Dialog panel */}
          <div
            className={cn(
              'inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg',
              className
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </DialogContext.Provider>
  );
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error('DialogTitle must be used within Dialog');

  return (
    <div className="flex items-center justify-between">
      <h3
        className={cn('text-lg font-medium leading-6 text-gray-900', className)}
      >
        {children}
      </h3>
      <button
        onClick={context.onClose}
        className="rounded-full p-1 hover:bg-gray-100"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mt-4', className)}>{children}</div>;
}

export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mt-6 flex justify-end space-x-3', className)}>
      {children}
    </div>
  );
}

export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('text-sm text-gray-500', className)}>{children}</div>
  );
}
