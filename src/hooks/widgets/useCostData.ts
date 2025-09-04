/**
 * Cost Data Hook
 *
 * SRP: Handles ONLY cost data fetching and processing
 * Specialized hook for cost widget data management
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { costService } from "@/services/costService";
import { CostData } from "@/components/widgets/financial/CostWidget";

/**
 * Cost Categories Mapping
 * SRP: Handles only cost categorization logic
 */
const categorizeCosts = (
  costs: { description: string; amount: number }[]
): { [key: string]: number } => {
  const categories: { [key: string]: number } = {};

  costs.forEach((cost) => {
    // Simple categorization based on description keywords
    const description = cost.description.toLowerCase();
    let category = "Altri";

    if (
      description.includes("ufficio") ||
      description.includes("affitto") ||
      description.includes("utenze")
    ) {
      category = "Ufficio";
    } else if (
      description.includes("auto") ||
      description.includes("carburante") ||
      description.includes("trasport")
    ) {
      category = "Trasporti";
    } else if (
      description.includes("telefon") ||
      description.includes("internet") ||
      description.includes("software")
    ) {
      category = "Tecnologia";
    } else if (
      description.includes("formazione") ||
      description.includes("corso") ||
      description.includes("libro")
    ) {
      category = "Formazione";
    } else if (
      description.includes("marketing") ||
      description.includes("pubblicità") ||
      description.includes("sito")
    ) {
      category = "Marketing";
    } else if (
      description.includes("consulenz") ||
      description.includes("professional") ||
      description.includes("commercialista")
    ) {
      category = "Consulenze";
    }

    categories[category] = (categories[category] || 0) + cost.amount;
  });

  return categories;
};

/**
 * Cost Data Processing
 * SRP: Handles only cost calculation logic
 */
const processCostData = (
  costs: { date: string; amount: number; description: string }[],
  monthsToAnalyze: number
): CostData => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Filter costs for analysis period
  const analysisStartDate = new Date(
    currentYear,
    currentMonth - monthsToAnalyze,
    1
  );
  const relevantCosts = costs.filter(
    (cost) => new Date(cost.date) >= analysisStartDate
  );

  // Current month costs
  const currentMonthStart = new Date(currentYear, currentMonth, 1);
  const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0);

  const currentMonthCosts = relevantCosts.filter((cost) => {
    const costDate = new Date(cost.date);
    return costDate >= currentMonthStart && costDate <= currentMonthEnd;
  });

  // Previous month costs
  const previousMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const previousMonthEnd = new Date(currentYear, currentMonth, 0);

  const previousMonthCosts = relevantCosts.filter((cost) => {
    const costDate = new Date(cost.date);
    return costDate >= previousMonthStart && costDate <= previousMonthEnd;
  });

  // Year to date costs
  const yearStartDate = new Date(currentYear, 0, 1);
  const yearToDateCosts = relevantCosts.filter(
    (cost) => new Date(cost.date) >= yearStartDate
  );

  // Calculate amounts
  const currentMonthAmount = currentMonthCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );
  const previousMonthAmount = previousMonthCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );
  const yearToDateAmount = yearToDateCosts.reduce(
    (sum, cost) => sum + cost.amount,
    0
  );

  // Calculate trends
  const monthlyTrend =
    previousMonthAmount > 0
      ? ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100
      : 0;

  // Calculate monthly averages
  const monthlyData: { [key: string]: number } = {};
  relevantCosts.forEach((cost) => {
    const date = new Date(cost.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + cost.amount;
  });

  const monthlyAmounts = Object.values(monthlyData);
  const averageMonthly =
    monthlyAmounts.length > 0
      ? monthlyAmounts.reduce((sum, amount) => sum + amount, 0) /
        monthlyAmounts.length
      : 0;

  // Categorize costs
  const categoryTotals = categorizeCosts(currentMonthCosts);
  const totalCategorized = Object.values(categoryTotals).reduce(
    (sum, amount) => sum + amount,
    0
  );

  const categories = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalCategorized > 0 ? (amount / totalCategorized) * 100 : 0,
      trend: 0, // TODO: Calculate category-specific trends
    }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate deductible amounts (simplified - assuming 100% deductible for business costs)
  const deductibleAmount = currentMonthAmount; // In real scenario, this would be calculated based on cost type
  const deductiblePercentage =
    currentMonthAmount > 0 ? (deductibleAmount / currentMonthAmount) * 100 : 0;

  // Find highest category
  const highestCategory =
    categories.length > 0
      ? { name: categories[0].name, amount: categories[0].amount }
      : { name: "N/A", amount: 0 };

  // Calculate yearly projection
  const monthsElapsed = currentMonth + 1;
  const projectedYear =
    monthsElapsed > 0 ? (yearToDateAmount / monthsElapsed) * 12 : 0;

  return {
    currentMonth: currentMonthAmount,
    previousMonth: previousMonthAmount,
    yearToDate: yearToDateAmount,
    monthlyTrend,
    averageMonthly,
    categories,
    deductibleAmount,
    deductiblePercentage,
    highestCategory,
    projectedYear,
  };
};

/**
 * Cost Data Hook
 * SRP: Handles only cost data fetching and state management
 */
export const useCostData = (monthsToAnalyze: number = 12) => {
  const [costData, setCostData] = useState<CostData | null>(null);

  // Fetch costs data
  const {
    data: costs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["costs", "cost-analysis"],
    queryFn: () => costService.getAllCosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Process cost data when costs change
  useEffect(() => {
    if (costs) {
      const processed = processCostData(costs, monthsToAnalyze);
      setCostData(processed);
    }
  }, [costs, monthsToAnalyze]);

  // Refresh function
  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    costData,
    isLoading,
    error: error?.message || null,
    refresh,
  };
};
