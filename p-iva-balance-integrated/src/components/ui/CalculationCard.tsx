import React from 'react';
import { Icon } from '@/components/ui/Icon';

/**
 * Props for CalculationCard component
 */
interface CalculationCardProps {
    title: string;
    amount: number;
    description?: string;
    tooltip?: string;
    className?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

/**
 * Reusable calculation card component with optimized icon
 */
export const CalculationCard: React.FC<CalculationCardProps> = ({
    title,
    amount,
    description,
    tooltip,
    className = '',
    variant = 'default'
}) => {
    const variantClasses = {
        default: 'bg-white border-gray-200',
        primary: 'bg-blue-50 border-blue-200',
        success: 'bg-green-50 border-green-200',
        warning: 'bg-yellow-50 border-yellow-200',
        danger: 'bg-red-50 border-red-200'
    };

    return (
        <div className={`border rounded-lg p-4 ${variantClasses[variant]} ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                    {title}
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
                </h3>
            </div>
            <div className="mt-2">
                <div className="text-2xl font-semibold text-gray-900">
                    {new Intl.NumberFormat('it-IT', {
                        style: 'currency',
                        currency: 'EUR'
                    }).format(amount)}
                </div>
                {description && (
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}; 