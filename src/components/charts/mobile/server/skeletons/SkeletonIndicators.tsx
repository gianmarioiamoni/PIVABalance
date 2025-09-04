/**
 * Skeleton Indicators Component
 * 
 * Single Responsibility: Render carousel indicators skeleton
 */

import React from 'react';

export interface SkeletonIndicatorsProps {
  count?: number;
  activeIndex?: number;
  className?: string;
}

/**
 * Carousel indicators skeleton
 * 
 * Features:
 * - Configurable indicator count
 * - Active state simulation
 * - Responsive spacing
 */
export const SkeletonIndicators: React.FC<SkeletonIndicatorsProps> = ({
  count = 3,
  activeIndex = 0,
  className = ''
}) => {
  return (
    <div className={`carousel-indicators flex justify-center space-x-2 mt-4 px-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <SkeletonIndicatorDot
          key={index}
          isActive={index === activeIndex}
        />
      ))}
    </div>
  );
};

/**
 * Individual indicator dot skeleton
 * Single responsibility: Render single indicator placeholder
 */
const SkeletonIndicatorDot: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div
    className={`
      w-2 h-2 rounded-full animate-pulse transition-all duration-200
      ${isActive ? 'w-6 bg-gray-300' : 'bg-gray-200'}
    `}
    aria-hidden="true"
  />
);
