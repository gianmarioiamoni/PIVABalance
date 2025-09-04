/**
 * Chart Pre-rendering System Barrel Export
 *
 * Server-side chart generation con caching e progressive enhancement
 */

// =============================================================================
// SVG RENDERERS
// =============================================================================
export {
  SVGCashFlowChart,
  createLinearScale,
  formatValue,
} from "./SVGChartRenderer";
export { SVGTaxBreakdownChart } from "./SVGTaxBreakdownChart";
export { SVGTrendChart } from "./SVGTrendChart";

// =============================================================================
// PRE-RENDERING SYSTEM
// =============================================================================
export {
  PrerenderedChart,
  QuickChartPreview,
  generateCacheKey,
  getCachedChart,
  setCachedChart,
  clearExpiredCache,
  getCacheStats,
  DEFAULT_PRERENDER_CONFIG,
} from "./ChartPrerenderer";

// =============================================================================
// SSR INTEGRATION
// =============================================================================
export {
  SSRChartWrapper,
  DashboardChart,
  ReportChart,
  EmailChart,
} from "./SSRChartWrapper";

// =============================================================================
// TYPES
// =============================================================================
export type { SVGChartConfig } from "./SVGChartRenderer";
export type {
  ChartDataType,
  PrerenderConfig,
  PrerenderedChartProps,
} from "./ChartPrerenderer";
export type { SSRChartWrapperProps } from "./SSRChartWrapper";
