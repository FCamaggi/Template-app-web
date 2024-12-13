import * as React from 'react';
import { cn } from '@/utils/cn';

interface FileUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onFileSelect?: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    { className, onFileSelect, acceptedTypes, maxSize, onChange, ...props },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (maxSize && file.size > maxSize) {
        console.error('File too large');
        return;
      }

      if (acceptedTypes && !acceptedTypes.includes(file.type)) {
        console.error('File type not accepted');
        return;
      }

      onFileSelect?.(file);
      onChange?.(e);
    };

    return (
      <div className={cn('flex items-center justify-center w-full', className)}>
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes?.join(', ')}{' '}
              {maxSize && `(Max ${maxSize / 1000000}MB)`}
            </p>
          </div>
          <input
            ref={ref}
            type="file"
            className="hidden"
            onChange={handleChange}
            {...props}
          />
        </label>
      </div>
    );
  }
);
FileUpload.displayName = 'FileUpload';
