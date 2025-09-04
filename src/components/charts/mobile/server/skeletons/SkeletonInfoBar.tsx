/**
 * Skeleton Info Bar Component
 * 
 * Single Responsibility: Render info bar skeleton
 */

import React from 'react';

export interface SkeletonInfoBarProps {
  showProgress?: boolean;
  showStatus?: boolean;
  className?: string;
}

/**
 * Info bar skeleton for mobile charts
 * 
 * Features:
 * - Chart info placeholders
 * - Progress indicators
 * - Status information
 */
export const SkeletonInfoBar: React.FC<SkeletonInfoBarProps> = ({
  showProgress = true,
  showStatus = true,
  className = ''
}) => {
  return (
    <div className={`chart-info-bar bg-gray-50 px-4 py-3 border-t border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left Section - Chart Info */}
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-16 mt-1 animate-pulse"></div>
        </div>
        
        {/* Right Section - Status & Progress */}
        <div className="flex items-center space-x-2 ml-4">
          {showProgress && <SkeletonProgress />}
          {showStatus && <SkeletonStatus />}
        </div>
      </div>
    </div>
  );
};

/**
 * Progress indicator skeleton
 * Single responsibility: Render progress placeholder
 */
const SkeletonProgress: React.FC = () => (
  <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
);

/**
 * Status indicator skeleton
 * Single responsibility: Render status placeholder
 */
const SkeletonStatus: React.FC = () => (
  <div className="w-6 h-6 bg-gray-100 rounded animate-pulse"></div>
);
