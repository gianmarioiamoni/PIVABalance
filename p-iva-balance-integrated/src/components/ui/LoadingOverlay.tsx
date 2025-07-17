import React from 'react';

/**
 * Props for LoadingOverlay component
 */
interface LoadingOverlayProps {
    isVisible: boolean;
    className?: string;
    spinnerSize?: 'sm' | 'md' | 'lg';
    overlayOpacity?: 'light' | 'medium' | 'heavy';
}

/**
 * Reusable Loading Overlay Component
 * 
 * Follows Single Responsibility Principle - only handles loading overlay display.
 * Provides consistent loading states across different UI elements.
 * 
 * Features:
 * - Configurable spinner size
 * - Adjustable overlay opacity
 * - Proper accessibility with aria-hidden
 * - Smooth animations
 * - Absolute positioning for overlay effect
 * 
 * @param isVisible - Whether the overlay should be shown
 * @param className - Additional CSS classes
 * @param spinnerSize - Size of the loading spinner
 * @param overlayOpacity - Opacity level of the background overlay
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isVisible,
    className = "",
    spinnerSize = 'md',
    overlayOpacity = 'medium'
}) => {
    if (!isVisible) return null;

    const spinnerSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    };

    const overlayOpacities = {
        light: 'bg-opacity-25',
        medium: 'bg-opacity-50',
        heavy: 'bg-opacity-75'
    };

    return (
        <div
            className={`
        absolute inset-0 bg-gray-50 ${overlayOpacities[overlayOpacity]} 
        flex items-center justify-center rounded-lg z-10 
        ${className}
      `}
            aria-hidden="true"
        >
            <div
                className={`
          animate-spin rounded-full border-b-2 border-blue-600 
          ${spinnerSizes[spinnerSize]}
        `}
            />
        </div>
    );
}; 