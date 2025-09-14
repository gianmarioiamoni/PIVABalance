import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInvoices } from "./invoices";
import { useCosts } from "./costs";
import { useTaxSettings } from "./useTaxSettings";
import { getCurrentMonthStats } from "@/utils/invoiceCalculations";
import { getCurrentMonthCostStats } from "@/utils/costCalculations";
import { calculateEstimatedMonthlyTaxes } from "@/utils";

interface DashboardStats {
  invoicesThisMonth: number;
  monthlyRevenue: string;
  monthlyCosts: string;
  estimatedTaxes: string;
}

interface AnnualSummary {
  totalRevenue: number;
  totalCosts: number;
  grossCashFlow: number;
  totalTaxes: number;
  netCashFlow: number;
  yearProgress: number;
  formattedRevenue: string;
  formattedCosts: string;
  formattedGrossCashFlow: string;
  formattedTaxes: string;
  formattedNetCashFlow: string;
}

interface Activity {
  description: string;
  amount: string;
  type: "income" | "expense";
}

interface QuickAction {
  label: string;
  onClick: () => void;
  bgColor: string;
  hoverColor: string;
}

interface UseDashboardReturn {
  stats: DashboardStats;
  annualSummary: AnnualSummary;
  activities: Activity[];
  quickActions: QuickAction[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for dashboard data and logic
 * Follows SRP by handling only dashboard-related business logic
 * Separates data management from UI components
 * Now uses real data from API instead of mock data
 */
export const useDashboard = (): UseDashboardReturn => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  // Load real data from API
  const {
    invoices = [],
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useInvoices({ selectedYear: currentYear });
  const {
    costs = [],
    loading: costsLoading,
    error: costsError,
  } = useCosts(currentYear);
  
  // Load user tax settings for accurate calculations
  const {
    state: { settings: taxSettings, loading: settingsLoading },
  } = useTaxSettings();

  // Convert cost dates from strings to Date objects for calculations
  const costsWithDates = useMemo(() => {
    return costs.map((cost) => ({
      ...cost,
      date: new Date(cost.date),
    }));
  }, [costs]);

  // Calculate real monthly statistics
  const stats: DashboardStats = useMemo(() => {
    if (invoicesLoading || costsLoading || settingsLoading) {
      return {
        invoicesThisMonth: 0,
        monthlyRevenue: "€0",
        monthlyCosts: "€0",
        estimatedTaxes: "€0",
      };
    }

    // Calculate year-to-date statistics for current year
    const currentYear = new Date().getFullYear();
    const yearToDateInvoices = invoices.filter(inv => {
      const invoiceDate = new Date(inv.issueDate || inv.date);
      return invoiceDate.getFullYear() === currentYear;
    });
    const yearToDateCosts = costsWithDates.filter(cost => {
      return cost.date.getFullYear() === currentYear;
    });
    
    const yearToDateRevenue = yearToDateInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const yearToDateCostsTotal = yearToDateCosts.reduce((sum, cost) => sum + cost.amount, 0);
    
    // Calculate current month statistics for display
    const invoiceStats = getCurrentMonthStats(invoices);
    const costStats = getCurrentMonthCostStats(costsWithDates);
    
    // Use year-to-date data for accurate tax calculation
    const taxStats = calculateEstimatedMonthlyTaxes(
      yearToDateRevenue,
      yearToDateCostsTotal,
      taxSettings
    );

    return {
      invoicesThisMonth: invoiceStats.count,
      monthlyRevenue: invoiceStats.formattedRevenue,
      monthlyCosts: costStats.formattedTotal,
      estimatedTaxes: taxStats.formattedTaxes,
    };
  }, [invoices, costsWithDates, invoicesLoading, costsLoading, settingsLoading, taxSettings]);

  // Calculate annual summary with cash flow analysis
  const annualSummary: AnnualSummary = useMemo(() => {
    if (invoicesLoading || costsLoading || settingsLoading) {
      return {
        totalRevenue: 0,
        totalCosts: 0,
        grossCashFlow: 0,
        totalTaxes: 0,
        netCashFlow: 0,
        yearProgress: 0,
        formattedRevenue: "€0",
        formattedCosts: "€0",
        formattedGrossCashFlow: "€0",
        formattedTaxes: "€0",
        formattedNetCashFlow: "€0",
      };
    }

    // Calculate year-to-date statistics for current year
    const currentYear = new Date().getFullYear();
    const yearToDateInvoices = invoices.filter(inv => {
      const invoiceDate = new Date(inv.issueDate || inv.date);
      return invoiceDate.getFullYear() === currentYear;
    });
    const yearToDateCosts = costsWithDates.filter(cost => {
      return cost.date.getFullYear() === currentYear;
    });
    
    const totalRevenue = yearToDateInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCosts = yearToDateCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const grossCashFlow = totalRevenue - totalCosts;
    
    // Get taxes from our calculation
    const totalTaxes = parseFloat(stats.estimatedTaxes.replace(/[€.,]/g, '')) || 0;
    const netCashFlow = grossCashFlow - totalTaxes;
    
    // Calculate year progress (percentage of year completed)
    const now = new Date();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);
    const yearProgress = ((now.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100;

    const formatCurrency = (amount: number) => 
      `€${amount.toLocaleString("it-IT", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`;

    return {
      totalRevenue,
      totalCosts,
      grossCashFlow,
      totalTaxes,
      netCashFlow,
      yearProgress: Math.round(yearProgress),
      formattedRevenue: formatCurrency(totalRevenue),
      formattedCosts: formatCurrency(totalCosts),
      formattedGrossCashFlow: formatCurrency(grossCashFlow),
      formattedTaxes: formatCurrency(totalTaxes),
      formattedNetCashFlow: formatCurrency(netCashFlow),
    };
  }, [invoices, costsWithDates, stats.estimatedTaxes, invoicesLoading, costsLoading, settingsLoading]);

  // Create recent activities from real data
  const activities: Activity[] = useMemo(() => {
    if (invoicesLoading || costsLoading) return [];

    const recentActivities: Activity[] = [];

    // Add recent invoices (limit to 2)
    const recentInvoices = invoices
      .sort(
        (a, b) =>
          new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
      )
      .slice(0, 2);

    recentInvoices.forEach((invoice) => {
      recentActivities.push({
        description: `Fattura #${invoice.number || "N/A"}`,
        amount: `+€${invoice.amount.toLocaleString("it-IT")}`,
        type: "income",
      });
    });

    // Add recent cost (limit to 1)
    const recentCosts = costsWithDates
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 1);

    recentCosts.forEach((cost) => {
      recentActivities.push({
        description: cost.description || "Costo",
        amount: `-€${cost.amount.toLocaleString("it-IT")}`,
        type: "expense",
      });
    });

    return recentActivities.slice(0, 3); // Limit to 3 total activities
  }, [invoices, costsWithDates, invoicesLoading, costsLoading]);

  // Navigation actions (unchanged)
  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        label: "Nuova Fattura",
        onClick: () => router.push("/dashboard/invoices"),
        bgColor: "bg-blue-500",
        hoverColor: "hover:bg-blue-600",
      },
      {
        label: "Aggiungi Costo",
        onClick: () => router.push("/dashboard/costs"),
        bgColor: "bg-green-500",
        hoverColor: "hover:bg-green-600",
      },
      {
        label: "Visualizza Report",
        onClick: () => router.push("/dashboard/taxes"),
        bgColor: "bg-purple-500",
        hoverColor: "hover:bg-purple-600",
      },
    ],
    [router]
  );

  // Determine loading state and errors
  const isLoading = invoicesLoading || costsLoading || settingsLoading;
  const error = invoicesError || costsError || null;

  return {
    stats,
    annualSummary,
    activities,
    quickActions,
    isLoading,
    error,
  };
};
