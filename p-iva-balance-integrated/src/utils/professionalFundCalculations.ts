import { IProfessionalFund, ProfessionalFundParameter } from "@/types";

/**
 * Pure functions for professional fund calculations
 * Follows functional programming principles
 */

/**
 * Get current year parameters for a professional fund
 */
export const getCurrentYearParameters = (
  fund: IProfessionalFund
): ProfessionalFundParameter | undefined => {
  const currentYear = new Date().getFullYear();

  // Try to find parameters for current year
  const currentYearParams = fund.parameters.find((p) => p.year === currentYear);

  if (currentYearParams) {
    return currentYearParams;
  }

  // If not found, return latest year parameters
  const sortedParams = [...fund.parameters].sort((a, b) => b.year - a.year);
  return sortedParams[0];
};

/**
 * Get parameters for a specific year
 */
export const getParametersForYear = (
  fund: IProfessionalFund,
  year: number
): ProfessionalFundParameter | undefined => {
  return fund.parameters.find((p) => p.year === year);
};

/**
 * Calculate contribution amount based on income and fund parameters
 */
export const calculateContribution = (
  fund: IProfessionalFund,
  income: number,
  year?: number
): {
  contributionAmount: number;
  isMinimumApplied: boolean;
  fixedContributions: number;
  totalContribution: number;
} => {
  const params = year
    ? getParametersForYear(fund, year)
    : getCurrentYearParameters(fund);

  if (!params) {
    return {
      contributionAmount: 0,
      isMinimumApplied: false,
      fixedContributions: 0,
      totalContribution: 0,
    };
  }

  const calculatedContribution = (income * params.contributionRate) / 100;
  const isMinimumApplied = calculatedContribution < params.minimumContribution;
  const contributionAmount = Math.max(
    calculatedContribution,
    params.minimumContribution
  );

  return {
    contributionAmount,
    isMinimumApplied,
    fixedContributions: params.fixedAnnualContributions,
    totalContribution: contributionAmount + params.fixedAnnualContributions,
  };
};

/**
 * Check if fund is active
 */
export const isFundActive = (fund: IProfessionalFund): boolean => {
  return fund.isActive;
};

/**
 * Check if fund allows manual editing
 */
export const allowsManualEdit = (fund: IProfessionalFund): boolean => {
  return fund.allowManualEdit;
};

/**
 * Filter active funds from a list
 */
export const filterActiveFunds = (
  funds: IProfessionalFund[]
): IProfessionalFund[] => {
  return funds.filter((fund) => fund.isActive);
};

/**
 * Filter funds by year (having parameters for specific year)
 */
export const filterFundsByYear = (
  funds: IProfessionalFund[],
  year: number
): IProfessionalFund[] => {
  return funds.filter(
    (fund) => fund.isActive && fund.parameters.some((p) => p.year === year)
  );
};

/**
 * Sort funds by name
 */
export const sortFundsByName = (
  funds: IProfessionalFund[]
): IProfessionalFund[] => {
  return [...funds].sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Find fund by code (case-insensitive)
 */
export const findFundByCode = (
  funds: IProfessionalFund[],
  code: string
): IProfessionalFund | undefined => {
  return funds.find((fund) => fund.code.toUpperCase() === code.toUpperCase());
};

/**
 * Validate fund parameters for consistency
 */
export const validateFundParameters = (
  fund: IProfessionalFund
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!fund.parameters || fund.parameters.length === 0) {
    errors.push("Fund must have at least one set of parameters");
  }

  // Check for duplicate years
  const years = fund.parameters.map((p) => p.year);
  const uniqueYears = new Set(years);
  if (years.length !== uniqueYears.size) {
    errors.push("Parameters cannot have duplicate years");
  }

  // Validate each parameter set
  fund.parameters.forEach((param, index) => {
    if (param.contributionRate < 0 || param.contributionRate > 100) {
      errors.push(
        `Parameter ${index + 1}: Contribution rate must be between 0 and 100`
      );
    }
    if (param.minimumContribution < 0) {
      errors.push(
        `Parameter ${index + 1}: Minimum contribution cannot be negative`
      );
    }
    if (param.fixedAnnualContributions < 0) {
      errors.push(
        `Parameter ${index + 1}: Fixed annual contributions cannot be negative`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Clean fund object for JSON output (removes internal fields)
 */
export const cleanFundForJSON = (
  fund: IProfessionalFund
): Omit<IProfessionalFund, "__v"> => {
  const { __v, ...cleanFund } = fund as IProfessionalFund & { __v?: unknown };
  return cleanFund;
};
