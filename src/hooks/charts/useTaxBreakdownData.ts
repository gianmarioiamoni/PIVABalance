/**
 * useTaxBreakdownData Hook
 *
 * Single Responsibility: Process tax breakdown data for visualization
 * Separates complex data transformation from component
 */

import { useMemo } from "react";
import type { TaxBreakdownDataPoint } from "@/components/charts/types";
import {
  calculateTaxTotal,
  calculateTaxPercentages,
  addTaxColors,
  prepareTaxLegendData,
  formatTaxPercentage,
} from "@/utils/chartUtils";

export interface UseTaxBreakdownDataProps {
  data: TaxBreakdownDataPoint[];
  defaultColors: string[];
  showValues?: boolean;
  showPercentages?: boolean;
}

export interface UseTaxBreakdownDataReturn {
  total: number;
  chartData: (TaxBreakdownDataPoint & { percentage: number; color: string })[];
  legendItems: Array<{
    color: string;
    label: string;
    value?: string;
  }>;
  formatPercentage: (value: number | string) => string;
}

/**
 * Hook for tax breakdown data processing
 * Handles all data transformations needed for the chart
 */
export const useTaxBreakdownData = ({
  data,
  defaultColors,
  showValues = true,
  showPercentages = true,
}: UseTaxBreakdownDataProps): UseTaxBreakdownDataReturn => {
  const processedData = useMemo(() => {
    // Calculate total
    const total = calculateTaxTotal(data);

    // Add percentages
    const dataWithPercentages = calculateTaxPercentages(data, total);

    // Add colors
    const chartData = addTaxColors(dataWithPercentages, defaultColors);

    // Prepare legend
    const legendItems = prepareTaxLegendData(
      chartData,
      showValues,
      showPercentages
    );

    return {
      total,
      chartData,
      legendItems,
    };
  }, [data, defaultColors, showValues, showPercentages]);

  const formatPercentage = useMemo(() => {
    return (value: number | string) =>
      formatTaxPercentage(value, processedData.total);
  }, [processedData.total]);

  return {
    ...processedData,
    formatPercentage,
  };
};
