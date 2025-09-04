/**
 * Chart Components Barrel Export
 *
 * Organized by rendering strategy:
 * - Server: SSR-optimized components
 * - Client: Interactive components requiring DOM
 * - Hybrid: Best-of-both-worlds wrappers
 */

// =============================================================================
// MAIN CHART COMPONENTS (Client-Side)
// =============================================================================
export { default as CashFlowChart } from "./CashFlowChart";
export { default as MonthlyTrendChart } from "./MonthlyTrendChart";
export { default as TaxBreakdownChart } from "./TaxBreakdownChart";
export { default as YearComparisonChart } from "./YearComparisonChart";

// =============================================================================
// CLIENT-SIDE COMPONENTS
// =============================================================================
export * from "./client";

// =============================================================================
// SERVER-SIDE COMPONENTS (SSR Optimized)
// =============================================================================
export * from "./server";

// =============================================================================
// HYBRID COMPONENTS (SSR + CSR)
// =============================================================================
export * from "./hybrid";

// =============================================================================
// MOBILE COMPONENTS (Touch-Optimized)
// =============================================================================
export * from "./mobile";

// =============================================================================
// PRE-RENDERING SYSTEM (Static SVG Generation)
// =============================================================================
export * from "./prerender";

// =============================================================================
// ADVANCED CHARTS (Interactive & Business Intelligence)
// =============================================================================
export * from "./advanced";

// =============================================================================
// SUBCOMPONENTS & UTILITIES
// =============================================================================
export * from "./subcomponents";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================
export type {
  ChartDataPoint,
  CashFlowDataPoint,
  TrendDataPoint,
  TaxBreakdownDataPoint,
  YearComparisonDataPoint,
  ChartConfig,
  ChartProps,
  ChartPeriod,
  ChartType,
  FreelanceMetrics,
} from "./types";
