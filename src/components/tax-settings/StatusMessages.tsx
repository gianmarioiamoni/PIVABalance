import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface StatusMessagesProps {
  error?: string;
  success?: boolean;
}

/**
 * StatusMessages Component
 * Displays success and error messages with enhanced accessibility and visual design
 */
export const StatusMessages: React.FC<StatusMessagesProps> = ({ error, success }) => {
  if (!error && !success) return null;

  return (
    <div className="space-y-3">
      {error ? (
        <div 
          className="flex items-start p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-sm"
          role="alert"
          aria-live="polite"
        >
          <ExclamationCircleIcon className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      ) : null}

      {success ? (
        <div 
          className="flex items-start p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg shadow-sm"
          role="alert"
          aria-live="polite"
        >
          <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
          <span className="text-sm font-medium">Impostazioni salvate con successo!</span>
        </div>
      ) : null}
    </div>
  );
}; 