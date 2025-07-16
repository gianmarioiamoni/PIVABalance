import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  professionalFundService,
  ProfessionalFund,
  ProfessionalFundParameters,
} from "@/services/professionalFundService";

/**
 * React Query keys for professional funds
 * Centralized key management following React Query best practices
 */
export const professionalFundKeys = {
  all: ["professionalFunds"] as const,
  lists: () => [...professionalFundKeys.all, "list"] as const,
  detail: (code: string) =>
    [...professionalFundKeys.all, "detail", code] as const,
} as const;

/**
 * Hook for fetching all professional funds
 * Returns active professional funds with error handling and loading states
 */
export function useProfessionalFunds(): UseQueryResult<
  ProfessionalFund[],
  Error
> {
  return useQuery({
    queryKey: professionalFundKeys.lists(),
    queryFn: () => professionalFundService.getAllFunds(),
    staleTime: 5 * 60 * 1000, // 5 minutes - funds don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for fetching a specific professional fund by code
 */
export function useProfessionalFund(
  code: string
): UseQueryResult<ProfessionalFund, Error> {
  return useQuery({
    queryKey: professionalFundKeys.detail(code),
    queryFn: () => professionalFundService.getFundByCode(code),
    enabled: Boolean(code), // Only fetch if code is provided
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Utility hook for professional fund operations
 * Provides helper functions for common professional fund operations
 */
export function useProfessionalFundUtils() {
  /**
   * Get current parameters for a professional fund
   */
  const getCurrentParameters = (
    fund: ProfessionalFund
  ): ProfessionalFundParameters | null => {
    return professionalFundService.getCurrentParameters(fund);
  };

  /**
   * Check if manual editing is allowed for a fund
   */
  const isManualEditAllowed = (fund: ProfessionalFund): boolean => {
    return professionalFundService.isManualEditAllowed(fund);
  };

  /**
   * Find fund by code from a list of funds
   */
  const findFundByCode = (
    funds: ProfessionalFund[],
    code: string
  ): ProfessionalFund | undefined => {
    return funds.find((fund) => fund.code === code);
  };

  /**
   * Get contribution rate for a fund (current parameters)
   */
  const getContributionRate = (fund: ProfessionalFund): number | null => {
    const params = getCurrentParameters(fund);
    return params?.contributionRate ?? null;
  };

  /**
   * Get minimum contribution for a fund (current parameters)
   */
  const getMinimumContribution = (fund: ProfessionalFund): number | null => {
    const params = getCurrentParameters(fund);
    return params?.minimumContribution ?? null;
  };

  /**
   * Get fixed annual contributions for a fund (current parameters)
   */
  const getFixedAnnualContributions = (
    fund: ProfessionalFund
  ): number | null => {
    const params = getCurrentParameters(fund);
    return params?.fixedAnnualContributions ?? null;
  };

  return {
    getCurrentParameters,
    isManualEditAllowed,
    findFundByCode,
    getContributionRate,
    getMinimumContribution,
    getFixedAnnualContributions,
  };
}
