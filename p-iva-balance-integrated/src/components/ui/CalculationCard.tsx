import React from 'react';
import { Icon } from '@/components/ui/Icon';

/**
 * Props for CalculationCard component
 */
interface CalculationCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: number;
    description?: string;
    tooltip?: string;
    className?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    isLoading?: boolean;
}

/**
 * Reusable calculation card component with optimized icon
 */
export const CalculationCard: React.FC<CalculationCardProps> = ({
    title,
    value,
    description,
    tooltip,
    className = '',
    variant = 'default',
    icon,
    isLoading = false,
    ...htmlProps
}) => {
    const variantClasses = {
        default: 'bg-white border-gray-200',
        primary: 'bg-blue-50 border-blue-200',
        success: 'bg-green-50 border-green-200',
        warning: 'bg-yellow-50 border-yellow-200',
        danger: 'bg-red-50 border-red-200'
    };

    return (
        <div
            className={`border rounded-lg ${variantClasses[variant]} ${className}`}
            {...htmlProps}
        >
            {/* Header section con icona e tooltip */}
            <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-3">
                    {icon && React.createElement(icon, {
                        className: "h-6 w-6 text-gray-500"
                    })}
                    {tooltip && (
                        <div className="relative group">
                            <Icon
                                name="InformationCircleIcon"
                                className="h-5 w-5 text-gray-500 cursor-help hover:text-gray-700 transition-colors"
                            />
                            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 w-64">
                                <div className="whitespace-normal break-words">
                                    {tooltip}
                                </div>
                                <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-gray-800"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Titolo centrato sotto icona e tooltip */}
                <h3 className="text-sm font-medium text-gray-900 text-center mb-2">
                    {title}
                </h3>
            </div>

            {/* Valore principale centrato */}
            <div className="px-6 pb-6 text-center">
                {isLoading ? (
                    <div className="text-2xl font-bold text-gray-400 min-h-[2.5rem] flex items-center justify-center">
                        Caricamento...
                    </div>
                ) : (
                    <div className="text-2xl font-bold text-gray-900 min-h-[2.5rem] flex items-center justify-center">
                        <span className="truncate">
                            {new Intl.NumberFormat('it-IT', {
                                style: 'currency',
                                currency: 'EUR'
                            }).format(value)}
                        </span>
                    </div>
                )}
                {description && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}; 