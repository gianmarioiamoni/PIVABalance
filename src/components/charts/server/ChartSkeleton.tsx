import React from 'react';

export interface ChartSkeletonProps {
    height?: number;
    showLegend?: boolean;
    showHeader?: boolean;
    className?: string;
}

/**
 * Server-Side Chart Skeleton Component
 * 
 * Pure server component for loading states
 * Rendered server-side for immediate visual feedback
 * 
 * Features:
 * - Zero JavaScript
 * - Instant loading state
 * - Consistent with actual chart dimensions
 * - Smooth transition to real charts
 * - SEO-friendly structure
 */
export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
    height = 400,
    showLegend = true,
    showHeader = true,
    className = ''
}) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header Skeleton */}
            {showHeader && (
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded-md w-48 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded-md w-64 animate-pulse" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded-md w-24 animate-pulse" />
                </div>
            )}

            {/* Chart Area Skeleton */}
            <div
                className="bg-gray-100 rounded-lg animate-pulse flex items-center justify-center"
                style={{ height: `${height}px` }}
            >
                {/* Simulated Chart Elements */}
                <div className="w-full h-full p-8 flex flex-col">
                    {/* Y-Axis Labels */}
                    <div className="flex justify-between items-end h-full">
                        <div className="space-y-4">
                            <div className="h-3 bg-gray-200 rounded w-12" />
                            <div className="h-3 bg-gray-200 rounded w-10" />
                            <div className="h-3 bg-gray-200 rounded w-14" />
                            <div className="h-3 bg-gray-200 rounded w-8" />
                        </div>

                        {/* Chart Bars/Lines Simulation */}
                        <div className="flex-1 mx-4 flex items-end justify-around space-x-2 h-full">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-300 rounded-t-sm animate-pulse"
                                    style={{
                                        height: `${Math.random() * 60 + 20}%`,
                                        width: '100%',
                                        maxWidth: '40px'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* X-Axis Labels */}
                    <div className="flex justify-around mt-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-3 bg-gray-200 rounded w-8" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend Skeleton */}
            {showLegend && (
                <div className="flex justify-center space-x-6 pt-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChartSkeleton;
