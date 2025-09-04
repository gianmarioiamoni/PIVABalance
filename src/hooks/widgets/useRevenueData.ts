/**
 * Revenue Data Hook
 *
 * SRP: Handles ONLY revenue data fetching and processing
 * Specialized hook for revenue widget data management
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { RevenueData } from "@/components/widgets/financial/RevenueWidget";

/**
 * Revenue Data Processing
 * SRP: Handles only revenue calculation logic
 */
const processRevenueData = (
  invoices: { issueDate: string; amount: number }[],
  monthsToAnalyze: number
): RevenueData => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Filter invoices for analysis period
  const analysisStartDate = new Date(
    currentYear,
    currentMonth - monthsToAnalyze,
    1
  );
  const relevantInvoices = invoices.filter(
    (invoice) => new Date(invoice.issueDate) >= analysisStartDate
  );

  // Current month revenues
  const currentMonthStart = new Date(currentYear, currentMonth, 1);
  const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);

  const currentMonthInvoices = relevantInvoices.filter((invoice) => {
    const issueDate = new Date(invoice.issueDate);
    return issueDate >= currentMonthStart && issueDate <= currentMonthEnd;
  });

  // Previous month revenues
  const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const previousMonthEnd = new Date(currentYear, currentMonth, 0);

  const previousMonthInvoices = relevantInvoices.filter((invoice) => {
    const issueDate = new Date(invoice.issueDate);
    return issueDate >= previousMonthStart && issueDate <= previousMonthEnd;
  });

  // Year to date revenues
  const yearStartDate = new Date(currentYear, 0, 1);
  const yearToDateInvoices = relevantInvoices.filter(
    (invoice) => new Date(invoice.issueDate) >= yearStartDate
  );

  // Calculate amounts
  const currentMonthRevenue = currentMonthInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const previousMonthRevenue = previousMonthInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const yearToDateRevenue = yearToDateInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );

  // Calculate trends
  const monthlyTrend =
    previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
        100
      : 0;

  // Calculate monthly averages
  const monthlyData: { [key: string]: number } = {};
  relevantInvoices.forEach((invoice) => {
    const date = new Date(invoice.issueDate);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + invoice.amount;
  });

  const monthlyAmounts = Object.values(monthlyData);
  const averageMonthly =
    monthlyAmounts.length > 0
      ? monthlyAmounts.reduce((sum, amount) => sum + amount, 0) /
        monthlyAmounts.length
      : 0;

  // Find best month
  const bestMonthEntry = Object.entries(monthlyData).reduce(
    (best, [monthKey, amount]) =>
      amount > best.amount ? { monthKey, amount } : best,
    { monthKey: "", amount: 0 }
  );

  const bestMonth = {
    month: bestMonthEntry.monthKey
      ? new Date(
          parseInt(bestMonthEntry.monthKey.split("-")[0]),
          parseInt(bestMonthEntry.monthKey.split("-")[1])
        ).toLocaleDateString("it-IT", { month: "long", year: "numeric" })
      : "N/A",
    amount: bestMonthEntry.amount,
  };

  // Calculate yearly projection
  const monthsElapsed = currentMonth + 1;
  const projectedYear =
    monthsElapsed > 0 ? (yearToDateRevenue / monthsElapsed) * 12 : 0;

  // Previous year for yearly trend
  const previousYearInvoices = invoices.filter((invoice) => {
    const issueDate = new Date(invoice.issueDate);
    return issueDate.getFullYear() === currentYear - 1;
  });
  const previousYearTotal = previousYearInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const yearlyTrend =
    previousYearTotal > 0
      ? ((yearToDateRevenue - previousYearTotal) / previousYearTotal) * 100
      : 0;

  return {
    currentMonth: currentMonthRevenue,
    previousMonth: previousMonthRevenue,
    yearToDate: yearToDateRevenue,
    monthlyTrend,
    yearlyTrend,
    averageMonthly,
    bestMonth,
    projectedYear,
  };
};

/**
 * Revenue Data Hook
 * SRP: Handles only revenue data fetching and state management
 */
export const useRevenueData = (monthsToAnalyze: number = 12) => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);

  // Fetch invoices data
  const {
    data: invoices,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invoices", "revenue-analysis"],
    queryFn: () => invoiceService.getAllInvoices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Process revenue data when invoices change
  useEffect(() => {
    if (invoices) {
      const processed = processRevenueData(invoices, monthsToAnalyze);
      setRevenueData(processed);
    }
  }, [invoices, monthsToAnalyze]);

  // Refresh function
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    revenueData,
    isLoading,
    error: error?.message || null,
    refresh,
  };
};
