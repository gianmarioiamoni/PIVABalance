/**
 * Performance Monitoring Hook
 * SRP: Manages performance metrics collection and monitoring
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PerformanceMonitor,
  PerformanceBudgetChecker,
  PerformanceMetrics,
} from "@/utils/performance";

interface PerformanceMonitoringState {
  metrics: PerformanceMetrics | null;
  isCollecting: boolean;
  budgetStatus: {
    isWithinBudget: boolean;
    score: number;
    violations: string[];
  } | null;
  error: string | null;
}

/**
 * Hook for monitoring page performance
 * SRP: Performance monitoring state management ONLY
 */
export const usePerformanceMonitoring = (autoCollect: boolean = true) => {
  const [state, setState] = useState<PerformanceMonitoringState>({
    metrics: null,
    isCollecting: false,
    budgetStatus: null,
    error: null,
  });

  /**
   * Collect current page performance metrics
   */
  const collectMetrics = useCallback(async () => {
    setState((prev) => ({ ...prev, isCollecting: true, error: null }));

    try {
      const metrics = await PerformanceMonitor.collectWebVitals();
      const budgetStatus = PerformanceBudgetChecker.checkBudget(metrics);

      setState({
        metrics,
        isCollecting: false,
        budgetStatus: {
          isWithinBudget: budgetStatus.isWithinBudget,
          score: budgetStatus.budgetScore,
          violations: budgetStatus.criticalViolations,
        },
        error: null,
      });

      // Log metrics in development
      PerformanceMonitor.logMetrics(metrics);

      return metrics;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown performance error";
      setState((prev) => ({
        ...prev,
        isCollecting: false,
        error: errorMessage,
      }));
      console.error("Performance collection error:", error);
      return null;
    }
  }, []);

  /**
   * Reset performance monitoring state
   */
  const resetMetrics = useCallback(() => {
    setState({
      metrics: null,
      isCollecting: false,
      budgetStatus: null,
      error: null,
    });
  }, []);

  /**
   * Auto-collect metrics on mount if enabled
   */
  useEffect(() => {
    if (autoCollect && typeof window !== "undefined") {
      // Wait for page to be fully loaded
      if (document.readyState === "complete") {
        collectMetrics();
      } else {
        window.addEventListener("load", collectMetrics, { once: true });
        return () => window.removeEventListener("load", collectMetrics);
      }
    }
  }, [autoCollect, collectMetrics]);

  return {
    ...state,
    collectMetrics,
    resetMetrics,
    isPerformanceBudgetMet: state.budgetStatus?.isWithinBudget ?? null,
    performanceScore: state.budgetStatus?.score ?? null,
  };
};

/**
 * Hook for real-time performance monitoring
 * SRP: Real-time monitoring ONLY
 */
export const useRealTimePerformance = (interval: number = 30000) => {
  const [metricsHistory, setMetricsHistory] = useState<PerformanceMetrics[]>(
    []
  );
  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);

    const collectAndStore = async () => {
      try {
        const metrics = await PerformanceMonitor.collectWebVitals();
        setMetricsHistory((prev) => [...prev.slice(-19), metrics]); // Keep last 20 measurements
      } catch (error) {
        console.error("Real-time performance collection error:", error);
      }
    };

    // Initial collection
    collectAndStore();

    // Set up interval
    const intervalId = setInterval(collectAndStore, interval);

    return () => {
      clearInterval(intervalId);
      setIsMonitoring(false);
    };
  }, [interval]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  const clearHistory = useCallback(() => {
    setMetricsHistory([]);
  }, []);

  return {
    metricsHistory,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    clearHistory,
    latestMetrics: metricsHistory[metricsHistory.length - 1] || null,
  };
};

/**
 * Hook for component-specific performance tracking
 * SRP: Component performance tracking ONLY
 */
export const useComponentPerformance = (componentName: string) => {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    setRenderCount((prev) => prev + 1);

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      setLastRenderTime(renderTime);

      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.info(
          `🎨 ${componentName} render time: ${renderTime.toFixed(2)}ms`
        );
      }
    };
  }, [componentName]);

  return {
    renderCount,
    lastRenderTime,
    componentName,
  };
};
