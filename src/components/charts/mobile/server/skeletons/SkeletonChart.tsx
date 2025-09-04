/**
 * Skeleton Chart Component
 * 
 * Single Responsibility: Render chart content skeleton
 */

import React from 'react';

export interface SkeletonChartProps {
  height?: number;
  variant?: 'chart' | 'empty' | 'error';
}

/**
 * Chart content skeleton
 * 
 * Features:
 * - Responsive chart placeholder
 * - Multiple visual variants
 * - Accessible loading state
 */
export const SkeletonChart: React.FC<SkeletonChartProps> = ({
  height = 300,
  variant = 'chart'
}) => {
  return (
    <div className="mobile-chart-content p-4">
      <div 
        className="mobile-chart-wrapper bg-gray-50 rounded-lg flex items-center justify-center animate-pulse"
        style={{ height: `${height}px` }}
      >
        <SkeletonChartContent variant={variant} />
      </div>
    </div>
  );
};

/**
 * Chart content variants
 * Single responsibility: Render specific chart placeholder types
 */
const SkeletonChartContent: React.FC<{ variant: 'chart' | 'empty' | 'error' }> = ({ variant }) => {
  switch (variant) {
    case 'chart':
      return <ChartPlaceholder />;
    case 'empty':
      return <EmptyChartPlaceholder />;
    case 'error':
      return <ErrorChartPlaceholder />;
    default:
      return <ChartPlaceholder />;
  }
};

/**
 * Default chart placeholder
 */
const ChartPlaceholder: React.FC = () => (
  <div className="text-center">
    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
    <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
    <div className="h-3 bg-gray-100 rounded w-24 mx-auto mt-2 animate-pulse"></div>
  </div>
);

/**
 * Empty state placeholder
 */
const EmptyChartPlaceholder: React.FC = () => (
  <div className="text-center text-gray-400">
    <div className="w-12 h-12 mx-auto mb-3">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
    <div className="text-sm">Nessun dato disponibile</div>
  </div>
);

/**
 * Error state placeholder
 */
const ErrorChartPlaceholder: React.FC = () => (
  <div className="text-center text-red-400">
    <div className="w-12 h-12 mx-auto mb-3">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <div className="text-sm">Errore nel caricamento</div>
  </div>
);
