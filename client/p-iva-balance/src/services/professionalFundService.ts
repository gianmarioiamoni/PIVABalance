import api from './api';

export interface ProfessionalFundParameters {
  contributionRate: number;
  minimumContribution: number;
  fixedAnnualContributions: number;
  year: number;
}

export interface ProfessionalFund {
  _id: string;
  name: string;
  code: string;
  description?: string;
  parameters: ProfessionalFundParameters[];
  isActive: boolean;
  allowManualEdit: boolean;
}

class ProfessionalFundService {
  async getAllFunds(): Promise<ProfessionalFund[]> {
    try {
      const response = await api.get('/api/professional-fund');
      return response.data;
    } catch (error) {
      console.error('Error fetching professional funds:', error);
      throw error;
    }
  }

  async getFundByCode(code: string): Promise<ProfessionalFund> {
    try {
      const response = await api.get(`/api/professional-fund/${code}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching professional fund:', error);
      throw error;
    }
  }

  getCurrentParameters(fund: ProfessionalFund): ProfessionalFundParameters | null {
    const currentYear = new Date().getFullYear();
    // Find parameters for current year, or get the most recent ones
    const sortedParams = [...fund.parameters].sort((a, b) => b.year - a.year);
    return sortedParams.find(p => p.year <= currentYear) || null;
  }
}

export const professionalFundService = new ProfessionalFundService();
