/**
 * Widget Skeleton Component
 * 
 * SRP: Handles ONLY widget loading state rendering
 * Server-Side Rendered component for immediate visual feedback
 */

import React from 'react';
import { WidgetSize } from './types';

/**
 * Widget Skeleton Props
 * SRP: Interface for skeleton-specific properties only
 */
export interface WidgetSkeletonProps {
    size: WidgetSize;
    title?: string;
    showHeader?: boolean;
    showChart?: boolean;
    showStats?: boolean;
    showTable?: boolean;
    className?: string;
}

/**
 * Skeleton Content Variants
 * SRP: Handles only skeleton content type rendering
 */
const SkeletonChart: React.FC<{ height?: number }> = ({ height = 200 }) => (
    <div className="space-y-3">
        <div className={`bg-gray-200 rounded animate-pulse`} style={{ height: `${height}px` }}>
            <div className="h-full flex items-end justify-around p-4 space-x-2">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-gray-300 rounded-t animate-pulse"
                        style={{
                            height: `${Math.random() * 60 + 20}%`,
                            width: '12%'
                        }}
                    />
                ))}
            </div>
        </div>
    </div>
);

const SkeletonStats: React.FC = () => (
    <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </div>
        ))}
    </div>
);

const SkeletonTable: React.FC = () => (
    <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
        ))}
    </div>
);

const SkeletonContent: React.FC = () => (
    <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6" />
    </div>
);

/**
 * Widget Skeleton Component (Server-Side Rendered)
 * 
 * SRP Responsibilities:
 * 1. Loading state visualization ONLY
 * 2. Size-appropriate skeleton rendering ONLY
 * 3. Content type skeleton variants ONLY
 * 
 * NOT responsible for:
 * - Data fetching
 * - Widget logic
 * - Interactive features
 */
export const WidgetSkeleton: React.FC<WidgetSkeletonProps> = ({
    size,
    title: _title = 'Caricamento...',
    showHeader = true,
    showChart = false,
    showStats = false,
    showTable = false,
    className = ''
}) => {
    // Size-based height calculation
    const getContentHeight = (size: WidgetSize): number => {
        const heightMap: Record<WidgetSize, number> = {
            small: 120,
            medium: 200,
            large: 300,
            full: 400
        };
        return heightMap[size];
    };

    const contentHeight = getContentHeight(size);

    // Container classes based on size
    const containerClasses = [
        'widget-skeleton',
        'bg-white rounded-lg shadow-sm border border-gray-200',
        'animate-pulse',
        size === 'small' ? 'col-span-1 row-span-1' : '',
        size === 'medium' ? 'col-span-2 row-span-1' : '',
        size === 'large' ? 'col-span-2 row-span-2' : '',
        size === 'full' ? 'col-span-full row-span-2' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {/* Skeleton Header */}
            {showHeader && (
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-2 flex-1">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-32" />
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            )}

            {/* Skeleton Content */}
            <div className="p-4" style={{ minHeight: `${contentHeight}px` }}>
                {showChart && <SkeletonChart height={contentHeight - 32} />}
                {showStats && <SkeletonStats />}
                {showTable && <SkeletonTable />}
                {!showChart && !showStats && !showTable && <SkeletonContent />}
            </div>
        </div>
    );
};

export default WidgetSkeleton;
