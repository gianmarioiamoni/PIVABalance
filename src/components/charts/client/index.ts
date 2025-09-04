/**
 * Client-Side Chart Components Barrel Export
 *
 * These components require client-side rendering due to:
 * - DOM interactions (Recharts)
 * - Event handlers (tooltips, interactions)
 * - Browser APIs (ResizeObserver, etc.)
 */

export { ChartContainer } from "./ChartContainer";
export { ChartLegend } from "./ChartLegend";
export {
  ChartTooltip,
  currencyTooltipFormatter,
  dateTooltipLabelFormatter,
} from "./ChartTooltip";

export type { ChartContainerProps } from "./ChartContainer";
export type { ChartLegendProps, LegendItem } from "./ChartLegend";
export type { ChartTooltipProps } from "./ChartTooltip";
