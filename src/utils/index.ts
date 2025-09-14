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
 * Calculate estimated monthly taxes based on income, costs and user settings
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
  // If no settings available, use simplified calculation
  if (!settings) {
    const netIncome = monthlyRevenue - monthlyCosts;
    const taxRate = 0.25; // 25% fallback rate
    const estimatedTaxes = Math.max(0, netIncome * taxRate);
    return {
      estimatedTaxes,
      formattedTaxes: `€${estimatedTaxes.toLocaleString("it-IT", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`,
    };
  }

  // Calculate taxable income based on tax regime
  let taxableIncome = 0;
  if (settings.taxRegime === "forfettario") {
    // Forfettario: apply profitability coefficient and subtract costs
    const profitabilityIncome =
      (monthlyRevenue * (settings.profitabilityRate || 0)) / 100;
    taxableIncome = Math.max(0, profitabilityIncome - monthlyCosts);
  } else {
    // Ordinario: income minus deductible costs
    taxableIncome = Math.max(0, monthlyRevenue - monthlyCosts);
  }

  // Calculate IRPEF/substitute tax
  const irpefAmount =
    settings.taxRegime === "forfettario"
      ? (taxableIncome * (settings.substituteRate || 0)) / 100
      : taxableIncome * 0.23; // Simplified IRPEF rate for ordinario

  // Calculate pension contributions (monthly portion)
  const monthlyContributionRate = (settings.manualContributionRate || 0) / 12;
  const monthlyFixedContributions = (settings.manualFixedAnnualContributions || 0) / 12;
  const contributionsAmount = 
    (taxableIncome * monthlyContributionRate / 100) + monthlyFixedContributions;

  // Calculate total taxes
  const estimatedTaxes = irpefAmount + contributionsAmount;

  return {
    estimatedTaxes,
    formattedTaxes: `€${estimatedTaxes.toLocaleString("it-IT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
  };
};
