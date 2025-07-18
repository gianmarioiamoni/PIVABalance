import React from 'react';
import { ExclamationTriangleIcon } from './Icon';

interface ErrorDisplayProps {
    title?: string;
    message: string | null;
    className?: string;
}

/**
 * ErrorDisplay Component
 * 
 * Reusable component for displaying error messages
 * Follows SRP by handling only error message display
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    title = "Si è verificato un errore",
    message,
    className = ""
}) => {
    if (!message) {
        return null;
    }

    return (
        <div className={`p-4 bg-red-50 border border-red-200 text-red-700 rounded-md ${className}`}>
            <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                    <h4 className="font-medium">{title}</h4>
                    <p className="text-sm mt-1">{message}</p>
                </div>
            </div>
        </div>
    );
}; 