import { ProfessionalFundResponse, ApiResponse } from "@/types";

/**
 * Professional Fund Service for Next.js API routes
 * Follows SOLID principles - Single Responsibility for professional fund data operations
 */

export interface ProfessionalFundParameters {
  contributionRate: number;
  minimumContribution: number;
  fixedAnnualContributions: number;
  year: number;
}

export interface ProfessionalFund {
  id: string;
  name: string;
  code: string;
  description?: string;
  parameters: ProfessionalFundParameters[];
  isActive: boolean;
  allowManualEdit: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Professional Fund Service
 * Handles all professional fund-related API operations
 */
class ProfessionalFundService {
  private readonly baseUrl = "/api";

  /**
   * Get all active professional funds
   */
  async getAllFunds(): Promise<ProfessionalFund[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/professional-funds?active=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<ProfessionalFundResponse[]> =
        await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch professional funds");
      }

      // Transform API response to service interface
      return data.data.map(this.transformResponseToFund);
    } catch (error) {
      console.error("Error fetching professional funds:", error);
      throw new Error("Errore nel caricamento delle casse professionali");
    }
  }

  /**
   * Get professional fund by code
   */
  async getFundByCode(code: string): Promise<ProfessionalFund> {
    try {
      const response = await fetch(
        `${this.baseUrl}/professional-funds/${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Cassa professionale non trovata");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<ProfessionalFundResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch professional fund");
      }

      return this.transformResponseToFund(data.data);
    } catch (error) {
      console.error("Error fetching professional fund:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Errore nel caricamento della cassa professionale");
    }
  }

  /**
   * Get current year parameters for a professional fund
   * Follows business logic: current year first, then most recent
   */
  getCurrentParameters(
    fund: ProfessionalFund
  ): ProfessionalFundParameters | null {
    if (!fund.parameters || fund.parameters.length === 0) {
      return null;
    }

    const currentYear = new Date().getFullYear();

    // Try to find parameters for current year
    const currentYearParams = fund.parameters.find(
      (p) => p.year === currentYear
    );
    if (currentYearParams) {
      return currentYearParams;
    }

    // If not found, get the most recent parameters
    const sortedParams = [...fund.parameters].sort((a, b) => b.year - a.year);
    return sortedParams[0] || null;
  }

  /**
   * Check if fund allows manual parameter editing
   */
  isManualEditAllowed(fund: ProfessionalFund): boolean {
    return fund.allowManualEdit;
  }

  /**
   * Transform API response to service interface
   * Private utility following Single Responsibility Principle
   */
  private transformResponseToFund(
    response: ProfessionalFundResponse
  ): ProfessionalFund {
    return {
      id: response.id,
      name: response.name,
      code: response.code,
      description: response.description,
      parameters: response.parameters,
      isActive: response.isActive,
      allowManualEdit: response.allowManualEdit,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    };
  }
}

export const professionalFundService = new ProfessionalFundService();
