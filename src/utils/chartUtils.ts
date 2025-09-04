/**
 * Chart Utilities
 *
 * Pure functions for chart business logic
 * Following SOLID principles - extracted from components
 */

import type {
  CashFlowDataPoint,
  TrendDataPoint,
  TaxBreakdownDataPoint,
} from "@/components/charts/types";

// =============================================================================
// CASH FLOW UTILITIES
// =============================================================================

/**
 * Transform cash flow data for display
 * Ensures expenses are positive for visual consistency
 */
export const transformCashFlowData = (
  data: CashFlowDataPoint[]
): CashFlowDataPoint[] => {
  return data.map((point) => ({
    ...point,
    month: point.month,
    income: point.income,
    expenses: Math.abs(point.expenses), // Make sure expenses are positive for display
    net: point.net,
  }));
};

/**
 * Get color for net cash flow
 * Green for positive, red for negative
 */
export const getNetCashFlowColor = (netValue: number): string => {
  return netValue >= 0 ? "#10B981" : "#EF4444";
};

// =============================================================================
// TREND ANALYSIS UTILITIES
// =============================================================================

/**
 * Calculate average value from trend data
 */
export const calculateTrendAverage = (data: TrendDataPoint[]): number => {
  if (data.length === 0) return 0;
  return data.reduce((sum, point) => sum + point.value, 0) / data.length;
};

/**
 * Calculate overall growth percentage
 */
export const calculateOverallGrowth = (data: TrendDataPoint[]): number => {
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  return firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
};

/**
 * Get trend indicator based on growth percentage
 */
export const getTrendIndicator = (growth: number) => {
  if (growth > 5) {
    return {
      type: "up" as const,
      color: "text-green-600",
      text: `+${growth.toFixed(1)}%`,
    };
  } else if (growth < -5) {
    return {
      type: "down" as const,
      color: "text-red-600",
      text: `${growth.toFixed(1)}%`,
    };
  } else {
    return {
      type: "stable" as const,
      color: "text-gray-600",
      text: "Stabile",
    };
  }
};

/**
 * Calculate growth text for tooltip
 */
export const calculateGrowthText = (
  currentValue: number,
  previousValue?: number
): string => {
  if (!previousValue) return "";

  const growth = ((currentValue - previousValue) / previousValue) * 100;
  const growthSign = growth >= 0 ? "+" : "";
  return ` (${growthSign}${growth.toFixed(1)}%)`;
};

// =============================================================================
// TAX BREAKDOWN UTILITIES
// =============================================================================

/**
 * Calculate total amount from tax breakdown data
 */
export const calculateTaxTotal = (data: TaxBreakdownDataPoint[]): number => {
  return data.reduce((sum, item) => sum + item.amount, 0);
};

/**
 * Calculate percentage for each tax item
 */
export const calculateTaxPercentages = (
  data: TaxBreakdownDataPoint[],
  total: number
): (TaxBreakdownDataPoint & { percentage: number })[] => {
  return data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.amount / total) * 100 : 0,
  }));
};

/**
 * Add colors to tax breakdown data
 */
export const addTaxColors = (
  data: (TaxBreakdownDataPoint & { percentage: number })[],
  defaultColors: string[]
): (TaxBreakdownDataPoint & { percentage: number; color: string })[] => {
  return data.map((item, index) => ({
    ...item,
    color:
      item.color || defaultColors[index % defaultColors.length] || "#6B7280",
  }));
};

/**
 * Should show label for pie slice
 * Don't show labels for slices smaller than 5%
 */
export const shouldShowPieLabel = (percentage: number): boolean => {
  return percentage >= 5;
};

/**
 * Calculate pie label position
 */
export const calculatePieLabelPosition = (
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number
): { x: number; y: number } => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return { x, y };
};

/**
 * Format tax percentage for display
 */
export const formatTaxPercentage = (
  value: number | string,
  total: number
): string => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  return total > 0 ? ((numericValue / total) * 100).toFixed(1) : "0";
};

/**
 * Prepare legend data for tax breakdown
 */
export const prepareTaxLegendData = (
  data: (TaxBreakdownDataPoint & { percentage: number; color: string })[],
  showValues: boolean,
  showPercentages: boolean
) => {
  return data.map((item) => ({
    color: item.color,
    label: item.category,
    value: showValues
      ? `€${item.amount.toLocaleString("it-IT")} ${
          showPercentages ? `(${item.percentage.toFixed(1)}%)` : ""
        }`
      : showPercentages
      ? `${item.percentage.toFixed(1)}%`
      : undefined,
  }));
};

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Format currency for Y-axis
 */
export const formatCurrencyCompact = (value: number): string => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
  }).format(value);
};

/**
 * Format currency for display
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};
