/**
 * Chart Components Type Definitions
 * Following SOLID principles with clear interfaces
 */

export interface ChartDataPoint extends Record<string, unknown> {
  date: string;
  value: number;
  label?: string;
  color?: string;
}

export interface CashFlowDataPoint extends Record<string, unknown> {
  month: string;
  income: number;
  expenses: number;
  net: number;
  date: Date;
}

export interface TrendDataPoint extends Record<string, unknown> {
  period: string;
  value: number;
  previous?: number;
  growth?: number;
  date: Date;
}

export interface TaxBreakdownDataPoint extends Record<string, unknown> {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface YearComparisonDataPoint extends Record<string, unknown> {
  month: string;
  currentYear: number;
  previousYear: number;
  monthNumber: number;
}

export interface ChartConfig {
  width?: number;
  height?: number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  responsive?: boolean;
  colors?: string[];
}

export interface ChartProps<T = unknown> {
  data: T[];
  config?: ChartConfig;
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
}

export type ChartPeriod = "month" | "quarter" | "year";
export type ChartType = "line" | "bar" | "area" | "pie" | "donut";

export interface FreelanceMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  taxesPaid: number;
  averageInvoice: number;
  clientsCount: number;
  daysToPayment: number;
  cashFlow: CashFlowDataPoint[];
}
