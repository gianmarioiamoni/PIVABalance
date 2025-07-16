/**
 * Core API Response Types
 * Following the same patterns as the integrated project
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

/**
 * Professional Fund Types
 */
export interface ProfessionalFundParameters {
  contributionRate: number;
  minimumContribution: number;
  fixedAnnualContributions: number;
  year: number;
}

export interface ProfessionalFundResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  parameters: ProfessionalFundParameters[];
  allowManualEdit: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User Settings Types
 */
export interface UserSettings {
  taxRegime: "forfettario" | "ordinario";
  substituteRate: number;
  profitabilityRate: number;
  pensionSystem: "INPS" | "PROFESSIONAL_FUND";
  professionalFundId?: string;
  inpsRateType?:
    | "COLLABORATOR_WITH_DISCOLL"
    | "COLLABORATOR_WITHOUT_DISCOLL"
    | "PROFESSIONAL"
    | "PENSIONER";
  manualContributionRate?: number;
  manualMinimumContribution?: number;
  manualFixedAnnualContributions?: number;
}

/**
 * Re-export existing types
 */
export * from "./Invoice";
