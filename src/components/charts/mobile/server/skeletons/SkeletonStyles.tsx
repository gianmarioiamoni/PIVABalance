/**
 * Skeleton Styles Component
 * 
 * Single Responsibility: Provide CSS styles for skeleton animations
 */

import React from 'react';

/**
 * Skeleton CSS styles
 * 
 * Features:
 * - Pulse animation keyframes
 * - Responsive design considerations
 * - Accessibility (prefers-reduced-motion)
 */
export const SkeletonStyles: React.FC = () => (
  <style jsx>{`
    .mobile-chart-skeleton {
      position: relative;
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    @keyframes pulse {
      0%, 100% { 
        opacity: 1; 
      }
      50% { 
        opacity: 0.5; 
      }
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    /* Accessibility: Respect user motion preferences */
    @media (prefers-reduced-motion: reduce) {
      .animate-pulse {
        animation: none;
        opacity: 0.7;
      }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .mobile-chart-skeleton {
        border: 1px solid #000;
      }
      
      .animate-pulse {
        background-color: #666;
      }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .mobile-chart-skeleton {
        background: #1f2937;
        border-color: #374151;
      }
      
      .bg-gray-50 {
        background-color: #374151;
      }
      
      .bg-gray-100 {
        background-color: #4b5563;
      }
      
      .bg-gray-200 {
        background-color: #6b7280;
      }
    }
  `}</style>
);

/**
 * Skeleton container wrapper with styles
 * Single responsibility: Apply skeleton styling to children
 */
export const SkeletonContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`mobile-chart-skeleton ${className}`}>
    {children}
    <SkeletonStyles />
  </div>
);
