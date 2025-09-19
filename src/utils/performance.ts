/**
 * Performance Monitoring Utilities
 * Following SOLID principles - Single Responsibility for performance tracking
 */

export interface PerformanceMetrics {
  id: string;
  timestamp: number;
  pageLoad: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  bundleSize?: number;
  componentCount?: number;
  memoryUsage?: number;
  url: string;
  userAgent: string;
}

export interface PerformanceBudget {
  pageLoad: number; // Max 2000ms
  firstPaint: number; // Max 800ms
  firstContentfulPaint: number; // Max 1200ms
  largestContentfulPaint: number; // Max 2500ms
  cumulativeLayoutShift: number; // Max 0.1
  firstInputDelay: number; // Max 100ms
  bundleSize: number; // Max 150KB
}

/**
 * Performance Monitoring Service
 * SRP: Handles only performance metrics collection and analysis
 */
export class PerformanceMonitor {
  private static readonly PERFORMANCE_BUDGET: PerformanceBudget = {
    pageLoad: 2000,
    firstPaint: 800,
    firstContentfulPaint: 1200,
    largestContentfulPaint: 2500,
    cumulativeLayoutShift: 0.1,
    firstInputDelay: 100,
    bundleSize: 150000, // 150KB
  };

  /**
   * Collect Core Web Vitals metrics
   * SRP: Data collection ONLY
   */
  static collectWebVitals(): Promise<PerformanceMetrics> {
    return new Promise((resolve) => {
      try {
        if (typeof window === "undefined") {
          // Return default metrics for SSR
          resolve({
            id: this.generateMetricId(),
            timestamp: Date.now(),
            pageLoad: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            url: "",
            userAgent: "",
          });
          return;
        }

        const metrics: Partial<PerformanceMetrics> = {
          id: this.generateMetricId(),
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          pageLoad: 0,
          firstPaint: 0,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0,
        };

        // Page Load Time - Use modern Navigation Timing API
        try {
          if (performance.getEntriesByType) {
            const navigationEntries = performance.getEntriesByType(
              "navigation"
            ) as PerformanceNavigationTiming[];
            if (navigationEntries.length > 0) {
              const nav = navigationEntries[0];
              metrics.pageLoad = nav.loadEventEnd - nav.fetchStart;
            }
          } else if (performance.timing) {
            // Fallback to deprecated API
            metrics.pageLoad =
              performance.timing.loadEventEnd -
              performance.timing.navigationStart;
          }
        } catch (error) {
          console.warn("Failed to collect page load metrics:", error);
        }

        // Core Web Vitals - with error handling
        if ("PerformanceObserver" in window) {
          try {
            // First Paint
            const paintObserver = new PerformanceObserver((list) => {
              try {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                  if (entry.name === "first-paint") {
                    metrics.firstPaint = entry.startTime;
                  }
                  if (entry.name === "first-contentful-paint") {
                    metrics.firstContentfulPaint = entry.startTime;
                  }
                });
              } catch (error) {
                console.warn("Paint observer error:", error);
              }
            });
            paintObserver.observe({ entryTypes: ["paint"] });

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
              try {
                const entries = list.getEntries();
                if (entries.length > 0) {
                  const lastEntry = entries[entries.length - 1];
                  metrics.largestContentfulPaint = lastEntry.startTime;
                }
              } catch (error) {
                console.warn("LCP observer error:", error);
              }
            });
            lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

            // Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((list) => {
              try {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                  const layoutShiftEntry = entry as PerformanceEntry & {
                    hadRecentInput?: boolean;
                    value: number;
                  };
                  if (!layoutShiftEntry.hadRecentInput) {
                    clsValue += layoutShiftEntry.value;
                  }
                }
                metrics.cumulativeLayoutShift = clsValue;
              } catch (error) {
                console.warn("CLS observer error:", error);
              }
            });
            clsObserver.observe({ entryTypes: ["layout-shift"] });

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
              try {
                const entries = list.getEntries();
                if (entries.length > 0) {
                  const firstInput = entries[0] as PerformanceEntry & {
                    processingStart: number;
                  };
                  metrics.firstInputDelay =
                    firstInput.processingStart - firstInput.startTime;
                }
              } catch (error) {
                console.warn("FID observer error:", error);
              }
            });
            fidObserver.observe({ entryTypes: ["first-input"] });

            // Disconnect observers after timeout to prevent memory leaks
            setTimeout(() => {
              try {
                paintObserver.disconnect();
                lcpObserver.disconnect();
                clsObserver.disconnect();
                fidObserver.disconnect();
              } catch (error) {
                console.warn("Observer disconnect error:", error);
              }
            }, 4000);
          } catch (error) {
            console.warn("PerformanceObserver not supported or failed:", error);
          }
        }

        // Memory Usage (if available)
        try {
          if ("memory" in performance) {
            const perfWithMemory = performance as Performance & {
              memory?: { usedJSHeapSize: number };
            };
            metrics.memoryUsage = perfWithMemory.memory?.usedJSHeapSize;
          }
        } catch (error) {
          console.warn("Memory usage collection failed:", error);
        }

        // Wait for all metrics to be collected, then resolve
        setTimeout(() => {
          resolve(metrics as PerformanceMetrics);
        }, 3000);
      } catch (error) {
        console.error("Performance metrics collection failed:", error);
        // Return default metrics on error
        resolve({
          id: this.generateMetricId(),
          timestamp: Date.now(),
          pageLoad: 0,
          firstPaint: 0,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0,
          url: typeof window !== "undefined" ? window.location.href : "",
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
        });
      }
    });
  }

  /**
   * Analyze performance against budget
   * SRP: Performance analysis ONLY
   */
  static analyzePerformance(metrics: PerformanceMetrics): {
    score: number;
    violations: string[];
    recommendations: string[];
  } {
    const violations: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check against budget
    if (metrics.pageLoad > this.PERFORMANCE_BUDGET.pageLoad) {
      violations.push(
        `Page Load: ${metrics.pageLoad}ms (budget: ${this.PERFORMANCE_BUDGET.pageLoad}ms)`
      );
      recommendations.push("Optimize bundle size and implement code splitting");
      score -= 15;
    }

    if (
      metrics.firstContentfulPaint >
      this.PERFORMANCE_BUDGET.firstContentfulPaint
    ) {
      violations.push(
        `FCP: ${metrics.firstContentfulPaint}ms (budget: ${this.PERFORMANCE_BUDGET.firstContentfulPaint}ms)`
      );
      recommendations.push("Implement SSR pre-rendering for critical content");
      score -= 10;
    }

    if (
      metrics.largestContentfulPaint >
      this.PERFORMANCE_BUDGET.largestContentfulPaint
    ) {
      violations.push(
        `LCP: ${metrics.largestContentfulPaint}ms (budget: ${this.PERFORMANCE_BUDGET.largestContentfulPaint}ms)`
      );
      recommendations.push("Optimize images and critical rendering path");
      score -= 15;
    }

    if (
      metrics.cumulativeLayoutShift >
      this.PERFORMANCE_BUDGET.cumulativeLayoutShift
    ) {
      violations.push(
        `CLS: ${metrics.cumulativeLayoutShift} (budget: ${this.PERFORMANCE_BUDGET.cumulativeLayoutShift})`
      );
      recommendations.push("Add explicit dimensions to images and containers");
      score -= 10;
    }

    if (metrics.firstInputDelay > this.PERFORMANCE_BUDGET.firstInputDelay) {
      violations.push(
        `FID: ${metrics.firstInputDelay}ms (budget: ${this.PERFORMANCE_BUDGET.firstInputDelay}ms)`
      );
      recommendations.push(
        "Reduce main thread blocking and optimize JavaScript execution"
      );
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      violations,
      recommendations,
    };
  }

  /**
   * Generate unique metric ID
   * SRP: ID generation ONLY
   */
  private static generateMetricId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log performance metrics for monitoring
   * SRP: Logging ONLY
   */
  static logMetrics(metrics: PerformanceMetrics): void {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.group("🚀 Performance Metrics");
      // eslint-disable-next-line no-console
      console.info(
        "Memory Usage:",
        metrics.memoryUsage
          ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`
          : "N/A"
      );
      // eslint-disable-next-line no-console
      console.groupEnd();

      // Analyze and log recommendations
      const analysis = this.analyzePerformance(metrics);
      if (analysis.violations.length > 0) {
        // eslint-disable-next-line no-console
        console.group("⚠️ Performance Violations");
        analysis.violations.forEach((violation) => console.warn(violation));
        // eslint-disable-next-line no-console
        console.groupEnd();

        // eslint-disable-next-line no-console
        console.group("💡 Recommendations");
        // eslint-disable-next-line no-console
        console.groupEnd();
      }
    }
  }
}

/**
 * Performance Budget Checker
 * SRP: Budget validation ONLY
 */
export class PerformanceBudgetChecker {
  /**
   * Check if current metrics meet performance budget
   */
  static checkBudget(metrics: PerformanceMetrics): {
    isWithinBudget: boolean;
    budgetScore: number;
    criticalViolations: string[];
  } {
    const analysis = PerformanceMonitor.analyzePerformance(metrics);
    const criticalViolations = analysis.violations.filter(
      (violation) =>
        violation.includes("Page Load") || violation.includes("LCP")
    );

    return {
      isWithinBudget: analysis.score >= 80,
      budgetScore: analysis.score,
      criticalViolations,
    };
  }
}

/**
 * Performance Reporter for production monitoring
 * SRP: Report generation ONLY
 */
export class PerformanceReporter {
  /**
   * Generate performance report for monitoring dashboard
   */
  static generateReport(metrics: PerformanceMetrics[]): {
    averageMetrics: PerformanceMetrics;
    worstMetrics: PerformanceMetrics;
    budgetCompliance: number;
    trends: Record<string, number>;
  } {
    if (metrics.length === 0) {
      throw new Error("No metrics available for report generation");
    }

    // Calculate averages
    const averageMetrics: PerformanceMetrics = {
      id: "average",
      timestamp: Date.now(),
      pageLoad:
        metrics.reduce((sum, m) => sum + m.pageLoad, 0) / metrics.length,
      firstPaint:
        metrics.reduce((sum, m) => sum + m.firstPaint, 0) / metrics.length,
      firstContentfulPaint:
        metrics.reduce((sum, m) => sum + m.firstContentfulPaint, 0) /
        metrics.length,
      largestContentfulPaint:
        metrics.reduce((sum, m) => sum + m.largestContentfulPaint, 0) /
        metrics.length,
      cumulativeLayoutShift:
        metrics.reduce((sum, m) => sum + m.cumulativeLayoutShift, 0) /
        metrics.length,
      firstInputDelay:
        metrics.reduce((sum, m) => sum + m.firstInputDelay, 0) / metrics.length,
      memoryUsage:
        metrics.reduce((sum, m) => sum + (m.memoryUsage || 0), 0) /
        metrics.length,
      url: "aggregate",
      userAgent: "aggregate",
    };

    // Find worst performing metrics
    const worstMetrics = metrics.reduce((worst, current) => {
      return current.pageLoad > worst.pageLoad ? current : worst;
    });

    // Calculate budget compliance
    const budgetCompliance =
      metrics
        .map((m) => PerformanceMonitor.analyzePerformance(m).score)
        .reduce((sum, score) => sum + score, 0) / metrics.length;

    // Calculate trends (simplified)
    const firstMemory = metrics[0].memoryUsage;
    const lastMemory = metrics[metrics.length - 1].memoryUsage;

    const trends = {
      pageLoadTrend:
        metrics.length > 1
          ? ((metrics[metrics.length - 1].pageLoad - metrics[0].pageLoad) /
              metrics[0].pageLoad) *
            100
          : 0,
      memoryTrend:
        metrics.length > 1 && firstMemory && lastMemory
          ? ((lastMemory - firstMemory) / firstMemory) * 100
          : 0,
    };

    return {
      averageMetrics,
      worstMetrics,
      budgetCompliance,
      trends,
    };
  }
}
