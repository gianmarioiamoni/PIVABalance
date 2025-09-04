/**
 * Carousel Navigation Hook
 * 
 * Single Responsibility: Handle carousel navigation logic
 * Extracted from MobileChartCarousel for SRP compliance
 */

'use client';

import { useState, useCallback } from 'react';

export interface NavigationConfig {
  enableInfiniteLoop: boolean;
  totalItems: number;
  initialIndex?: number;
}

export interface UseCarouselNavigationResult {
  currentIndex: number;
  goToSlide: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  getVisibleIndices: () => number[];
}

/**
 * Hook for handling carousel navigation
 * 
 * Features:
 * - Index management with bounds checking
 * - Infinite loop support
 * - Adjacent slide preloading logic
 * - Navigation state tracking
 */
export const useCarouselNavigation = ({
  enableInfiniteLoop,
  totalItems,
  initialIndex = 0
}: NavigationConfig): UseCarouselNavigationResult => {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, totalItems - 1))
  );

  const goToSlide = useCallback((index: number) => {
    if (enableInfiniteLoop) {
      // Handle infinite loop with modulo
      const normalizedIndex = ((index % totalItems) + totalItems) % totalItems;
      setCurrentIndex(normalizedIndex);
    } else {
      // Clamp to valid range
      setCurrentIndex(Math.max(0, Math.min(index, totalItems - 1)));
    }
  }, [enableInfiniteLoop, totalItems]);

  const goToNext = useCallback(() => {
    if (enableInfiniteLoop) {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, totalItems - 1));
    }
  }, [enableInfiniteLoop, totalItems]);

  const goToPrevious = useCallback(() => {
    if (enableInfiniteLoop) {
      setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  }, [enableInfiniteLoop, totalItems]);

  // Calculate navigation capabilities
  const canGoNext = enableInfiniteLoop || currentIndex < totalItems - 1;
  const canGoPrevious = enableInfiniteLoop || currentIndex > 0;

  // Get visible chart indices for optimization (preloading)
  const getVisibleIndices = useCallback(() => {
    const indices = [currentIndex];

    // Preload adjacent charts for smooth swiping
    if (canGoPrevious) {
      const prevIndex = enableInfiniteLoop
        ? (currentIndex - 1 + totalItems) % totalItems
        : currentIndex - 1;
      indices.push(prevIndex);
    }

    if (canGoNext) {
      const nextIndex = enableInfiniteLoop
        ? (currentIndex + 1) % totalItems
        : currentIndex + 1;
      indices.push(nextIndex);
    }

    return indices;
  }, [currentIndex, canGoNext, canGoPrevious, enableInfiniteLoop, totalItems]);

  return {
    currentIndex,
    goToSlide,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    getVisibleIndices
  };
};
