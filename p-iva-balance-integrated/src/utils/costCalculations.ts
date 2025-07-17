import { ICost } from "@/types";

/**
 * Pure functions for cost calculations and formatting
 * Follows functional programming principles
 */

/**
 * Format cost amount with Euro symbol
 */
export const formatCostAmount = (cost: ICost): string => {
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
export const calculateTotalCosts = (costs: ICost[]): number => {
  return costs.reduce((total, cost) => total + cost.amount, 0);
};

/**
 * Filter costs by year
 */
export const filterCostsByYear = (costs: ICost[], year: number): ICost[] => {
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
  costs: ICost[],
  userId: string
): ICost[] => {
  return costs.filter((cost) => cost.userId === userId);
};

/**
 * Sort costs by date (default: newest first)
 */
export const sortCostsByDate = (costs: ICost[], ascending = false): ICost[] => {
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
  costs: ICost[],
  startDate: Date,
  endDate: Date
): ICost[] => {
  return costs.filter((cost) => {
    const costDate = new Date(cost.date);
    return costDate >= startDate && costDate <= endDate;
  });
};

/**
 * Get cost statistics for a list of costs
 */
export const getCostStatistics = (costs: ICost[]) => {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v: _v, ...cleanCost } = cost as ICost & { __v?: unknown };
  return cleanCost;
};
