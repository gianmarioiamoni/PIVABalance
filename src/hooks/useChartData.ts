/**
 * Chart Data Hook
 *
 * SRP: Handles ONLY chart data fetching and processing
 * Specialized hook for chart data management across different chart types
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { costService } from "@/services/costService";
import { CashFlowDataPoint } from "@/components/charts/types";

/**
 * Cash Flow Data Processing
 * SRP: Handles only cash flow calculation logic
 */
const processCashFlowData = (
  invoices: { issueDate: string; amount: number }[],
  costs: { date: string; amount: number }[],
  months: number
): CashFlowDataPoint[] => {
  const now = new Date();
  const data: CashFlowDataPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    );
    const monthEnd = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0
    );

    // Filter invoices for this month
    const monthInvoices = invoices.filter((invoice) => {
      const date = new Date(invoice.issueDate);
      return date >= monthStart && date <= monthEnd;
    });

    // Filter costs for this month
    const monthCosts = costs.filter((cost) => {
      const date = new Date(cost.date);
      return date >= monthStart && date <= monthEnd;
    });

    // Calculate totals
    const income = monthInvoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0
    );
    const expenses = monthCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const net = income - expenses;

    data.push({
      month: monthDate.toLocaleDateString("it-IT", {
        month: "short",
        year:
          monthDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      }),
      income,
      expenses,
      net,
      date: monthDate,
    });
  }

  return data;
};

/**
 * Cash Flow Data Hook
 * SRP: Handles only cash flow data fetching and state management
 */
export const useCashFlowData = (months: number = 6) => {
  const [data, setData] = useState<CashFlowDataPoint[]>([]);

  // Fetch invoices
  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ["invoices", "cashflow"],
    queryFn: () => invoiceService.getAllInvoices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch costs
  const {
    data: costs,
    isLoading: costsLoading,
    error: costsError,
    refetch: refetchCosts,
  } = useQuery({
    queryKey: ["costs", "cashflow"],
    queryFn: () => costService.getAllCosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process data when both datasets are available
  useEffect(() => {
    if (invoices && costs) {
      const processed = processCashFlowData(invoices, costs, months);
      setData(processed);
    }
  }, [invoices, costs, months]);

  // Refresh function
  const refreshData = useCallback(() => {
    refetchInvoices();
    refetchCosts();
  }, [refetchInvoices, refetchCosts]);

  // Combined loading and error states
  const isLoading = invoicesLoading || costsLoading;
  const error = invoicesError?.message || costsError?.message || null;

  return {
    data,
    isLoading,
    error,
    refreshData,
  };
};
