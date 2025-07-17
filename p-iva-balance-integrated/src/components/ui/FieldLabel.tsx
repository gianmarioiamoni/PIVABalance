import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

/**
 * Props for FieldLabel component
 */
interface FieldLabelProps {
    htmlFor: string;
    children: React.ReactNode;
    tooltip?: React.ReactNode;
    required?: boolean;
    className?: string;
}

/**
 * Reusable Field Label Component with Tooltip
 * 
 * Follows Single Responsibility Principle - only handles label display with optional tooltip.
 * Provides consistent styling and accessibility across form fields.
 * 
 * Features:
 * - Optional tooltip with information icon
 * - Required field indicator
 * - Consistent styling and hover states
 * - Proper accessibility attributes
 * - Responsive design
 * 
 * @param htmlFor - ID of the associated form field
 * @param children - Label text content
 * @param tooltip - Optional tooltip content (string or React element)
 * @param required - Whether the field is required
 * @param className - Additional CSS classes
 */
export const FieldLabel: React.FC<FieldLabelProps> = ({
    htmlFor,
    children,
    tooltip,
    required = false,
    className = ""
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-gray-700 ${className}`}
        >
            {children}
            {required && (
                <span className="text-red-500 ml-1" aria-label="Campo obbligatorio">
                    *
                </span>
            )}
            {tooltip && (
                <Tooltip content={tooltip}>
                    <InformationCircleIcon
                        className="ml-1 inline h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help"
                        aria-label="Informazioni aggiuntive"
                    />
                </Tooltip>
            )}
        </label>
    );
}; 