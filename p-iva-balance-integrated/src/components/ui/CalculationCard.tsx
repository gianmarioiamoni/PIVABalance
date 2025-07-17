import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';
import { Tooltip } from './Tooltip';

/**
 * Props for CalculationCard component
 */
interface CalculationCardProps {
    title: string;
    value: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    tooltip?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    isLoading?: boolean;
    'aria-label'?: string;
}

/**
 * Calculation Card Component
 * 
 * Reusable card component for displaying calculation results.
 * Follows Single Responsibility Principle - only handles calculation card display.
 * 
 * Features:
 * - Multiple visual variants for different types of data
 * - Loading states with skeleton animation
 * - Tooltip support for additional information
 * - Accessibility compliant with ARIA attributes
 * - Hover animations and transitions
 * - Responsive design
 * 
 * @param title - Card title/label
 * @param value - Numeric value to display
 * @param icon - Icon component to display
 * @param tooltip - Optional tooltip content
 * @param variant - Visual variant for different data types
 * @param isLoading - Whether to show loading state
 * @param aria-label - ARIA label for accessibility
 */
export const CalculationCard: React.FC<CalculationCardProps> = React.memo(({
    title,
    value,
    icon: Icon,
    tooltip,
    variant = 'default',
    isLoading = false,
    'aria-label': ariaLabel,
}) => {
    const variantStyles = {
        default: 'bg-white border-gray-200 text-gray-900',
        primary: 'bg-blue-50 border-blue-200 text-blue-900',
        success: 'bg-green-50 border-green-200 text-green-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        danger: 'bg-red-50 border-red-200 text-red-900',
    };

    const iconStyles = {
        default: 'text-gray-500',
        primary: 'text-blue-500',
        success: 'text-green-500',
        warning: 'text-yellow-500',
        danger: 'text-red-500',
    };

    return (
        <div
            className={`
        p-6 rounded-lg border-2 shadow-sm transition-all duration-200 ease-in-out
        hover:shadow-md hover:-translate-y-0.5
        ${variantStyles[variant]}
        ${isLoading ? 'animate-pulse' : ''}
      `}
            role="region"
            aria-label={ariaLabel || `${title}: ${formatCurrency(value)}`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                        <Icon className={`h-5 w-5 mr-2 flex-shrink-0 ${iconStyles[variant]}`} aria-hidden="true" />
                        <h3 className="text-sm font-medium truncate">{title}</h3>
                        {tooltip && (
                            <Tooltip content={tooltip}>
                                <InformationCircleIcon className="ml-1 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
                            </Tooltip>
                        )}
                    </div>
                    <div className="mt-2">
                        {isLoading ? (
                            <div className="h-8 bg-gray-200 rounded animate-pulse" />
                        ) : (
                            <p className="text-2xl font-bold">
                                {formatCurrency(value)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

CalculationCard.displayName = 'CalculationCard'; 