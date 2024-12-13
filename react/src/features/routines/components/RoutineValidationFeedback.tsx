import React from 'react';
import { AlertTriangle, XOctagon } from 'lucide-react';

interface ValidationFeedbackProps {
  warnings: Array<{ type: string; message: string }>;
  errors: Array<{ type: string; message: string }>;
}

const RoutineValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  warnings,
  errors,
}) => {
  if (warnings.length === 0 && errors.length === 0) return null;

  return (
    <div className="space-y-4">
      {errors.length > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XOctagon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Found {errors.length} issue{errors.length > 1 ? 's' : ''} with
                this routine
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc space-y-1 pl-5">
                  {errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {warnings.length} recommendation{warnings.length > 1 ? 's' : ''}{' '}
                to improve this routine
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc space-y-1 pl-5">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoutineValidationFeedback;
