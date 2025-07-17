import { Cost } from "@/models/Cost";
import { ICost } from "@/types";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterCostsByYear,
  calculateTotalCosts,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortCostsByDate,
} from "./costCalculations";

/**
 * Pure functions for cost database queries
 * Replaces static methods with functional approach
 */

/**
 * Find costs by user ID and year
 */
export const findCostsByUserAndYear = async (
  userId: string,
  year: number
): Promise<ICost[]> => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const costs = await Cost.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .sort({ date: -1 })
    .lean();

  return costs;
};

/**
 * Find costs by user ID
 */
export const findCostsByUserId = async (userId: string): Promise<ICost[]> => {
  const costs = await Cost.find({ userId }).sort({ date: -1 }).lean();

  return costs;
};

/**
 * Calculate total costs for user and year
 */
export const getTotalCostsByUserAndYear = async (
  userId: string,
  year: number
): Promise<{ total: number; count: number }> => {
  const costs = await findCostsByUserAndYear(userId, year);

  return {
    total: calculateTotalCosts(costs),
    count: costs.length,
  };
};

/**
 * Find costs by user within date range
 */
export const findCostsByUserAndDateRange = async (
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<ICost[]> => {
  const costs = await Cost.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .sort({ date: -1 })
    .lean();

  return costs;
};

/**
 * Get cost statistics for user and year
 */
export const getCostStatsByUserAndYear = async (
  userId: string,
  year: number
): Promise<{
  total: number;
  count: number;
  average: number;
  min: number;
  max: number;
}> => {
  const result = await Cost.aggregate([
    {
      $match: {
        userId,
        date: {
          $gte: new Date(year, 0, 1),
          $lte: new Date(year, 11, 31, 23, 59, 59, 999),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        average: { $avg: "$amount" },
        min: { $min: "$amount" },
        max: { $max: "$amount" },
      },
    },
  ]);

  return (
    result[0] || {
      total: 0,
      count: 0,
      average: 0,
      min: 0,
      max: 0,
    }
  );
};
