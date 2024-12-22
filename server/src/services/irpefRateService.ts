import { IrpefRate } from '../models/IrpefRate';

interface DefaultIrpefRate {
  rate: number;
  lowerBound: number;
  upperBound?: number;
}

const DEFAULT_RATES: DefaultIrpefRate[] = [
  {
    rate: 23,
    lowerBound: 0,
    upperBound: 28000
  },
  {
    rate: 35,
    lowerBound: 28000,
    upperBound: 50000
  },
  {
    rate: 43,
    lowerBound: 50000
  }
];

export class IrpefRateService {
  static async initializeDefaultRates(): Promise<void> {
    try {
      const currentYear = new Date().getFullYear();
      
      // Verifica se esistono già aliquote per l'anno corrente
      const existingRates = await IrpefRate.find({ 
        year: currentYear,
        isActive: true
      });

      if (existingRates.length === 0) {
        // Crea le aliquote di default per l'anno corrente
        const ratePromises = DEFAULT_RATES.map(rate => 
          IrpefRate.create({
            ...rate,
            year: currentYear,
            isActive: true
          })
        );

        await Promise.all(ratePromises);
        console.log(`Initialized IRPEF rates for year ${currentYear}`);
      }
    } catch (error) {
      console.error('Error initializing IRPEF rates:', error);
      throw error;
    }
  }

  static async getCurrentRates() {
    const currentYear = new Date().getFullYear();
    return IrpefRate.find({ 
      year: currentYear,
      isActive: true 
    }).sort({ lowerBound: 1 });
  }

  static async getRatesByYear(year: number) {
    return IrpefRate.find({ 
      year,
      isActive: true 
    }).sort({ lowerBound: 1 });
  }

  static async updateRate(id: string, updates: Partial<DefaultIrpefRate>) {
    const rate = await IrpefRate.findById(id);
    if (!rate) {
      throw new Error('Rate not found');
    }

    Object.assign(rate, updates);
    return rate.save();
  }

  static async deactivateRate(id: string) {
    const rate = await IrpefRate.findById(id);
    if (!rate) {
      throw new Error('Rate not found');
    }

    rate.isActive = false;
    return rate.save();
  }
}
