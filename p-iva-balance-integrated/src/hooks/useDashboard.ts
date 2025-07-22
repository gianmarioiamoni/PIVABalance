import { useMemo } from "react";
import { useRouter } from "next/navigation";

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
 */
export const useDashboard = (): UseDashboardReturn => {
  const router = useRouter();

  // TODO: Replace with actual API calls when available
  const stats: DashboardStats = useMemo(
    () => ({
      invoicesThisMonth: 12,
      monthlyRevenue: "€15.420",
      monthlyCosts: "€3.240",
      estimatedTaxes: "€4.680",
    }),
    []
  );

  // TODO: Replace with actual recent activities from API
  const activities: Activity[] = useMemo(
    () => [
      {
        description: "Fattura #2024-001",
        amount: "€1.200",
        type: "income",
      },
      {
        description: "Costo Materiali",
        amount: "€320",
        type: "expense",
      },
      {
        description: "Fattura #2024-002",
        amount: "€850",
        type: "income",
      },
    ],
    []
  );

  // Navigation actions
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

  // DEBUG: Add temporary logging
  console.log("🎯 useDashboard state:", {
    hasStats: !!stats,
    hasActivities: activities.length > 0,
    hasQuickActions: quickActions.length > 0,
    isLoading: false,
  });

  return {
    stats,
    activities,
    quickActions,
    isLoading: false, // Mock data is immediately available
    error: null,
  };
};
