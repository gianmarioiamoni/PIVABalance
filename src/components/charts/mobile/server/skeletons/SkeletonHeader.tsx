/**
 * Skeleton Header Component
 * 
 * Single Responsibility: Render header skeleton for mobile charts
 */

import React from 'react';

export interface SkeletonHeaderProps {
  title?: string;
  subtitle?: string;
  showControls?: boolean;
}

/**
 * Header skeleton for mobile charts
 * 
 * Features:
 * - Title/subtitle placeholders
 * - Control button skeletons
 * - Responsive layout
 */
export const SkeletonHeader: React.FC<SkeletonHeaderProps> = ({
  title,
  subtitle,
  showControls = true
}) => {
  return (
    <div className="mobile-chart-header flex items-center justify-between p-4 border-b border-gray-200">
      {/* Title Section */}
      <div className="flex-1 min-w-0">
        {title ? (
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h3>
        ) : (
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
        )}
        {subtitle ? (
          <p className="text-sm text-gray-600 truncate">
            {subtitle}
          </p>
        ) : (
          <div className="h-4 bg-gray-100 rounded animate-pulse w-24 mt-1"></div>
        )}
      </div>

      {/* Controls Section */}
      {showControls && <SkeletonControls />}
    </div>
  );
};

/**
 * Control buttons skeleton
 * Single responsibility: Render control placeholders
 */
const SkeletonControls: React.FC = () => (
  <div className="flex items-center space-x-2 ml-4">
    {/* Navigation Controls */}
    <div className="flex items-center space-x-1">
      <div className="w-8 h-8 bg-gray-100 rounded-md animate-pulse"></div>
      <div className="w-8 h-8 bg-gray-100 rounded-md animate-pulse"></div>
    </div>
    
    {/* Zoom Controls */}
    <div className="flex items-center space-x-1">
      <div className="w-8 h-8 bg-gray-100 rounded-md animate-pulse"></div>
      <div className="w-12 h-6 bg-gray-100 rounded animate-pulse"></div>
      <div className="w-8 h-8 bg-gray-100 rounded-md animate-pulse"></div>
    </div>
    
    {/* Fullscreen Control */}
    <div className="w-8 h-8 bg-gray-100 rounded-md animate-pulse"></div>
  </div>
);
