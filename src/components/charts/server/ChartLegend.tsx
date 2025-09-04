import React from 'react';

export interface ServerLegendItem {
    color: string;
    label: string;
    value?: string | number;
}

export interface ServerChartLegendProps {
    items: ServerLegendItem[];
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

/**
 * Server-Side Chart Legend Component
 * 
 * Pure server component for static legend rendering
 * No client-side dependencies - optimized for SSR
 * 
 * Features:
 * - Zero JavaScript bundle
 * - SEO-friendly content
 * - Static positioning
 * - Consistent styling
 * - Faster initial render
 */
export const ServerChartLegend: React.FC<ServerChartLegendProps> = ({
    items,
    position = 'bottom',
    className = ''
}) => {
    const getFlexDirection = () => {
        switch (position) {
            case 'top':
            case 'bottom':
                return 'flex-row flex-wrap justify-center';
            case 'left':
            case 'right':
                return 'flex-col';
            default:
                return 'flex-row flex-wrap justify-center';
        }
    };

    const getSpacing = () => {
        switch (position) {
            case 'top':
                return 'mb-4';
            case 'bottom':
                return 'mt-4';
            case 'left':
                return 'mr-4';
            case 'right':
                return 'ml-4';
            default:
                return 'mt-4';
        }
    };

    const flexDirection = getFlexDirection();
    const spacing = getSpacing();

    if (!items.length) {
        return null;
    }

    return (
        <div className={`flex ${flexDirection} ${spacing} gap-4 ${className}`}>
            {items.map((item, index) => (
                <div
                    key={`${item.label}-${index}`}
                    className="flex items-center space-x-2 text-sm"
                >
                    {/* Color Indicator */}
                    <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                    />

                    {/* Label */}
                    <span className="text-gray-700 font-medium">
                        {item.label}
                    </span>

                    {/* Value */}
                    {item.value !== undefined && (
                        <span className="text-gray-600 font-normal">
                            {typeof item.value === 'number'
                                ? item.value.toLocaleString('it-IT')
                                : item.value
                            }
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ServerChartLegend;
