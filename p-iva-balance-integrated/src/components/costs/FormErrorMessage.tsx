import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface FormErrorMessageProps {
    message: string;
    show: boolean;
}

/**
 * FormErrorMessage Component
 * 
 * Reusable component for displaying form field error messages
 * Follows SRP by handling only error message display
 */
export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ message, show }) => {
    if (!show || !message) {
        return null;
    }

    return (
        <div className="mt-1 flex items-center text-sm text-red-600">
            <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
}; 