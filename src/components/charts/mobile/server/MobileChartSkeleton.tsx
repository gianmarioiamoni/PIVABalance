/**
 * Mobile Chart Skeleton (SRP Refactored)
 * 
 * Single Responsibility: Compose skeleton components
 * All rendering logic extracted to specialized sub-components
 */

import React from 'react';
import {
  SkeletonHeader,
  SkeletonChart,
  SkeletonIndicators,
  SkeletonInfoBar,
  SkeletonLoadingOverlay,
  SkeletonContainer
} from './skeletons';

export interface MobileChartSkeletonProps {
  title?: string;
  subtitle?: string;
  showControls?: boolean;
  showIndicators?: boolean;
  showInfoBar?: boolean;
  showLoadingOverlay?: boolean;
  height?: number;
  indicatorCount?: number;
  variant?: 'chart' | 'empty' | 'error';
  className?: string;
}

/**
 * Mobile Chart Skeleton (SRP Compliant)
 * 
 * Single Responsibility: Compose skeleton layout
 * 
 * Features:
 * - Clean composition of skeleton parts
 * - Delegates rendering to specialized components
 * - Configurable skeleton sections
 * - SSR-optimized structure
 */
export const MobileChartSkeleton: React.FC<MobileChartSkeletonProps> = ({
  title,
  subtitle,
  showControls = true,
  showIndicators = true,
  showInfoBar = true,
  showLoadingOverlay = true,
  height = 300,
  indicatorCount = 3,
  variant = 'chart',
  className = ''
}) => {
  return (
    <SkeletonContainer className={className}>
      {/* Header Section */}
      <SkeletonHeader
        title={title}
        subtitle={subtitle}
        showControls={showControls}
      />

      {/* Chart Content Section */}
      <SkeletonChart
        height={height}
        variant={variant}
      />

      {/* Indicators Section */}
      {showIndicators && (
        <SkeletonIndicators
          count={indicatorCount}
          activeIndex={0}
        />
      )}

      {/* Info Bar Section */}
      {showInfoBar && (
        <SkeletonInfoBar
          showProgress={true}
          showStatus={true}
        />
      )}

      {/* Loading Overlay */}
      {showLoadingOverlay && (
        <SkeletonLoadingOverlay
          message="Caricamento grafico..."
          showSpinner={true}
        />
      )}
    </SkeletonContainer>
  );
};

/**
 * Preset configurations for common skeleton types
 */
export const SkeletonPresets = {
  /**
   * Minimal skeleton for fast loading
   */
  minimal: {
    showControls: false,
    showIndicators: false,
    showInfoBar: false,
    showLoadingOverlay: false,
    height: 200
  },

  /**
   * Standard skeleton for regular charts
   */
  standard: {
    showControls: true,
    showIndicators: false,
    showInfoBar: true,
    showLoadingOverlay: true,
    height: 300
  },

  /**
   * Full skeleton for carousel charts
   */
  carousel: {
    showControls: true,
    showIndicators: true,
    showInfoBar: true,
    showLoadingOverlay: true,
    height: 300,
    indicatorCount: 3
  },

  /**
   * Error skeleton for failed loads
   */
  error: {
    showControls: false,
    showIndicators: false,
    showInfoBar: false,
    showLoadingOverlay: false,
    variant: 'error' as const,
    height: 250
  }
};

/**
 * Hook for skeleton preset selection
 * Single responsibility: Provide preset configurations
 */
export const useSkeletonPreset = (
  presetName: keyof typeof SkeletonPresets,
  overrides: Partial<MobileChartSkeletonProps> = {}
): MobileChartSkeletonProps => {
  const preset = SkeletonPresets[presetName];
  return { ...preset, ...overrides };
};

export default MobileChartSkeleton;
