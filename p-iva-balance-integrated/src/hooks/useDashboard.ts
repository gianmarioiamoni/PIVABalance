import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInvoices } from "./invoices";
import { useCosts } from "./costs";
import { getCurrentMonthStats } from "@/utils/invoiceCalculations";
import { getCurrentMonthCostStats } from "@/utils/costCalculations";
import { calculateEstimatedMonthlyTaxes } from "@/utils";

interface DashboardStats {
  invoicesThisMonth: number;
  monthlyRevenue: string;
  monthlyCosts: string;
  estimatedTaxes: string;
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

  // Convert cost dates from strings to Date objects for calculations
  const costsWithDates = useMemo(() => {
    return costs.map((cost) => ({
      ...cost,
      date: new Date(cost.date),
    }));
  }, [costs]);

  // Calculate real monthly statistics
  const stats: DashboardStats = useMemo(() => {
    if (invoicesLoading || costsLoading) {
      return {
        invoicesThisMonth: 0,
        monthlyRevenue: "€0",
        monthlyCosts: "€0",
        estimatedTaxes: "€0",
      };
    }

    // Calculate current month statistics
    const invoiceStats = getCurrentMonthStats(invoices);
    const costStats = getCurrentMonthCostStats(costsWithDates);
    const taxStats = calculateEstimatedMonthlyTaxes(
      invoiceStats.revenue,
      costStats.total
    );

    return {
      invoicesThisMonth: invoiceStats.count,
      monthlyRevenue: invoiceStats.formattedRevenue,
      monthlyCosts: costStats.formattedTotal,
      estimatedTaxes: taxStats.formattedTaxes,
    };
  }, [invoices, costsWithDates, invoicesLoading, costsLoading]);

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
  const isLoading = invoicesLoading || costsLoading;
  const error = invoicesError || costsError || null;

  return {
    stats,
    activities,
    quickActions,
    isLoading,
    error,
  };
};
