import React from 'react';
import { Icon } from '@/components/ui/Icon';

/**
 * Props for FieldLabel component
 */
interface FieldLabelProps {
    children: React.ReactNode;
    required?: boolean;
    tooltip?: React.ReactNode;
    className?: string;
    htmlFor?: string;
}

/**
 * Reusable field label component with optimized icon
 */
export const FieldLabel: React.FC<FieldLabelProps> = ({
    children,
    required = false,
    tooltip,
    className = '',
    htmlFor
}) => {
    return (
        <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
            <span className="flex items-center">
                {children}
                {required && <span className="text-red-500 ml-1">*</span>}
                {tooltip && (
                    <div className="relative ml-2 group">
                        <Icon
                            name="InformationCircleIcon"
                            className="h-4 w-4 text-gray-400 cursor-help"
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {tooltip}
                        </div>
                    </div>
                )}
            </span>
        </label>
    );
}; 