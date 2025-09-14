/**
 * Utility exports
 * Centralized export point for all utility functions
 */

// Security utilities
export {
  sanitizeInput,
  escapeHtml,
  isValidEmail,
  validatePassword,
  generateSecureId,
} from "./security";

// Existing utility exports (if any)

/**
 * Calculate estimated annual taxes based on current month data and user settings
 * Projects current month performance to estimate annual tax liability
 * Uses the same logic as the detailed tax calculations page
 */
export const calculateEstimatedMonthlyTaxes = (
  monthlyRevenue: number,
  monthlyCosts: number,
  settings?: {
    taxRegime?: string;
    profitabilityRate?: number;
    substituteRate?: number;
    manualContributionRate?: number;
    manualFixedAnnualContributions?: number;
  } | null
): {
  estimatedTaxes: number;
  formattedTaxes: string;
} => {
  // Project monthly data to annual estimates
  const projectedAnnualRevenue = monthlyRevenue * 12;
  const projectedAnnualCosts = monthlyCosts * 12;
  // If no settings available, use simplified calculation on annual projection
  if (!settings) {
    const annualNetIncome = projectedAnnualRevenue - projectedAnnualCosts;
    const taxRate = 0.25; // 25% fallback rate
    const estimatedTaxes = Math.max(0, annualNetIncome * taxRate);
    return {
      estimatedTaxes,
      formattedTaxes: `€${estimatedTaxes.toLocaleString("it-IT", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`,
    };
  }

  // Calculate annual taxable income based on tax regime
  let annualTaxableIncome = 0;
  if (settings.taxRegime === "forfettario") {
    // Forfettario: apply profitability coefficient and subtract costs
    const profitabilityIncome =
      (projectedAnnualRevenue * (settings.profitabilityRate || 0)) / 100;
    annualTaxableIncome = Math.max(0, profitabilityIncome - projectedAnnualCosts);
  } else {
    // Ordinario: income minus deductible costs
    annualTaxableIncome = Math.max(0, projectedAnnualRevenue - projectedAnnualCosts);
  }

  // Calculate IRPEF/substitute tax (annual)
  const irpefAmount =
    settings.taxRegime === "forfettario"
      ? (annualTaxableIncome * (settings.substituteRate || 0)) / 100
      : annualTaxableIncome * 0.23; // Simplified IRPEF rate for ordinario

  // Calculate pension contributions (annual)
  const contributionsAmount = 
    (annualTaxableIncome * (settings.manualContributionRate || 0) / 100) + 
    (settings.manualFixedAnnualContributions || 0);

  // Calculate total taxes (annual)
  const estimatedTaxes = irpefAmount + contributionsAmount;

  return {
    estimatedTaxes,
    formattedTaxes: `€${estimatedTaxes.toLocaleString("it-IT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
  };
};
