/**
 * Mobile Chart Container (SRP Refactored)
 * 
 * Single Responsibility: UI Container for mobile charts
 * All logic extracted to dedicated hooks
 */

'use client';

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import {
  useTouch,
  usePinchZoom,
  useFullscreen,
  type SwipeCallbacks
} from '../../../hooks/mobile';
import { useComponentPerformance } from '@/hooks/performance/usePerformanceMonitoring';

export interface MobileChartContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  enableSwipe?: boolean;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

/**
 * Mobile Chart Container Component (SRP Compliant)
 * 
 * Single Responsibility: Render mobile chart UI container
 * 
 * Features:
 * - Clean UI rendering only
 * - Delegates all logic to specialized hooks
 * - Composable interaction behaviors
 * - Responsive layout management
 */
export const MobileChartContainer: React.FC<MobileChartContainerProps> = ({
  title,
  subtitle,
  children,
  enableSwipe = true,
  enableZoom = true,
  enableFullscreen = true,
  className = '',
  onSwipeLeft,
  onSwipeRight
}) => {
  // =============================================================================
  // HOOKS (Logic Delegation)
  // =============================================================================

  // Performance monitoring
  const { renderCount: _renderCount, lastRenderTime: _lastRenderTime } = useComponentPerformance('MobileChartContainer');

  // Touch gesture handling
  const swipeCallbacks: SwipeCallbacks = {
    onSwipeLeft,
    onSwipeRight
  };

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouch(swipeCallbacks, {
    minDistance: 50,
    maxVerticalThreshold: 100,
    enabled: enableSwipe
  });

  // Zoom functionality
  const {
    zoomLevel,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    containerRef
  } = usePinchZoom({
    enabled: enableZoom,
    minZoom: 0.6,
    maxZoom: 2,
    zoomStep: 0.2,
    initialZoom: 1
  });

  // Fullscreen mode
  const {
    isFullscreen,
    toggleFullscreen,
    fullscreenClasses
  } = useFullscreen({
    enabled: enableFullscreen
  });

  // =============================================================================
  // COMPUTED STYLES (Pure UI Logic)
  // =============================================================================

  const containerClasses = `
    mobile-chart-container
    ${fullscreenClasses}
    ${className}
  `.trim();

  const contentClasses = `
    mobile-chart-content
    ${isFullscreen ? 'h-full p-4' : 'p-4'}
    transition-transform duration-200 ease-out
  `.trim();

  const chartWrapperStyle = {
    transform: `scale(${zoomLevel})`,
    transformOrigin: 'center center',
    transition: 'transform 0.2s ease-out'
  };

  // =============================================================================
  // UI RENDERING (Single Responsibility)
  // =============================================================================

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header Section */}
      <MobileChartHeader
        title={title}
        subtitle={subtitle}
        isFullscreen={isFullscreen}
        enableZoom={enableZoom}
        enableFullscreen={enableFullscreen}
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Chart Content */}
      <div className={contentClasses}>
        <div
          className="mobile-chart-wrapper overflow-hidden"
          style={chartWrapperStyle}
        >
          {children}
        </div>
      </div>

      {/* Footer Info */}
      <MobileChartFooter
        isFullscreen={isFullscreen}
        zoomLevel={zoomLevel}
        enableZoom={enableZoom}
      />
    </div>
  );
};

// =============================================================================
// SUB-COMPONENTS (Single Responsibility)
// =============================================================================

interface MobileChartHeaderProps {
  title?: string;
  subtitle?: string;
  isFullscreen: boolean;
  enableZoom: boolean;
  enableFullscreen: boolean;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToggleFullscreen: () => void;
}

const MobileChartHeader: React.FC<MobileChartHeaderProps> = ({
  title,
  subtitle,
  isFullscreen,
  enableZoom,
  enableFullscreen,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleFullscreen
}) => (
  <div className="mobile-chart-header flex items-center justify-between p-4 border-b border-gray-200">
    <div className="flex-1 min-w-0">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-600 truncate">
          {subtitle}
        </p>
      )}
    </div>

    {/* Mobile Controls */}
    <div className="flex items-center space-x-2 ml-4">
      {/* Navigation Controls */}
      <div className="flex items-center space-x-1">
        <button
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Previous chart"
        >
          <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
        </button>
        <button
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Next chart"
        >
          <ChevronRightIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Zoom Controls */}
      {enableZoom && (
        <div className="flex items-center space-x-1">
          <button
            onClick={onZoomOut}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOutIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onZoomReset}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            aria-label={`Current zoom: ${Math.round(zoomLevel * 100)}%`}
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Zoom in"
          >
            <ZoomInIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Fullscreen Toggle */}
      {enableFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      )}
    </div>
  </div>
);

interface MobileChartFooterProps {
  isFullscreen: boolean;
  zoomLevel: number;
  enableZoom: boolean;
}

const MobileChartFooter: React.FC<MobileChartFooterProps> = ({
  isFullscreen,
  zoomLevel,
  enableZoom
}) => (
  <div className="chart-info-bar bg-gray-50 px-4 py-2 border-t border-gray-200">
    <div className="flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center space-x-4">
        <span>📱 Ottimizzato Mobile</span>
        {enableZoom && (
          <span>🔍 Zoom: {Math.round(zoomLevel * 100)}%</span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {isFullscreen && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Schermo Intero
          </span>
        )}
        <span>👆 Tocca per interagire</span>
      </div>
    </div>
  </div>
);

export default MobileChartContainer;
