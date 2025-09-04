/**
 * Tax Data Hook
 *
 * SRP: Handles ONLY tax data fetching and processing
 * Specialized hook for tax widget data management
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { invoiceService } from "@/services/invoiceService";
import { costService } from "@/services/costService";
import { TaxData } from "@/components/widgets/financial/TaxWidget";

/**
 * Tax Calculation Logic
 * SRP: Handles only tax computation algorithms
 */
const calculateTaxes = (
  invoices: { issueDate: string; amount: number }[],
  costs: { date: string; amount: number }[],
  settings: {
    taxRegime?: string;
    profitabilityRate?: number;
    substituteRate?: number;
    pensionSystem?: string;
  } | null
): TaxData => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1;

  // Calculate quarterly revenue and costs
  const quarterStart = new Date(currentYear, (currentQuarter - 1) * 3, 1);
  const quarterEnd = new Date(currentYear, currentQuarter * 3, 0);

  const quarterlyInvoices = invoices.filter((invoice) => {
    const date = new Date(invoice.issueDate);
    return date >= quarterStart && date <= quarterEnd;
  });

  const quarterlyCosts = costs.filter((cost) => {
    const date = new Date(cost.date);
    return date >= quarterStart && date <= quarterEnd;
  });

  const quarterlyRevenue = quarterlyInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const quarterlyCostsAmount = quarterlyCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );

  // Calculate taxes based on regime
  let currentQuarterData: TaxData["currentQuarter"];

  if (settings?.taxRegime === "forfettario") {
    // Forfettario regime calculations
    const taxableIncome =
      quarterlyRevenue * ((settings.profitabilityRate || 78) / 100);
    const irpef = taxableIncome * ((settings.substituteRate || 5) / 100);
    const inps = calculateINPSContribution(quarterlyRevenue, settings);
    const professionalFund = calculateProfessionalFundContribution(
      quarterlyRevenue,
      settings
    );

    currentQuarterData = {
      irpef,
      inps,
      professionalFund,
      total: irpef + inps + professionalFund,
    };
  } else {
    // Ordinario regime calculations (simplified)
    const netIncome = quarterlyRevenue - quarterlyCostsAmount;
    const irpef = calculateIRPEF(netIncome);
    const inps = calculateINPSContribution(quarterlyRevenue, settings);
    const professionalFund = calculateProfessionalFundContribution(
      quarterlyRevenue,
      settings
    );

    currentQuarterData = {
      irpef,
      inps,
      professionalFund,
      total: irpef + inps + professionalFund,
    };
  }

  // Year to date calculations
  const yearStartDate = new Date(currentYear, 0, 1);
  // Year invoices calculation removed as not currently used
  const yearCosts = costs.filter(
    (cost) => new Date(cost.date) >= yearStartDate
  );

  // const yearRevenue = yearInvoices.reduce((sum, inv) => sum + inv.amount, 0); // Unused for now
  const yearCostsAmount = yearCosts.reduce((sum, cost) => sum + cost.amount, 0);

  // Calculate year to date taxes
  const yearToDate = {
    irpef: currentQuarterData.irpef * currentQuarter, // Simplified
    inps: currentQuarterData.inps * currentQuarter,
    professionalFund: currentQuarterData.professionalFund * currentQuarter,
    total: currentQuarterData.total * currentQuarter,
  };

  // Generate next payments (mock data - in real app would come from settings/calendar)
  const nextPayments = generateNextPayments(currentQuarterData, settings);

  // Estimate year end
  const monthsElapsed = now.getMonth() + 1;
  const estimatedYearEnd =
    monthsElapsed > 0 ? (yearToDate.total / monthsElapsed) * 12 : 0;

  // Calculate savings opportunity (simplified)
  const savingsOpportunity = calculateSavingsOpportunity(
    yearCostsAmount,
    settings
  );

  return {
    currentQuarter: currentQuarterData,
    yearToDate,
    nextPayments,
    taxRegime:
      (settings?.taxRegime as "forfettario" | "ordinario") || "forfettario",
    estimatedYearEnd,
    savingsOpportunity,
  };
};

/**
 * INPS Contribution Calculation
 * SRP: Handles only INPS calculation logic
 */
const calculateINPSContribution = (
  revenue: number,
  settings: { pensionSystem?: string } | null
): number => {
  if (!settings?.pensionSystem || settings.pensionSystem !== "INPS") {
    return 0;
  }

  // Simplified INPS calculation - in real app would use current rates
  const inpsRate = 0.24; // 24% for freelancers (simplified)
  return revenue * inpsRate;
};

/**
 * Professional Fund Contribution Calculation
 * SRP: Handles only professional fund calculation logic
 */
const calculateProfessionalFundContribution = (
  revenue: number,
  settings: { pensionSystem?: string } | null
): number => {
  if (
    !settings?.pensionSystem ||
    settings.pensionSystem !== "PROFESSIONAL_FUND"
  ) {
    return 0;
  }

  // Simplified calculation - in real app would fetch fund parameters
  const fundRate = 0.02; // 2% average (simplified)
  return revenue * fundRate;
};

/**
 * IRPEF Calculation
 * SRP: Handles only IRPEF calculation logic
 */
const calculateIRPEF = (netIncome: number): number => {
  // Simplified IRPEF calculation with brackets
  if (netIncome <= 15000) return netIncome * 0.23;
  if (netIncome <= 28000) return 15000 * 0.23 + (netIncome - 15000) * 0.27;
  if (netIncome <= 55000)
    return 15000 * 0.23 + 13000 * 0.27 + (netIncome - 28000) * 0.38;
  return (
    15000 * 0.23 + 13000 * 0.27 + 27000 * 0.38 + (netIncome - 55000) * 0.41
  );
};

/**
 * Generate Next Payments
 * SRP: Handles only payment schedule generation
 */
const generateNextPayments = (
  quarterData: TaxData["currentQuarter"],
  _settings: { taxRegime?: string } | null
) => {
  const now = new Date();
  const payments = [];

  // Add quarterly payments based on current date
  const nextQuarterPayment = new Date(now);
  nextQuarterPayment.setMonth(
    nextQuarterPayment.getMonth() + 3 - (now.getMonth() % 3)
  );
  nextQuarterPayment.setDate(16); // Usually 16th of the month

  if (quarterData.irpef > 0) {
    payments.push({
      description: "IRPEF Trimestrale",
      amount: quarterData.irpef,
      dueDate: new Date(nextQuarterPayment),
      type: "irpef" as const,
      isPaid: false,
    });
  }

  if (quarterData.inps > 0) {
    payments.push({
      description: "Contributi INPS",
      amount: quarterData.inps,
      dueDate: new Date(nextQuarterPayment),
      type: "inps" as const,
      isPaid: false,
    });
  }

  return payments;
};

/**
 * Calculate Savings Opportunity
 * SRP: Handles only savings calculation logic
 */
const calculateSavingsOpportunity = (
  totalCosts: number,
  settings: { taxRegime?: string } | null
): number => {
  // Simplified savings calculation based on potential deductions
  const deductionRate = settings?.taxRegime === "ordinario" ? 0.4 : 0.2; // 40% or 20% potential savings
  return totalCosts * deductionRate;
};

/**
 * Tax Data Hook
 * SRP: Handles only tax data fetching and state management
 */
export const useTaxData = () => {
  const [taxData, setTaxData] = useState<TaxData | null>(null);

  // Fetch all required data
  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getUserSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ["invoices", "tax-calculation"],
    queryFn: () => invoiceService.getAllInvoices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: costs,
    isLoading: costsLoading,
    error: costsError,
    refetch: refetchCosts,
  } = useQuery({
    queryKey: ["costs", "tax-calculation"],
    queryFn: () => costService.getAllCosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process tax data when all data is available
  useEffect(() => {
    if (settings && invoices && costs) {
      const processed = calculateTaxes(invoices, costs, settings);
      setTaxData(processed);
    }
  }, [settings, invoices, costs]);

  // Refresh function
  const refresh = useCallback(() => {
    refetchSettings();
    refetchInvoices();
    refetchCosts();
  }, [refetchSettings, refetchInvoices, refetchCosts]);

  // Combined loading and error states
  const isLoading = settingsLoading || invoicesLoading || costsLoading;
  const error =
    settingsError?.message ||
    invoicesError?.message ||
    costsError?.message ||
    null;

  return {
    taxData,
    isLoading,
    error,
    refresh,
  };
};
