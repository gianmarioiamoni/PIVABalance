import { api } from './api';

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
 * Enhanced Professional Fund Service
 * 
 * Uses the unified API client for consistent authentication and error handling.
 * Integrates with Next.js API Routes and follows ApiResponse format.
 * 
 * Features:
 * - TypeScript strict typing (zero 'any')
 * - Unified API client integration
 * - JWT authentication
 * - Error handling and validation
 * - SOLID principles adherence
 */
class ProfessionalFundService {
  /**
   * Get all active professional funds
   * Uses GET /api/professional-funds?active=true endpoint
   */
  async getAllFunds(): Promise<ProfessionalFund[]> {
    try {
      const funds = await api.get<ProfessionalFund[]>('/professional-funds?active=true');
      return funds;
    } catch (error) {
      console.error('Error fetching professional funds:', error);
      throw new Error('Errore nel caricamento delle casse professionali');
    }
  }

  /**
   * Get professional fund by code
   * Uses GET /api/professional-funds/{code} endpoint
   */
  async getFundByCode(code: string): Promise<ProfessionalFund> {
    try {
      const fund = await api.get<ProfessionalFund>(`/professional-funds/${code}`);
      return fund;
    } catch (error) {
      console.error('Error fetching professional fund:', error);
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error('Cassa professionale non trovata');
      }
      throw new Error('Errore nel caricamento della cassa professionale');
    }
  }

  /**
   * Get current year parameters for a professional fund
   * Follows business logic: current year first, then most recent
   */
  getCurrentParameters(fund: ProfessionalFund): ProfessionalFundParameters | null {
    if (!fund.parameters || fund.parameters.length === 0) {
      return null;
    }

    const currentYear = new Date().getFullYear();
    
    // Try to find parameters for current year
    const currentYearParams = fund.parameters.find(p => p.year === currentYear);
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
   * Get all available years for a fund
   * Client-side utility helper
   */
  getAvailableYears(fund: ProfessionalFund): number[] {
    if (!fund.parameters || fund.parameters.length === 0) {
      return [];
    }

    return fund.parameters
      .map(p => p.year)
      .sort((a, b) => b - a); // Most recent first
  }

  /**
   * Get parameters for a specific year
   * Client-side utility helper
   */
  getParametersForYear(fund: ProfessionalFund, year: number): ProfessionalFundParameters | null {
    if (!fund.parameters || fund.parameters.length === 0) {
      return null;
    }

    return fund.parameters.find(p => p.year === year) || null;
  }

  /**
   * Calculate annual contribution
   * Client-side calculation helper
   */
  calculateAnnualContribution(
    fund: ProfessionalFund,
    taxableIncome: number,
    year?: number
  ): number {
    const params = year 
      ? this.getParametersForYear(fund, year)
      : this.getCurrentParameters(fund);
    
    if (!params) {
      return 0;
    }

    const percentageContribution = (taxableIncome * params.contributionRate) / 100;
    const totalContribution = percentageContribution + params.fixedAnnualContributions;
    
    // Apply minimum contribution if applicable
    return Math.max(totalContribution, params.minimumContribution);
  }

  /**
   * Find funds by name (fuzzy search)
   * Client-side filtering helper
   */
  searchFunds(funds: ProfessionalFund[], searchTerm: string): ProfessionalFund[] {
    if (!searchTerm.trim()) {
      return funds;
    }

    const term = searchTerm.toLowerCase();
    return funds.filter(fund =>
      fund.name.toLowerCase().includes(term) ||
      fund.code.toLowerCase().includes(term) ||
      fund.description?.toLowerCase().includes(term)
    );
  }

  /**
   * Group funds by category/type
   * Client-side grouping helper
   */
  groupFundsByCategory(funds: ProfessionalFund[]): Record<string, ProfessionalFund[]> {
    return funds.reduce((groups, fund) => {
      // Extract category from fund code or name
      let category = 'Altri';
      
      if (fund.code.includes('FORENSE') || fund.name.includes('Forense')) {
        category = 'Avvocati';
      } else if (fund.code.includes('CNPDAC') || fund.name.includes('Commercialisti')) {
        category = 'Commercialisti';
      } else if (fund.code.includes('RAGIONIERI') || fund.name.includes('Ragionieri')) {
        category = 'Ragionieri';
      } else if (fund.code.includes('GEOMETRI') || fund.name.includes('Geometri')) {
        category = 'Geometri';
      } else if (fund.code.includes('INARCASSA') || fund.name.includes('Architetti') || fund.name.includes('Ingegneri')) {
        category = 'Architetti e Ingegneri';
      } else if (fund.code.includes('ENPACL') || fund.name.includes('Consulenti')) {
        category = 'Consulenti del Lavoro';
      }

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(fund);
      return groups;
    }, {} as Record<string, ProfessionalFund[]>);
  }

  /**
   * Validate fund data
   * Client-side validation helper
   */
  validateFund(fund: Partial<ProfessionalFund>): string[] {
    const errors: string[] = [];

    if (!fund.name || fund.name.trim().length === 0) {
      errors.push('Nome cassa professionale richiesto');
    }

    if (!fund.code || fund.code.trim().length === 0) {
      errors.push('Codice cassa professionale richiesto');
    }

    if (fund.parameters && fund.parameters.length === 0) {
      errors.push('Almeno un set di parametri è richiesto');
    }

    if (fund.parameters) {
      fund.parameters.forEach((param, index) => {
        if (param.contributionRate < 0 || param.contributionRate > 100) {
          errors.push(`Aliquota contributiva non valida per parametro ${index + 1}`);
        }
        if (param.minimumContribution < 0) {
          errors.push(`Contributo minimo non valido per parametro ${index + 1}`);
        }
        if (param.fixedAnnualContributions < 0) {
          errors.push(`Contributi fissi annui non validi per parametro ${index + 1}`);
        }
        if (param.year < 2000 || param.year > 2100) {
          errors.push(`Anno non valido per parametro ${index + 1}`);
        }
      });
    }

    return errors;
  }
}

export const professionalFundService = new ProfessionalFundService();
