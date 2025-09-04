import { ProfessionalFund } from "@/models/ProfessionalFund";
import { IProfessionalFund, ProfessionalFundQuery } from "@/types";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterActiveFunds,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterFundsByYear,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortFundsByName,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getParametersForYear,
} from "./professionalFundCalculations";

/**
 * Pure functions for professional fund database queries
 * Replaces static methods with functional approach
 */

/**
 * Find all active professional funds
 */
export const findActiveFunds = async (): Promise<IProfessionalFund[]> => {
  const funds = await ProfessionalFund.find({ isActive: true })
    .sort({ name: 1 })
    .lean();

  return funds;
};

/**
 * Find professional fund by code
 */
export const findFundByCode = async (
  code: string
): Promise<IProfessionalFund | null> => {
  const fund = await ProfessionalFund.findOne({
    code: code.toUpperCase(),
  }).lean();

  return fund;
};

/**
 * Find funds with parameters for a specific year
 */
export const findFundsByYear = async (
  year: number
): Promise<IProfessionalFund[]> => {
  const funds = await ProfessionalFund.find({
    "parameters.year": year,
    isActive: true,
  })
    .sort({ name: 1 })
    .lean();

  return funds;
};

/**
 * Get fund parameters for a specific year
 */
export const getFundParametersForYear = async (
  fundId: string,
  year: number
): Promise<IProfessionalFund | null> => {
  const fund = await ProfessionalFund.findById(fundId, {
    parameters: { $elemMatch: { year } },
  }).lean();

  return fund;
};

/**
 * Find all professional funds (including inactive)
 */
export const findAllFunds = async (): Promise<IProfessionalFund[]> => {
  const funds = await ProfessionalFund.find().sort({ name: 1 }).lean();

  return funds;
};

/**
 * Find funds by name (partial match, case-insensitive)
 */
export const findFundsByName = async (
  nameQuery: string
): Promise<IProfessionalFund[]> => {
  const funds = await ProfessionalFund.find({
    name: { $regex: nameQuery, $options: "i" },
    isActive: true,
  })
    .sort({ name: 1 })
    .lean();

  return funds;
};

/**
 * Check if fund code exists
 */
export const fundCodeExists = async (
  code: string,
  excludeId?: string
): Promise<boolean> => {
  const query: ProfessionalFundQuery = { code: code.toUpperCase() };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const fund = await ProfessionalFund.findOne(query).lean();
  return !!fund;
};

/**
 * Get funds count by status
 */
export const getFundsCount = async (): Promise<{
  total: number;
  active: number;
  inactive: number;
}> => {
  const result = await ProfessionalFund.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
        inactive: {
          $sum: { $cond: [{ $eq: ["$isActive", false] }, 1, 0] },
        },
      },
    },
  ]);

  return result[0] || { total: 0, active: 0, inactive: 0 };
};
