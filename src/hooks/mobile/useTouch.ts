/**
 * Touch Gestures Hook
 * 
 * Single Responsibility: Handle touch gestures and interactions
 * Extracted from MobileChartContainer for better separation of concerns
 * Client-side only due to touch events
 */

'use client';

import { useState, useCallback } from 'react';

export interface TouchPoint {
  x: number;
  y: number;
}

export interface SwipeConfig {
  minDistance: number;
  maxVerticalThreshold: number;
  enabled: boolean;
}

export interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface UseTouchResult {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  isTracking: boolean;
  touchStart: TouchPoint | null;
  touchEnd: TouchPoint | null;
}

/**
 * Hook for handling touch gestures
 * 
 * Features:
 * - Swipe detection with configurable thresholds
 * - Direction-based callbacks
 * - Touch state tracking
 * - Gesture validation
 */
export const useTouch = (
  callbacks: SwipeCallbacks,
  config: SwipeConfig = {
    minDistance: 50,
    maxVerticalThreshold: 100,
    enabled: true
  }
): UseTouchResult => {
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!config.enabled) return;
    
    const touch = e.targetTouches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
    setIsTracking(true);
  }, [config.enabled]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!config.enabled || !touchStart) return;
    
    const touch = e.targetTouches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  }, [config.enabled, touchStart]);

  const onTouchEnd = useCallback(() => {
    if (!config.enabled || !touchStart || !touchEnd) {
      setIsTracking(false);
      return;
    }
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const absDistanceX = Math.abs(distanceX);
    const absDistanceY = Math.abs(distanceY);
    
    // Determine primary direction
    const isHorizontal = absDistanceX > absDistanceY;
    const meetsMinDistance = Math.max(absDistanceX, absDistanceY) > config.minDistance;
    
    if (!meetsMinDistance) {
      setIsTracking(false);
      return;
    }
    
    if (isHorizontal && absDistanceY < config.maxVerticalThreshold) {
      // Horizontal swipe
      if (distanceX > 0) {
        callbacks.onSwipeLeft?.();
      } else {
        callbacks.onSwipeRight?.();
      }
    } else if (!isHorizontal && absDistanceX < config.maxVerticalThreshold) {
      // Vertical swipe
      if (distanceY > 0) {
        callbacks.onSwipeUp?.();
      } else {
        callbacks.onSwipeDown?.();
      }
    }
    
    setIsTracking(false);
  }, [config, touchStart, touchEnd, callbacks]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isTracking,
    touchStart,
    touchEnd
  };
};
