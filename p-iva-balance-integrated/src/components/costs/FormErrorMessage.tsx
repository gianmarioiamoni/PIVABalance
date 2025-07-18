import React from 'react';
import { Icon } from '@/components/ui';

interface FormErrorMessageProps {
    message: string;
    className?: string;
}

/**
 * Reusable form error message component
 * Optimized with dynamic icon loading
 */
export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
    message,
    className = ''
}) => {
    if (!message) return null;

    return (
        <div className={`flex items-center text-red-600 text-sm mt-1 ${className}`}>
            <Icon name="ExclamationCircleIcon" className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
}; 