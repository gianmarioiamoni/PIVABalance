import { Cost } from "@/services/costService";

/**
 * Pure functions for cost summary calculations
 * Following functional programming principles - no side effects
 */

/**
 * Calculate total amount of all costs
 */
export const calculateTotalCosts = (costs: Cost[]): number => {
  return costs.reduce((sum, cost) => sum + cost.amount, 0);
};

/**
 * Calculate total amount of deductible costs
 */
export const calculateDeductibleCosts = (costs: Cost[]): number => {
  return costs
    .filter((cost) => cost.deductible)
    .reduce((sum, cost) => sum + cost.amount, 0);
};

/**
 * Calculate total amount of non-deductible costs
 */
export const calculateNonDeductibleCosts = (costs: Cost[]): number => {
  return costs
    .filter((cost) => !cost.deductible)
    .reduce((sum, cost) => sum + cost.amount, 0);
};

/**
 * Count deductible costs
 */
export const countDeductibleCosts = (costs: Cost[]): number => {
  return costs.filter((cost) => cost.deductible).length;
};

/**
 * Count non-deductible costs
 */
export const countNonDeductibleCosts = (costs: Cost[]): number => {
  return costs.filter((cost) => !cost.deductible).length;
};

/**
 * Generate available years starting from current year (descending)
 */
export const generateAvailableYears = (numberOfYears: number = 5): number[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: numberOfYears }, (_, i) => currentYear - i);
};

/**
 * Generate available years starting from a specific year (ascending, then reversed)
 */
export const generateAvailableYearsFromYear = (startYear: number): number[] => {
  const currentYear = new Date().getFullYear();
  const numberOfYears = currentYear - startYear + 1;
  return Array.from(
    { length: numberOfYears },
    (_, i) => startYear + i
  ).reverse(); // Most recent first
};

/**
 * Calculate all cost summaries at once
 * Returns all calculated values in a single object
 */
export interface CostSummary {
  totalCosts: number;
  deductibleCosts: number;
  nonDeductibleCosts: number;
  deductibleCount: number;
  nonDeductibleCount: number;
  totalCount: number;
}

export const calculateCostSummary = (costs: Cost[]): CostSummary => {
  const totalCosts = calculateTotalCosts(costs);
  const deductibleCosts = calculateDeductibleCosts(costs);
  const nonDeductibleCosts = calculateNonDeductibleCosts(costs);
  const deductibleCount = countDeductibleCosts(costs);
  const nonDeductibleCount = countNonDeductibleCosts(costs);

  return {
    totalCosts,
    deductibleCosts,
    nonDeductibleCosts,
    deductibleCount,
    nonDeductibleCount,
    totalCount: costs.length,
  };
};
