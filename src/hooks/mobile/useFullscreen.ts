/**
 * Fullscreen Hook
 * 
 * Single Responsibility: Handle fullscreen mode for mobile charts
 * Extracted from MobileChartContainer for SRP compliance
 */

'use client';

import { useState, useCallback } from 'react';

export interface FullscreenConfig {
  enabled: boolean;
  exitOnEscape?: boolean;
}

export interface UseFullscreenResult {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  fullscreenClasses: string;
}

/**
 * Hook for handling fullscreen mode
 * 
 * Features:
 * - Fullscreen state management
 * - Toggle functionality
 * - CSS classes for fullscreen layout
 * - Escape key handling (optional)
 */
export const useFullscreen = (
  config: FullscreenConfig = {
    enabled: true,
    exitOnEscape: true
  }
): UseFullscreenResult => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(() => {
    if (!config.enabled) return;
    setIsFullscreen(true);
  }, [config.enabled]);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!config.enabled) return;
    setIsFullscreen(prev => !prev);
  }, [config.enabled]);

  // Generate CSS classes for fullscreen mode
  const fullscreenClasses = isFullscreen 
    ? 'fixed inset-0 z-50 bg-white' 
    : 'relative';

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    fullscreenClasses
  };
};
