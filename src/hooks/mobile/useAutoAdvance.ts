/**
 * Auto Advance Hook
 * 
 * Single Responsibility: Handle automatic carousel advancement
 * Extracted from MobileChartCarousel for SRP compliance
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface AutoAdvanceConfig {
  enabled: boolean;
  interval: number;
  pauseOnInteraction?: boolean;
  totalItems: number;
}

export interface UseAutoAdvanceResult {
  isAutoPlaying: boolean;
  pauseAutoAdvance: () => void;
  resumeAutoAdvance: () => void;
  toggleAutoAdvance: () => void;
  handleUserInteraction: () => void;
}

/**
 * Hook for handling automatic carousel advancement
 * 
 * Features:
 * - Timer-based auto-advance
 * - Pause/resume functionality
 * - User interaction detection
 * - Cleanup on unmount
 */
export const useAutoAdvance = (
  config: AutoAdvanceConfig,
  onAdvance: () => void
): UseAutoAdvanceResult => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(config.enabled);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Start/stop auto-advance timer
  useEffect(() => {
    if (isAutoPlaying && config.totalItems > 1) {
      autoAdvanceRef.current = setInterval(() => {
        onAdvance();
      }, config.interval);
    } else {
      if (autoAdvanceRef.current) {
        clearInterval(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    }

    return () => {
      if (autoAdvanceRef.current) {
        clearInterval(autoAdvanceRef.current);
        autoAdvanceRef.current = null;
      }
    };
  }, [isAutoPlaying, config.interval, config.totalItems, onAdvance]);

  const pauseAutoAdvance = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const resumeAutoAdvance = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  const toggleAutoAdvance = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  const handleUserInteraction = useCallback(() => {
    if (config.pauseOnInteraction) {
      pauseAutoAdvance();
    }
  }, [config.pauseOnInteraction, pauseAutoAdvance]);

  return {
    isAutoPlaying,
    pauseAutoAdvance,
    resumeAutoAdvance,
    toggleAutoAdvance,
    handleUserInteraction
  };
};
