/**
 * Business Analytics Hook
 *
 * SRP: Handles ONLY business analytics data fetching and processing
 * Advanced analytics data management for KPIs and insights
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "@/services/invoiceService";
import { costService } from "@/services/costService";
import {
  KPICalculatorService,
  BusinessInsightsService,
  ChartAnalyticsProcessor,
} from "@/services/analyticsService";
import {
  ChartAnalyticsData,
  KPIMetric,
  BusinessInsight,
} from "@/components/charts/advanced/types";
import { AnalyticsPeriod } from "@/components/analytics/BusinessAnalytics";

/**
 * Business Analytics Hook
 * SRP: Handles only business analytics data management
 */
export const useBusinessAnalytics = (
  userId: string,
  period: AnalyticsPeriod
) => {
  const [kpis, setKpis] = useState<KPIMetric[]>([]);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [analyticsData, setAnalyticsData] = useState<{
    revenueData: ChartAnalyticsData;
    costData: ChartAnalyticsData;
    profitData: ChartAnalyticsData;
  } | null>(null);

  // Fetch invoices
  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ["invoices", "analytics", period],
    queryFn: () => invoiceService.getAllInvoices(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch costs
  const {
    data: costs,
    isLoading: costsLoading,
    error: costsError,
    refetch: refetchCosts,
  } = useQuery({
    queryKey: ["costs", "analytics", period],
    queryFn: () => costService.getAllCosts(),
    staleTime: 5 * 60 * 1000,
  });

  // Process data when available
  useEffect(() => {
    if (invoices && costs) {
      const analyticsData = { invoices, costs, period };

      // Calculate KPIs using service
      const calculatedKPIs =
        KPICalculatorService.calculateFinancialKPIs(analyticsData);
      setKpis(calculatedKPIs);

      // Generate insights using service
      const generatedInsights = BusinessInsightsService.generateInsights(
        calculatedKPIs,
        analyticsData
      );
      setInsights(generatedInsights);

      // Process chart data using service
      const revenueData = ChartAnalyticsProcessor.processRevenueData(
        invoices,
        period
      );
      const costData = ChartAnalyticsProcessor.processCostData(costs, period);
      const profitData = ChartAnalyticsProcessor.processProfitData(
        invoices,
        costs,
        period
      );

      setAnalyticsData({
        revenueData,
        costData,
        profitData,
      });
    }
  }, [invoices, costs, period]);

  // Refresh function
  const refresh = useCallback(() => {
    refetchInvoices();
    refetchCosts();
  }, [refetchInvoices, refetchCosts]);

  const isLoading = invoicesLoading || costsLoading;
  const error = invoicesError?.message || costsError?.message || null;

  return {
    kpis,
    insights,
    revenueData: analyticsData?.revenueData || {
      primary: [],
      metadata: {
        period: "",
        currency: "EUR",
        lastUpdated: new Date(),
        dataSource: "",
      },
    },
    costData: analyticsData?.costData || {
      primary: [],
      metadata: {
        period: "",
        currency: "EUR",
        lastUpdated: new Date(),
        dataSource: "",
      },
    },
    profitData: analyticsData?.profitData || {
      primary: [],
      metadata: {
        period: "",
        currency: "EUR",
        lastUpdated: new Date(),
        dataSource: "",
      },
    },
    isLoading,
    error,
    refresh,
  };
};
