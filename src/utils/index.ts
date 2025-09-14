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
 * Calculate taxes based on year-to-date data and user settings
 * Uses actual accumulated data instead of projections for more accuracy
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
  // Use actual monthly data as-is (no projection)
  const actualRevenue = monthlyRevenue;
  const actualCosts = monthlyCosts;
  // If no settings available, use simplified calculation
  if (!settings) {
    const netIncome = actualRevenue - actualCosts;
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

  // Calculate taxable income based on tax regime using actual data
  let taxableIncome = 0;
  if (settings.taxRegime === "forfettario") {
    // Forfettario: apply profitability coefficient and subtract costs
    const profitabilityIncome =
      (actualRevenue * (settings.profitabilityRate || 0)) / 100;
    taxableIncome = Math.max(0, profitabilityIncome - actualCosts);
  } else {
    // Ordinario: income minus deductible costs
    taxableIncome = Math.max(0, actualRevenue - actualCosts);
  }

  // Calculate IRPEF/substitute tax
  const irpefAmount =
    settings.taxRegime === "forfettario"
      ? (taxableIncome * (settings.substituteRate || 0)) / 100
      : taxableIncome * 0.23; // Simplified IRPEF rate for ordinario

  // Calculate pension contributions
  const contributionsAmount = 
    (taxableIncome * (settings.manualContributionRate || 0) / 100) + 
    (settings.manualFixedAnnualContributions || 0);

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
