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
 * Calculate estimated monthly taxes based on income and costs
 * Simplified calculation for dashboard display
 */
export const calculateEstimatedMonthlyTaxes = (
  monthlyRevenue: number,
  monthlyCosts: number
): {
  estimatedTaxes: number;
  formattedTaxes: string;
} => {
  const netIncome = monthlyRevenue - monthlyCosts;

  // Simplified tax calculation (approximately 25% for professional activities)
  // This is a rough estimate - actual calculation would require tax settings
  const taxRate = 0.25; // 25%
  const estimatedTaxes = Math.max(0, netIncome * taxRate);

  return {
    estimatedTaxes,
    formattedTaxes: `€${estimatedTaxes.toLocaleString("it-IT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
  };
};
