/**
 * Trend Indicator Component
 * 
 * Single Responsibility: Display trend information with appropriate icon and color
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getTrendIndicator } from '@/utils/chartUtils';

export interface TrendIndicatorProps {
    growth: number;
    className?: string;
}

/**
 * Trend Indicator Component
 * Shows growth trend with appropriate icon and styling
 */
export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
    growth,
    className = ''
}) => {
    const trendInfo = getTrendIndicator(growth);

    const IconComponent = trendInfo.type === 'up'
        ? TrendingUp
        : trendInfo.type === 'down'
            ? TrendingDown
            : Minus;

    return (
        <div className={`flex items-center space-x-1 ${trendInfo.color} ${className}`}>
            <IconComponent className="h-4 w-4" />
            <span className="text-sm font-medium">{trendInfo.text}</span>
        </div>
    );
};

export default TrendIndicator;
