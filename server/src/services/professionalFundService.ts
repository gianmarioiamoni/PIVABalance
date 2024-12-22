import { ProfessionalFund } from '../models/ProfessionalFund';
import { UserSettings } from '../models/UserSettings';

interface DefaultFundData {
  name: string;
  code: string;
  description: string;
  parameters: {
    contributionRate: number;
    minimumContribution: number;
    fixedAnnualContributions: number;
  };
}

const DEFAULT_FUNDS: DefaultFundData[] = [
  {
    name: 'Cassa Forense',
    code: 'FORENSE',
    description: 'Cassa Nazionale di Previdenza e Assistenza Forense',
    parameters: {
      contributionRate: 15,
      minimumContribution: 2750,
      fixedAnnualContributions: 0
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
              contributionRate: fundData.parameters.contributionRate,
              minimumContribution: fundData.parameters.minimumContribution,
              fixedAnnualContributions: fundData.parameters.fixedAnnualContributions,
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

  static async getFundByCode(code: string, userId?: string) {
    const fund = await ProfessionalFund.findOne({ code, isActive: true });
    
    if (!fund || !userId) {
      return fund;
    }

    // Get user settings to check for manual overrides
    const userSettings = await UserSettings.findOne({ 
      userId,
      professionalFundId: code,
      pensionSystem: 'PROFESSIONAL_FUND'
    });

    if (userSettings?.manualContributionRate !== undefined || 
        userSettings?.manualMinimumContribution !== undefined ||
        userSettings?.manualFixedAnnualContributions !== undefined) {
      const currentYear = new Date().getFullYear();
      const currentParams = fund.parameters.find(p => p.year === currentYear);
      
      if (currentParams) {
        // Create a new fund object to avoid modifying the database document
        const fundCopy = fund.toObject();
        const paramIndex = fundCopy.parameters.findIndex(p => p.year === currentYear);
        
        if (paramIndex !== -1) {
          fundCopy.parameters[paramIndex] = {
            ...fundCopy.parameters[paramIndex],
            contributionRate: userSettings.manualContributionRate ?? fundCopy.parameters[paramIndex].contributionRate,
            minimumContribution: userSettings.manualMinimumContribution ?? fundCopy.parameters[paramIndex].minimumContribution,
            fixedAnnualContributions: userSettings.manualFixedAnnualContributions ?? fundCopy.parameters[paramIndex].fixedAnnualContributions,
            year: currentYear
          };
        }
        
        return fundCopy;
      }
    }

    return fund;
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
