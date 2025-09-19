import { useState, useMemo, useCallback } from "react";
import { useTaxSettings } from "@/hooks/useTaxSettings";
import { useInvoices } from "@/hooks/invoices/useInvoices";
import { useCosts } from "@/hooks/costs/useCosts";
import { taxCalculationService } from "@/services/taxCalculationService";
import { TaxCalculationResult, TaxCalculationConfig } from "@/types/tax";

/**
 * Hook for managing tax calculations with all business logic
 *
 * Follows Single Responsibility Principle - only handles tax calculation concerns.
 * Provides comprehensive tax calculations with loading states and error handling.
 *
 * @param selectedYear - Year for which to calculate taxes
 * @returns Object with calculation results, loading states, and refresh handler
 */
export const useTaxCalculations = (selectedYear: number) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Data fetching hooks
  const {
    state: { settings, loading: settingsLoading },
  } = useTaxSettings();
  const {
    invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useInvoices({
    selectedYear,
    taxRegime: settings?.taxRegime,
  });
  const {
    costs,
    loading: costsLoading,
    error: costsError,
  } = useCosts(selectedYear);

  /**
   * Calculate tax obligations based on current data
   * Memoized to prevent unnecessary recalculations
   * Contains all the complex business logic for tax calculations
   */
  const calculationResult = useMemo((): TaxCalculationResult => {
    // Return empty result if data is still loading
    if (!settings || settingsLoading || invoicesLoading || costsLoading) {
      return {
        totalIncome: 0,
        totalCosts: 0,
        taxableIncome: 0,
        irpefAmount: 0,
        contributionsAmount: 0,
        totalTaxes: 0,
        effectiveRate: 0,
      };
    }

    try {
      // Calculate total income from invoices for selected year
      const totalIncome = invoices
        .filter(
          (inv) =>
            inv.issueDate &&
            new Date(inv.issueDate).getFullYear() === selectedYear
        )
        .reduce((sum, inv) => sum + inv.amount, 0);

      // Calculate total deductible costs
      const totalCosts = costs
        .filter((cost) => cost.deductible)
        .reduce((sum, cost) => sum + cost.amount, 0);

      // Calculate taxable income based on tax regime
      let taxableIncome = 0;
      if (settings.taxRegime === "forfettario") {
        // Forfettario: apply profitability coefficient and subtract costs
        const profitabilityIncome =
          (totalIncome * (settings.profitabilityRate || 0)) / 100;
        taxableIncome = Math.max(0, profitabilityIncome - totalCosts);
      } else {
        // Ordinario: income minus deductible costs
        taxableIncome = Math.max(0, totalIncome - totalCosts);
      }

      // Calculate IRPEF/substitute tax
      const irpefAmount =
        settings.taxRegime === "forfettario"
          ? (taxableIncome * (settings.substituteRate || 0)) / 100
          : 0; // For ordinario, IRPEF calculation is more complex and not implemented here

      // Calculate pension contributions
      const contributionsAmount = taxCalculationService.calculateContributions(
        taxableIncome,
        settings.manualContributionRate || 0,
        settings.manualFixedAnnualContributions || 0
      );

      // Calculate totals and effective rate
      const totalTaxes = irpefAmount + contributionsAmount;
      const effectiveRate =
        totalIncome > 0 ? (totalTaxes / totalIncome) * 100 : 0;

      return {
        totalIncome,
        totalCosts,
        taxableIncome,
        irpefAmount,
        contributionsAmount,
        totalTaxes,
        effectiveRate,
      };
    } catch (error) {
      console.error("Error calculating tax contributions:", error);
      setCalculationError("Errore nel calcolo delle imposte");
      return {
        totalIncome: 0,
        totalCosts: 0,
        taxableIncome: 0,
        irpefAmount: 0,
        contributionsAmount: 0,
        totalTaxes: 0,
        effectiveRate: 0,
      };
    }
  }, [
    settings,
    settingsLoading,
    invoices,
    invoicesLoading,
    costs,
    costsLoading,
    selectedYear,
  ]);

  /**
   * Refresh calculations manually
   * Provides user feedback during refresh process
   */
  const handleRefreshCalculations = useCallback(async () => {
    setIsCalculating(true);
    setCalculationError(null);

    try {
      // Simulate brief loading for UX feedback
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Calculations are automatically updated via the useMemo dependency array
    } catch (error) {
      setCalculationError("Errore durante l&apos;aggiornamento dei calcoli");
      console.error("Refresh calculations error:", error);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  /**
   * Get tax calculation configuration for external use
   */
  const getCalculationConfig = useCallback(
    (): TaxCalculationConfig => ({
      selectedYear,
      taxRegime: settings?.taxRegime,
      profitabilityRate: settings?.profitabilityRate,
      substituteRate: settings?.substituteRate,
      manualContributionRate: settings?.manualContributionRate,
      manualFixedAnnualContributions: settings?.manualFixedAnnualContributions,
    }),
    [selectedYear, settings]
  );

  // Aggregate loading state
  const isLoading =
    settingsLoading || invoicesLoading || costsLoading || isCalculating;

  // Aggregate error state
  const hasError = Boolean(invoicesError || costsError || calculationError);
  const errorMessage = calculationError || invoicesError || costsError;

  return {
    // Calculation results
    calculationResult,

    // Configuration
    settings,
    config: getCalculationConfig(),

    // Loading states
    isLoading,
    isCalculating,
    settingsLoading,
    invoicesLoading,
    costsLoading,

    // Error states
    hasError,
    errorMessage,
    calculationError,

    // Actions
    handleRefreshCalculations,
    clearError: () => setCalculationError(null),
  };
};
