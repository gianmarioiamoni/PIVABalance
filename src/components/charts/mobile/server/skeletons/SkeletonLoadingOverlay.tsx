/**
 * Skeleton Loading Overlay Component
 * 
 * Single Responsibility: Render loading overlay with spinner
 */

import React from 'react';

export interface SkeletonLoadingOverlayProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

/**
 * Loading overlay skeleton
 * 
 * Features:
 * - Animated spinner
 * - Customizable message
 * - Overlay positioning
 */
export const SkeletonLoadingOverlay: React.FC<SkeletonLoadingOverlayProps> = ({
  message = 'Caricamento grafico...',
  showSpinner = true,
  className = ''
}) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 pointer-events-none ${className}`}>
      <div className="flex items-center space-x-2 text-gray-600">
        {showSpinner && <LoadingSpinner />}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
};

/**
 * Loading spinner component
 * Single responsibility: Render animated spinner
 */
const LoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600" />
);
