import React from 'react';

/**
 * Props for FormLoadingState component
 */
interface FormLoadingStateProps {
  message?: string;
  className?: string;
  minHeight?: string;
}

/**
 * Reusable Form Loading State Component
 * 
 * Displays an accessible loading indicator for forms.
 * Follows Single Responsibility Principle - only handles loading state presentation.
 * 
 * Features:
 * - WCAG accessibility compliance with proper ARIA attributes
 * - Customizable message and styling
 * - Responsive design
 * - Consistent loading animation
 * 
 * @param message - Loading message to display
 * @param className - Additional CSS classes
 * @param minHeight - Minimum height for the loading container
 */
export const FormLoadingState: React.FC<FormLoadingStateProps> = ({
    message = "Caricamento...",
    className = "",
    minHeight = "min-h-[400px]"
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center p-8 ${minHeight} ${className}`}
            role="status"
            aria-live="polite"
            aria-label={message}
        >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" aria-hidden="true" />
            <span className="text-gray-600 text-sm">{message}</span>
        </div>
    );
}; 