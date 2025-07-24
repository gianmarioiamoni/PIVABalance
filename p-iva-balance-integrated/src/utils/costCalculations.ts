import { ICost } from "@/types";

// Generic cost interface for calculations (works with both ICost and Cost from service)
type CostForCalculation = {
  amount: number;
  date: Date;
  description?: string;
  deductible?: boolean; // Optional for compatibility with ICost
  userId?: string; // Optional for compatibility with both types
};

/**
 * Pure functions for cost calculations and formatting
 * Follows functional programming principles
 */

/**
 * Format cost amount with Euro symbol
 */
export const formatCostAmount = (cost: CostForCalculation): string => {
  return `€${cost.amount.toFixed(2)}`;
};

/**
 * Format cost date in Italian format
 */
export const formatCostDate = (cost: ICost): string => {
  return cost.date.toLocaleDateString("it-IT");
};

/**
 * Calculate total amount from a list of costs
 */
export const calculateTotalCosts = (costs: CostForCalculation[]): number => {
  return costs.reduce((total, cost) => total + cost.amount, 0);
};

/**
 * Filter costs by year
 */
export const filterCostsByYear = (
  costs: CostForCalculation[],
  year: number
): CostForCalculation[] => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  return costs.filter((cost) => {
    const costDate = new Date(cost.date);
    return costDate >= startDate && costDate <= endDate;
  });
};

/**
 * Filter costs by user ID
 */
export const filterCostsByUserId = (
  costs: CostForCalculation[],
  userId: string
): CostForCalculation[] => {
  return costs.filter((cost) => cost.userId === userId);
};

/**
 * Sort costs by date (default: newest first)
 */
export const sortCostsByDate = (
  costs: CostForCalculation[],
  ascending = false
): CostForCalculation[] => {
  return [...costs].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Filter costs by date range
 */
export const filterCostsByDateRange = (
  costs: CostForCalculation[],
  startDate: Date,
  endDate: Date
): CostForCalculation[] => {
  return costs.filter((cost) => {
    const costDate = new Date(cost.date);
    return costDate >= startDate && costDate <= endDate;
  });
};

/**
 * Get cost statistics for a list of costs
 */
export const getCostStatistics = (costs: CostForCalculation[]) => {
  if (costs.length === 0) {
    return {
      total: 0,
      count: 0,
      average: 0,
      min: 0,
      max: 0,
    };
  }

  const amounts = costs.map((cost) => cost.amount);
  const total = amounts.reduce((sum, amount) => sum + amount, 0);

  return {
    total,
    count: costs.length,
    average: total / costs.length,
    min: Math.min(...amounts),
    max: Math.max(...amounts),
  };
};

/**
 * Clean cost object for JSON output (removes internal fields)
 */
export const cleanCostForJSON = (cost: ICost): Omit<ICost, "__v"> => {
  const { __v: _v, ...cleanCost } = cost as ICost & { __v?: unknown };
  return cleanCost;
};

/**
 * Filter costs by month and year
 */
export const filterCostsByMonth = (
  costs: CostForCalculation[],
  month: number,
  year: number
): CostForCalculation[] => {
  return costs.filter((cost) => {
    const costDate = new Date(cost.date);
    return (
      costDate.getMonth() === month - 1 && // JavaScript months are 0-indexed
      costDate.getFullYear() === year
    );
  });
};

/**
 * Calculate monthly statistics from costs
 */
export const calculateMonthlyCostStats = (
  costs: CostForCalculation[],
  month: number,
  year: number
): {
  count: number;
  total: number;
  formattedTotal: string;
} => {
  const monthlyCosts = filterCostsByMonth(costs, month, year);
  const total = calculateTotalCosts(monthlyCosts);

  return {
    count: monthlyCosts.length,
    total,
    formattedTotal: `€${total.toLocaleString("it-IT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
  };
};

/**
 * Get current month statistics from costs
 */
export const getCurrentMonthCostStats = (
  costs: CostForCalculation[]
): {
  count: number;
  total: number;
  formattedTotal: string;
} => {
  const now = new Date();
  return calculateMonthlyCostStats(
    costs,
    now.getMonth() + 1,
    now.getFullYear()
  );
};
