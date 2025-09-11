/**
 * Profit Data Hook
 *
 * SRP: Handles ONLY profit data fetching and processing
 * Specialized hook for profit widget data management
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { costService } from "@/services/costService";
import { ProfitData } from "@/components/widgets/financial/ProfitWidget";

/**
 * Business Health Score Calculation
 * SRP: Handles only health scoring algorithm
 */
const calculateHealthScore = (
  currentMargin: number,
  profitTrend: number,
  revenueGrowth: number,
  costControl: number
): number => {
  // Health score algorithm (0-100)
  let score = 0;

  // Margin contribution (40% of score)
  if (currentMargin >= 30) score += 40;
  else if (currentMargin >= 20) score += 30;
  else if (currentMargin >= 10) score += 20;
  else if (currentMargin >= 0) score += 10;

  // Profit trend contribution (30% of score)
  if (profitTrend >= 10) score += 30;
  else if (profitTrend >= 0) score += 20;
  else if (profitTrend >= -10) score += 10;

  // Revenue growth contribution (20% of score)
  if (revenueGrowth >= 15) score += 20;
  else if (revenueGrowth >= 5) score += 15;
  else if (revenueGrowth >= 0) score += 10;

  // Cost control contribution (10% of score)
  if (costControl <= 0) score += 10; // Costs decreased or stable
  else if (costControl <= 5) score += 5; // Costs increased slightly

  return Math.min(100, Math.max(0, score));
};

/**
 * Generate Business Recommendations
 * SRP: Handles only recommendation generation logic
 */
const generateRecommendations = (data: ProfitData): string[] => {
  const recommendations: string[] = [];

  // Margin-based recommendations
  if (data.currentMonth.margin < 15) {
    recommendations.push(
      "Considera di aumentare i prezzi o ridurre i costi operativi"
    );
  }

  // Trend-based recommendations
  if (data.trends.profitTrend < -10) {
    recommendations.push("Analizza le cause del calo di profittabilità");
  }

  if (data.trends.costTrend > 15) {
    recommendations.push(
      "I costi stanno crescendo rapidamente - rivedi le spese"
    );
  }

  // Benchmark-based recommendations
  if (data.currentMonth.margin < data.benchmarks.targetMargin) {
    recommendations.push(
      `Punta a raggiungere il target del ${data.benchmarks.targetMargin.toFixed(
        1
      )}%`
    );
  }

  if (data.currentMonth.margin < data.benchmarks.industryAverage) {
    recommendations.push("Il margine è sotto la media del settore");
  }

  // Health score recommendations
  if (data.healthScore < 50) {
    recommendations.push("Situazione critica: rivedi la strategia di pricing");
  }

  return recommendations.slice(0, 3); // Limit to top 3
};

/**
 * Profit Data Processing
 * SRP: Handles only profit calculation logic
 */
const processProfitData = (
  invoices: { issueDate: string; amount: number }[],
  costs: { date: string; amount: number }[],
  monthsToAnalyze: number
): ProfitData => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Current month data
  const currentMonthStart = new Date(currentYear, currentMonth, 1);
  const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);

  const currentMonthInvoices = invoices.filter((invoice) => {
    const date = new Date(invoice.issueDate);
    return date >= currentMonthStart && date <= currentMonthEnd;
  });

  const currentMonthCosts = costs.filter((cost) => {
    const date = new Date(cost.date);
    return date >= currentMonthStart && date <= currentMonthEnd;
  });

  // Previous month data
  const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const previousMonthEnd = new Date(currentYear, currentMonth, 0);

  const previousMonthInvoices = invoices.filter((invoice) => {
    const date = new Date(invoice.issueDate);
    return date >= previousMonthStart && date <= previousMonthEnd;
  });

  const previousMonthCosts = costs.filter((cost) => {
    const date = new Date(cost.date);
    return date >= previousMonthStart && date <= previousMonthEnd;
  });

  // Year to date data
  const yearStartDate = new Date(currentYear, 0, 1);
  const yearInvoices = invoices.filter(
    (invoice) => new Date(invoice.issueDate) >= yearStartDate
  );
  const yearCosts = costs.filter(
    (cost) => new Date(cost.date) >= yearStartDate
  );

  // Calculate current month metrics
  const currentMonthRevenue = currentMonthInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const currentMonthCostAmount = currentMonthCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );
  const currentMonthProfit = currentMonthRevenue - currentMonthCostAmount;
  const currentMonthMargin =
    currentMonthRevenue > 0
      ? (currentMonthProfit / currentMonthRevenue) * 100
      : 0;

  // Calculate previous month metrics
  const previousMonthRevenue = previousMonthInvoices.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const previousMonthCostAmount = previousMonthCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );
  const previousMonthProfit = previousMonthRevenue - previousMonthCostAmount;
  const previousMonthMargin =
    previousMonthRevenue > 0
      ? (previousMonthProfit / previousMonthRevenue) * 100
      : 0;

  // Calculate year to date metrics
  const yearRevenue = yearInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const yearCostAmount = yearCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const yearProfit = yearRevenue - yearCostAmount;
  const yearMargin = yearRevenue > 0 ? (yearProfit / yearRevenue) * 100 : 0;

  // Calculate trends
  const profitTrend =
    previousMonthProfit !== 0
      ? ((currentMonthProfit - previousMonthProfit) /
          Math.abs(previousMonthProfit)) *
        100
      : 0;
  const marginTrend = currentMonthMargin - previousMonthMargin;
  const revenueTrend =
    previousMonthRevenue !== 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
        100
      : 0;
  const costTrend =
    previousMonthCostAmount !== 0
      ? ((currentMonthCostAmount - previousMonthCostAmount) /
          previousMonthCostAmount) *
        100
      : 0;

  // Find best month
  const monthlyData: {
    [key: string]: { profit: number; margin: number; month: string };
  } = {};

  for (let i = 0; i < monthsToAnalyze; i++) {
    const monthDate = new Date(currentYear, currentMonth - i, 1);
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

    const monthInvoices = invoices.filter((invoice) => {
      const date = new Date(invoice.issueDate);
      return date >= monthStart && date <= monthEnd;
    });

    const monthCosts = costs.filter((cost) => {
      const date = new Date(cost.date);
      return date >= monthStart && date <= monthEnd;
    });

    const monthRevenue = monthInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    const monthCostAmount = monthCosts.reduce(
      (sum, cost) => sum + cost.amount,
      0
    );
    const monthProfit = monthRevenue - monthCostAmount;
    const monthMargin =
      monthRevenue > 0 ? (monthProfit / monthRevenue) * 100 : 0;

    const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
    monthlyData[monthKey] = {
      profit: monthProfit,
      margin: monthMargin,
      month: monthDate.toLocaleDateString("it-IT", {
        month: "long",
        year: "numeric",
      }),
    };
  }

  const bestMonth = Object.values(monthlyData).reduce(
    (best, month) => (month.profit > best.profit ? month : best),
    { profit: 0, margin: 0, month: "N/A" }
  );

  // Calculate health score
  const healthScore = calculateHealthScore(
    currentMonthMargin,
    profitTrend,
    revenueTrend,
    costTrend
  );

  // Build profit data object
  const profitData: ProfitData = {
    currentMonth: {
      revenue: currentMonthRevenue,
      costs: currentMonthCostAmount,
      profit: currentMonthProfit,
      margin: currentMonthMargin,
    },
    previousMonth: {
      revenue: previousMonthRevenue,
      costs: previousMonthCostAmount,
      profit: previousMonthProfit,
      margin: previousMonthMargin,
    },
    yearToDate: {
      revenue: yearRevenue,
      costs: yearCostAmount,
      profit: yearProfit,
      margin: yearMargin,
    },
    trends: {
      profitTrend,
      marginTrend,
      revenueTrend,
      costTrend,
    },
    benchmarks: {
      targetMargin: 25, // 25% target margin for freelancers
      industryAverage: 20, // 20% industry average
      bestMonth: {
        month: bestMonth.month,
        profit: bestMonth.profit,
        margin: bestMonth.margin,
      },
    },
    healthScore,
    recommendations: [],
  };

  // Generate recommendations based on calculated data
  profitData.recommendations = generateRecommendations(profitData);

  return profitData;
};

/**
 * Profit Data Hook
 * SRP: Handles only profit data fetching and state management
 */
export const useProfitData = (monthsToAnalyze: number = 12) => {
  const [profitData, setProfitData] = useState<ProfitData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch invoices and costs data
  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices,
    dataUpdatedAt: invoicesUpdatedAt,
  } = useQuery({
    queryKey: ["invoices", "profit-analysis"],
    queryFn: () => invoiceService.getAllInvoices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const {
    data: costs,
    isLoading: costsLoading,
    error: costsError,
    refetch: refetchCosts,
    dataUpdatedAt: costsUpdatedAt,
  } = useQuery({
    queryKey: ["costs", "profit-analysis"],
    queryFn: () => costService.getAllCosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Process profit data when both datasets are available
  useEffect(() => {
    if (invoices && costs) {
      const processed = processProfitData(invoices, costs, monthsToAnalyze);
      setProfitData(processed);
      // Update lastUpdated with the most recent data timestamp
      const latestUpdate = Math.max(invoicesUpdatedAt, costsUpdatedAt);
      setLastUpdated(new Date(latestUpdate));
    }
  }, [invoices, costs, monthsToAnalyze, invoicesUpdatedAt, costsUpdatedAt]);

  // Refresh function
  const refresh = useCallback(() => {
    refetchInvoices();
    refetchCosts();
  }, [refetchInvoices, refetchCosts]);

  // Combined loading and error states
  const isLoading = invoicesLoading || costsLoading;
  const error = invoicesError?.message || costsError?.message || null;

  return {
    profitData,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
};
