/**
 * Pinch Zoom Hook
 *
 * Single Responsibility: Handle pinch-to-zoom gestures
 * Extracted from MobileChartContainer for better separation of concerns
 * Client-side only due to touch events and DOM manipulation
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface ZoomConfig {
  enabled: boolean;
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  initialZoom: number;
}

export interface UsePinchZoomResult {
  zoomLevel: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleZoomReset: () => void;
  setZoomLevel: (level: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook for handling pinch-to-zoom interactions
 *
 * Features:
 * - Pinch gesture detection
 * - Zoom level management
 * - Zoom controls (in/out/reset)
 * - Configurable zoom limits
 * - Touch event handling
 */
export const usePinchZoom = (
  config: ZoomConfig = {
    enabled: true,
    minZoom: 0.6,
    maxZoom: 2,
    zoomStep: 0.2,
    initialZoom: 1,
  }
): UsePinchZoomResult => {
  const [zoomLevel, setZoomLevel] = useState(config.initialZoom);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    if (!config.enabled) return;
    setZoomLevel((prev) => Math.min(prev + config.zoomStep, config.maxZoom));
  }, [config]);

  const handleZoomOut = useCallback(() => {
    if (!config.enabled) return;
    setZoomLevel((prev) => Math.max(prev - config.zoomStep, config.minZoom));
  }, [config]);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(config.initialZoom);
  }, [config.initialZoom]);

  const setZoomLevelSafe = useCallback(
    (level: number) => {
      const clampedLevel = Math.min(
        Math.max(level, config.minZoom),
        config.maxZoom
      );
      setZoomLevel(clampedLevel);
    },
    [config.minZoom, config.maxZoom]
  );

  // Pinch-to-zoom gesture handling
  useEffect(() => {
    if (!config.enabled) return;

    let initialDistance = 0;
    let initialZoom = zoomLevel;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        initialZoom = zoomLevel;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );

        if (initialDistance > 0) {
          const scale = currentDistance / initialDistance;
          const newZoom = initialZoom * scale;
          setZoomLevelSafe(newZoom);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [config.enabled, zoomLevel, setZoomLevelSafe]);

  return {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    setZoomLevel: setZoomLevelSafe,
    containerRef,
  };
};
