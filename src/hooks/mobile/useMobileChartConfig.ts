/**
 * Mobile Chart Config Hook
 * 
 * Single Responsibility: Generate mobile-optimized chart configurations
 * Extracted from MobileChartOptimizer for SRP compliance
 */

'use client';

import { useMemo } from 'react';
import type { ChartConfig } from '../../components/charts/types';
import type { ScreenSize } from './useScreenSize';

export type ChartType = 'cashflow' | 'trend' | 'tax' | 'comparison';

export interface MobileConfigOptions {
  chartType: ChartType;
  screenSize: ScreenSize;
  originalConfig?: Partial<ChartConfig>;
}

export interface UseMobileChartConfigResult {
  mobileConfig: ChartConfig;
}

/**
 * Hook for generating mobile-optimized chart configurations
 * 
 * Features:
 * - Responsive height and margins
 * - Chart-type specific optimizations
 * - Grid and legend visibility logic
 * - Mobile-first design principles
 */
export const useMobileChartConfig = ({
  chartType,
  screenSize,
  originalConfig = {}
}: MobileConfigOptions): UseMobileChartConfigResult => {

  const mobileConfig = useMemo((): ChartConfig => {
    // Base mobile configuration
    const baseConfig: ChartConfig = {
      height: getHeightForScreenSize(screenSize),
      margin: getMarginForScreenSize(screenSize),
      showGrid: shouldShowGrid(chartType, screenSize),
      showTooltip: true,
      showLegend: shouldShowLegend(chartType, screenSize),
      responsive: true,
      colors: originalConfig.colors || getDefaultColors()
    };

    // Apply chart-specific optimizations
    return applyChartSpecificConfig(chartType, screenSize, baseConfig);
  }, [chartType, screenSize, originalConfig]);

  return {
    mobileConfig
  };
};

// =============================================================================
// UTILITY FUNCTIONS (Pure Functions)
// =============================================================================

/**
 * Get responsive height based on screen size
 */
function getHeightForScreenSize(screenSize: ScreenSize): number {
  switch (screenSize) {
    case 'small': return 250;
    case 'medium': return 300;
    case 'large': return 350;
  }
}

/**
 * Get responsive margins based on screen size
 */
function getMarginForScreenSize(screenSize: ScreenSize) {
  switch (screenSize) {
    case 'small': 
      return { top: 10, right: 10, bottom: 30, left: 30 };
    case 'medium': 
      return { top: 15, right: 15, bottom: 40, left: 40 };
    case 'large': 
      return { top: 20, right: 20, bottom: 50, left: 50 };
  }
}

/**
 * Determine if grid should be shown based on chart type and screen size
 */
function shouldShowGrid(chartType: ChartType, screenSize: ScreenSize): boolean {
  if (screenSize === 'small') {
    // Hide grid on very small screens for cleaner look
    return chartType === 'tax'; // Only show for pie charts
  }
  return true;
}

/**
 * Determine if legend should be shown based on chart type and screen size
 */
function shouldShowLegend(chartType: ChartType, screenSize: ScreenSize): boolean {
  switch (chartType) {
    case 'cashflow':
      return screenSize !== 'small'; // Hide on small screens
    case 'tax':
      return true; // Always show for pie charts
    case 'trend':
    case 'comparison':
      return screenSize === 'large'; // Only on large screens
    default:
      return true;
  }
}

/**
 * Get default color palette
 */
function getDefaultColors(): string[] {
  return ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#F97316'];
}

/**
 * Apply chart-specific configuration optimizations
 */
function applyChartSpecificConfig(
  chartType: ChartType, 
  screenSize: ScreenSize, 
  baseConfig: ChartConfig
): ChartConfig {
  switch (chartType) {
    case 'cashflow':
      return {
        ...baseConfig,
        height: screenSize === 'small' ? 200 : baseConfig.height,
        showLegend: screenSize !== 'small'
      };

    case 'trend':
      return {
        ...baseConfig,
        height: screenSize === 'small' ? 220 : Math.max(280, baseConfig.height || 280),
        showGrid: screenSize !== 'small'
      };

    case 'tax':
      return {
        ...baseConfig,
        height: screenSize === 'small' ? 280 : Math.max(350, baseConfig.height || 350),
        showLegend: true // Always show legend for pie charts
      };

    case 'comparison':
      return {
        ...baseConfig,
        height: screenSize === 'small' ? 240 : Math.max(320, baseConfig.height || 320),
        showGrid: screenSize === 'large'
      };

    default:
      return baseConfig;
  }
}
