/**
 * Screen Size Hook
 * 
 * Single Responsibility: Handle screen size detection and responsive behavior
 * Extracted from MobileChartOptimizer for SRP compliance
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export type ScreenSize = 'small' | 'medium' | 'large';

export interface ScreenBreakpoints {
  small: number;   // < 375px
  medium: number;  // 375-768px  
  large: number;   // > 768px
}

export interface UseScreenSizeResult {
  screenSize: ScreenSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

const DEFAULT_BREAKPOINTS: ScreenBreakpoints = {
  small: 375,
  medium: 768,
  large: 1024
};

/**
 * Hook for detecting and tracking screen size changes
 * 
 * Features:
 * - Responsive breakpoint detection
 * - Window resize listener
 * - Device category classification
 * - SSR-safe initialization
 */
export const useScreenSize = (
  breakpoints: ScreenBreakpoints = DEFAULT_BREAKPOINTS
): UseScreenSizeResult => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  const getScreenSize = useCallback((width: number): ScreenSize => {
    if (width < breakpoints.small) return 'small';
    if (width < breakpoints.medium) return 'medium';
    return 'large';
  }, [breakpoints]);

  const updateDimensions = useCallback(() => {
    if (typeof window !== 'undefined') {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, []);

  useEffect(() => {
    // Initial measurement
    updateDimensions();

    // Listen for resize events
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  const screenSize = getScreenSize(dimensions.width);
  
  return {
    screenSize,
    isMobile: screenSize === 'small' || screenSize === 'medium',
    isTablet: screenSize === 'medium',
    isDesktop: screenSize === 'large',
    width: dimensions.width,
    height: dimensions.height
  };
};
