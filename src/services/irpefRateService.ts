import api from "./api";

export interface IrpefRate {
  _id: string;
  rate: number;
  lowerBound: number;
  upperBound?: number;
  year: number;
  isActive: boolean;
}

class IrpefRateService {
  async getCurrentRates(): Promise<IrpefRate[]> {
    try {
      const response = await api.get<IrpefRate[]>("/api/irpef-rates");
      return response;
    } catch (error) {
      console.error("Error fetching IRPEF rates:", error);
      throw error;
    }
  }

  async getRatesByYear(year: number): Promise<IrpefRate[]> {
    try {
      const response = await api.get<IrpefRate[]>(`/api/irpef-rates/${year}`);
      return response;
    } catch (error) {
      console.error("Error fetching IRPEF rates:", error);
      throw error;
    }
  }

  calculateTax(
    income: number,
    rates: IrpefRate[]
  ): {
    totalTax: number;
    brackets: Array<{
      rate: number;
      taxableAmount: number;
      tax: number;
    }>;
  } {
    // Ordina le aliquote per limite inferiore
    const sortedRates = [...rates].sort((a, b) => a.lowerBound - b.lowerBound);
    let remainingIncome = income;
    let totalTax = 0;
    const brackets = [];

    for (let i = 0; i < sortedRates.length; i++) {
      const rate = sortedRates[i];
      const upperLimit = rate.upperBound ?? Infinity;
      const bracketSize = Math.min(
        upperLimit - rate.lowerBound,
        Math.max(0, remainingIncome)
      );

      if (bracketSize > 0) {
        const bracketTax = (bracketSize * rate.rate) / 100;
        totalTax += bracketTax;
        brackets.push({
          rate: rate.rate,
          taxableAmount: bracketSize,
          tax: bracketTax,
        });
        remainingIncome -= bracketSize;
      }

      if (remainingIncome <= 0) break;
    }

    return {
      totalTax,
      brackets,
    };
  }
}

export const irpefRateService = new IrpefRateService();
