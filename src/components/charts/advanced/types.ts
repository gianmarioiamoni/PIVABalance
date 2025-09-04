/**
 * Advanced Chart Types
 *
 * SRP: Defines only advanced chart interfaces and types
 */

export interface DrillDownLevel {
  id: string;
  name: string;
  data: Record<string, unknown>[];
  parentId?: string;
  level: number;
}

export interface ChartDrillDownState {
  currentLevel: number;
  levels: DrillDownLevel[];
  breadcrumbs: { id: string; name: string }[];
  canDrillDown: boolean;
  canDrillUp: boolean;
}

export interface InteractiveChartConfig {
  enableDrillDown: boolean;
  enableZoom: boolean;
  enablePan: boolean;
  enableTooltip: boolean;
  enableLegendToggle: boolean;
  enableDataSelection: boolean;
  enableExport: boolean;
  enableFullscreen: boolean;
}

export interface ChartExportOptions {
  format: "png" | "svg" | "pdf" | "excel";
  quality?: "low" | "medium" | "high";
  includeData?: boolean;
  filename?: string;
}

export interface AdvancedChartProps {
  data: Record<string, unknown>[];
  config: InteractiveChartConfig;
  drillDownConfig?: {
    levels: DrillDownLevel[];
    initialLevel?: number;
  };
  exportOptions?: ChartExportOptions;
  onDrillDown?: (levelId: string, dataPoint: Record<string, unknown>) => void;
  onDrillUp?: (levelId: string) => void;
  onExport?: (options: ChartExportOptions) => Promise<void>;
  onDataSelect?: (selectedData: Record<string, unknown>[]) => void;
  className?: string;
}

export interface ChartAnalyticsData {
  primary: Record<string, unknown>[];
  secondary?: Record<string, unknown>[];
  comparison?: Record<string, unknown>[];
  metadata: {
    period: string;
    currency: string;
    lastUpdated: Date;
    dataSource: string;
  };
}

export interface KPIMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  target?: number;
  unit: string;
  trend: "up" | "down" | "stable";
  trendPercentage: number;
  status: "good" | "warning" | "critical";
  description?: string;
}

export interface BusinessInsight {
  id: string;
  type: "opportunity" | "risk" | "trend" | "anomaly";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number; // 0-100
  actionable: boolean;
  suggestedActions?: string[];
  dataPoints?: Record<string, unknown>[];
}
