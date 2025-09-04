/**
 * useTrendAnalysis Hook
 *
 * Single Responsibility: Calculate trend analysis data
 * Separates business logic from component rendering
 */

import { useMemo } from "react";
import type { TrendDataPoint } from "@/components/charts/types";
import {
  calculateTrendAverage,
  calculateOverallGrowth,
  getTrendIndicator,
  calculateGrowthText,
} from "@/utils/chartUtils";

export interface UseTrendAnalysisProps {
  data: TrendDataPoint[];
}

export interface UseTrendAnalysisReturn {
  average: number;
  overallGrowth: number;
  trendIndicator: ReturnType<typeof getTrendIndicator>;
  getGrowthText: (currentValue: number, previousValue?: number) => string;
}

/**
 * Hook for trend analysis calculations
 * Memoized for performance
 */
export const useTrendAnalysis = ({
  data,
}: UseTrendAnalysisProps): UseTrendAnalysisReturn => {
  const analysis = useMemo(() => {
    const average = calculateTrendAverage(data);
    const overallGrowth = calculateOverallGrowth(data);
    const trendIndicator = getTrendIndicator(overallGrowth);

    return {
      average,
      overallGrowth,
      trendIndicator,
    };
  }, [data]);

  const getGrowthText = useMemo(() => {
    return (currentValue: number, previousValue?: number) =>
      calculateGrowthText(currentValue, previousValue);
  }, []);

  return {
    ...analysis,
    getGrowthText,
  };
};
