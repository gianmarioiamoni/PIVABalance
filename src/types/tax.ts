/**
 * Tax calculation result interface
 * Provides strict typing for all calculated values
 */
export interface TaxCalculationResult {
  totalIncome: number;
  totalCosts: number;
  taxableIncome: number;
  irpefAmount: number;
  contributionsAmount: number;
  totalTaxes: number;
  effectiveRate: number;
}

/**
 * Tax regime types
 */
export type TaxRegime = 'forfettario' | 'ordinario';

/**
 * Tax calculation configuration
 */
export interface TaxCalculationConfig {
  selectedYear: number;
  taxRegime?: TaxRegime;
  profitabilityRate?: number;
  substituteRate?: number;
  manualContributionRate?: number;
  manualFixedAnnualContributions?: number;
} 