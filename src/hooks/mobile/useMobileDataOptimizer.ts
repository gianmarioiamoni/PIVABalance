/**
 * Mobile Data Optimizer Hook
 * 
 * Single Responsibility: Optimize chart data for mobile rendering
 * Extracted from MobileChartOptimizer for SRP compliance
 */

'use client';

import { useMemo } from 'react';
import type { TaxBreakdownDataPoint } from '../../components/charts/types';
import type { ScreenSize } from './useScreenSize';
import type { ChartType } from './useMobileChartConfig';

export interface DataOptimizationConfig {
  chartType: ChartType;
  screenSize: ScreenSize;
  maxDataPoints?: number;
  aggregationThreshold?: number;
}

export interface UseMobileDataOptimizerResult<T> {
  optimizedData: T[];
  originalCount: number;
  optimizedCount: number;
  reductionPercentage: number;
}

/**
 * Type guard to check if data is TaxBreakdownDataPoint
 */
const isTaxBreakdownDataPoint = (item: unknown): item is TaxBreakdownDataPoint => {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const obj = item as Record<string, unknown>;
  return (
    'category' in obj &&
    'amount' in obj &&
    'percentage' in obj &&
    'color' in obj &&
    typeof obj.category === 'string' &&
    typeof obj.amount === 'number' &&
    typeof obj.percentage === 'number' &&
    typeof obj.color === 'string'
  );
};

/**
 * Type guard to check if array contains TaxBreakdownDataPoint items
 */
const isTaxBreakdownDataArray = (data: unknown[]): data is TaxBreakdownDataPoint[] => {
  return data.length > 0 && data.every(isTaxBreakdownDataPoint);
};

/**
 * Hook for optimizing chart data for mobile rendering
 * 
 * Features:
 * - Data point reduction for performance
 * - Small slice aggregation for pie charts
 * - Responsive data simplification
 * - Type-safe data transformation
 */
export const useMobileDataOptimizer = <T extends Record<string, unknown>>(
  data: T[],
  config: DataOptimizationConfig
): UseMobileDataOptimizerResult<T> => {

  const optimizedData = useMemo(() => {
    if (!data || data.length === 0) return data;

    const { chartType, screenSize, maxDataPoints, aggregationThreshold } = config;

    switch (chartType) {
      case 'cashflow':
      case 'trend':
        return optimizeTimeSeriesData(data, screenSize, maxDataPoints);

      case 'tax':
        return optimizeTaxBreakdownData(data, screenSize, aggregationThreshold);

      case 'comparison':
        return optimizeComparisonData(data, screenSize, maxDataPoints);

      default:
        return data;
    }
  }, [data, config]);

  const originalCount = data.length;
  const optimizedCount = optimizedData.length;
  const reductionPercentage = originalCount > 0 
    ? Math.round(((originalCount - optimizedCount) / originalCount) * 100)
    : 0;

  return {
    optimizedData,
    originalCount,
    optimizedCount,
    reductionPercentage
  };
};

// =============================================================================
// DATA OPTIMIZATION FUNCTIONS (Pure Functions)
// =============================================================================

/**
 * Optimize time series data (cashflow, trend)
 */
function optimizeTimeSeriesData<T extends Record<string, unknown>>(
  data: T[],
  screenSize: ScreenSize,
  maxDataPoints?: number
): T[] {
  const maxPoints = maxDataPoints || getMaxDataPointsForScreen(screenSize);
  
  if (data.length <= maxPoints) {
    return data;
  }

  // Take every nth element to reduce complexity while preserving trends
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
}

/**
 * Optimize tax breakdown data (pie charts)
 */
function optimizeTaxBreakdownData<T extends Record<string, unknown>>(
  data: T[],
  screenSize: ScreenSize,
  aggregationThreshold?: number
): T[] {
  // Type guard check before processing
  if (!isTaxBreakdownDataArray(data as unknown[])) {
    console.warn('Tax chart data does not match TaxBreakdownDataPoint interface');
    return data;
  }

  const taxData = data as unknown as TaxBreakdownDataPoint[];
  const total = taxData.reduce((sum, item) => sum + item.amount, 0);
  const threshold = aggregationThreshold || getAggregationThreshold(screenSize, total);

  if (screenSize === 'small') {
    const significantItems = taxData.filter(item => item.amount >= threshold);
    const smallItems = taxData.filter(item => item.amount < threshold);

    if (smallItems.length > 0) {
      const othersAmount = smallItems.reduce((sum, item) => sum + item.amount, 0);
      const othersPercentage = (othersAmount / total) * 100;

      const result = [
        ...significantItems,
        {
          category: 'Altri',
          amount: othersAmount,
          percentage: othersPercentage,
          color: '#9CA3AF'
        } as TaxBreakdownDataPoint
      ];

      return result as unknown as T[];
    }
  }

  return taxData as unknown as T[];
}

/**
 * Optimize comparison data
 */
function optimizeComparisonData<T extends Record<string, unknown>>(
  data: T[],
  screenSize: ScreenSize,
  maxDataPoints?: number
): T[] {
  const maxPoints = maxDataPoints || getMaxDataPointsForScreen(screenSize);
  
  if (data.length <= maxPoints) {
    return data;
  }

  // For comparison charts, prefer to show recent data
  return data.slice(-maxPoints);
}

/**
 * Get maximum data points based on screen size
 */
function getMaxDataPointsForScreen(screenSize: ScreenSize): number {
  switch (screenSize) {
    case 'small': return 6;
    case 'medium': return 12;
    case 'large': return 24;
  }
}

/**
 * Get aggregation threshold for tax data
 */
function getAggregationThreshold(screenSize: ScreenSize, total: number): number {
  const basePercentage = screenSize === 'small' ? 0.05 : 0.03; // 5% or 3%
  return total * basePercentage;
}
