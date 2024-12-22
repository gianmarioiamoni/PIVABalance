import { ProfessionalFund } from '../models/ProfessionalFund';

interface DefaultFundData {
  name: string;
  code: string;
  description: string;
  parameters: {
    contributionRate: number;
    minimumContribution: number;
  };
}

const DEFAULT_FUNDS: DefaultFundData[] = [
  {
    name: 'Cassa Forense',
    code: 'FORENSE',
    description: 'Cassa Nazionale di Previdenza e Assistenza Forense',
    parameters: {
      contributionRate: 16,
      minimumContribution: 2750
    }
  }
  // Add other professional funds here as needed
];

export class ProfessionalFundService {
  static async initializeDefaultFunds(): Promise<void> {
    try {
      const currentYear = new Date().getFullYear();

      for (const fundData of DEFAULT_FUNDS) {
        const existingFund = await ProfessionalFund.findOne({ code: fundData.code });
        
        if (!existingFund) {
          await ProfessionalFund.create({
            ...fundData,
            parameters: [{
              ...fundData.parameters,
              year: currentYear
            }],
            isActive: true
          });
          console.log(`Initialized ${fundData.name}`);
        } else {
          // Check if we need to add parameters for the current year
          const hasCurrentYearParams = existingFund.parameters.some(p => p.year === currentYear);
          
          if (!hasCurrentYearParams) {
            existingFund.parameters.push({
              ...fundData.parameters,
              year: currentYear
            });
            await existingFund.save();
            console.log(`Updated parameters for ${fundData.name} for year ${currentYear}`);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing professional funds:', error);
      throw error;
    }
  }

  static async getFundByCode(code: string) {
    return ProfessionalFund.findOne({ code, isActive: true });
  }

  static async getAllFunds() {
    return ProfessionalFund.find({ isActive: true });
  }

  static async updateFundParameters(code: string, parameters: any) {
    const fund = await ProfessionalFund.findOne({ code });
    if (!fund) {
      throw new Error('Fund not found');
    }

    const currentYear = new Date().getFullYear();
    const paramIndex = fund.parameters.findIndex(p => p.year === currentYear);

    if (paramIndex >= 0) {
      fund.parameters[paramIndex] = { ...parameters, year: currentYear };
    } else {
      fund.parameters.push({ ...parameters, year: currentYear });
    }

    return fund.save();
  }
}
