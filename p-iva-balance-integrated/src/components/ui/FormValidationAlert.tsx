import React from 'react';
import { ExclamationTriangleIcon } from './Icon';

/**
 * Props for FormValidationAlert component
 */
interface FormValidationAlertProps {
    title?: string;
    message?: string;
    className?: string;
}

/**
 * Reusable Form Validation Alert Component
 * 
 * Displays validation messages for forms with proper accessibility.
 * Follows Single Responsibility Principle - only handles validation message display.
 * 
 * Features:
 * - WCAG accessibility compliance with proper ARIA attributes
 * - Consistent styling and icon usage
 * - Customizable title and message
 * - Screen reader support
 * 
 * @param title - Alert title
 * @param message - Alert message  
 * @param className - Additional CSS classes
 */
export const FormValidationAlert: React.FC<FormValidationAlertProps> = ({
    title = "Configurazione incompleta",
    message = "Completa tutti i campi obbligatori per salvare le impostazioni.",
    className = ""
}) => {
    return (
        <div
            className={`flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}
            role="alert"
            aria-live="polite"
        >
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">{title}</p>
                <p>{message}</p>
            </div>
        </div>
    );
}; 