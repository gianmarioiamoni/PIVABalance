/**
 * Financial Widgets - Barrel Export
 *
 * SRP: Handles only financial widget exports
 * Specialized widgets for financial data visualization
 */

// Financial Widget Components
export { RevenueWidget } from "./RevenueWidget";
export { CostWidget } from "./CostWidget";
export { TaxWidget } from "./TaxWidget";
export { ProfitWidget } from "./ProfitWidget";

// Widget Types
export type { RevenueWidgetProps, RevenueData } from "./RevenueWidget";
export type { CostWidgetProps, CostData } from "./CostWidget";
export type { TaxWidgetProps, TaxData } from "./TaxWidget";
export type { ProfitWidgetProps, ProfitData } from "./ProfitWidget";
