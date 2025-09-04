/**
 * Widget Registry System
 *
 * SRP: Handles ONLY widget registration and discovery
 * Central registry for all available widgets
 */

import { WidgetRegistryEntry, WidgetSize } from "../base/types";
import { RevenueWidget } from "../financial/RevenueWidget";
import { CostWidget } from "../financial/CostWidget";
import { TaxWidget } from "../financial/TaxWidget";
import { ProfitWidget } from "../financial/ProfitWidget";
import { CashFlowWidget } from "@/components/dashboard/CashFlowWidget";
import {
  DollarSign,
  ShoppingCart,
  Calculator,
  BarChart3,
  TrendingUp,
} from "lucide-react";

/**
 * Widget Registry Database
 * SRP: Handles only widget metadata storage
 */
const WIDGET_REGISTRY: WidgetRegistryEntry[] = [
  // Financial Widgets
  {
    id: "revenue-widget",
    name: "Analisi Ricavi",
    description: "Monitora ricavi mensili, trend e proiezioni",
    type: "financial",
    component: RevenueWidget,
    defaultSize: "medium",
    defaultConfig: {
      title: "Ricavi",
      refreshInterval: 300, // 5 minutes
      customSettings: {
        showProjections: true,
        showTargets: true,
        monthsToAnalyze: 12,
      },
    },
    supportedSizes: ["small", "medium", "large"],
    category: "Analisi Finanziaria",
    icon: DollarSign,
  },

  {
    id: "cost-widget",
    name: "Analisi Costi",
    description: "Traccia costi per categoria e deducibilità",
    type: "financial",
    component: CostWidget,
    defaultSize: "medium",
    defaultConfig: {
      title: "Costi",
      refreshInterval: 300,
      customSettings: {
        showCategories: true,
        showDeductible: true,
        monthsToAnalyze: 12,
      },
    },
    supportedSizes: ["small", "medium", "large"],
    category: "Analisi Finanziaria",
    icon: ShoppingCart,
  },

  {
    id: "tax-widget",
    name: "Situazione Fiscale",
    description: "Calcoli fiscali e scadenze pagamenti",
    type: "financial",
    component: TaxWidget,
    defaultSize: "large",
    defaultConfig: {
      title: "Tasse e Contributi",
      refreshInterval: 600, // 10 minutes
      customSettings: {
        showNextPayments: true,
        showSavings: true,
        maxPayments: 5,
      },
    },
    supportedSizes: ["medium", "large", "full"],
    category: "Fiscale",
    icon: Calculator,
  },

  {
    id: "profit-widget",
    name: "Analisi Profittabilità",
    description: "Margini, health score e raccomandazioni business",
    type: "financial",
    component: ProfitWidget,
    defaultSize: "large",
    defaultConfig: {
      title: "Profittabilità",
      refreshInterval: 300,
      customSettings: {
        showBenchmarks: true,
        showRecommendations: true,
        showHealthScore: true,
        monthsToAnalyze: 12,
      },
    },
    supportedSizes: ["medium", "large", "full"],
    category: "Analisi Business",
    icon: BarChart3,
  },

  {
    id: "cashflow-widget",
    name: "Cash Flow",
    description: "Flusso di cassa con grafici e insights",
    type: "chart",
    component: CashFlowWidget,
    defaultSize: "full",
    defaultConfig: {
      title: "Cash Flow",
      refreshInterval: 300,
      customSettings: {
        months: 6,
        showHeader: false,
      },
    },
    supportedSizes: ["large", "full"],
    category: "Grafici",
    icon: TrendingUp,
  },
];

/**
 * Widget Registry Service
 * SRP: Handles only widget registry operations
 */
export class WidgetRegistry {
  /**
   * Get all available widgets
   */
  static getAll(): WidgetRegistryEntry[] {
    return [...WIDGET_REGISTRY];
  }

  /**
   * Get widget by ID
   */
  static getById(id: string): WidgetRegistryEntry | undefined {
    return WIDGET_REGISTRY.find((widget) => widget.id === id);
  }

  /**
   * Get widgets by type
   */
  static getByType(type: string): WidgetRegistryEntry[] {
    return WIDGET_REGISTRY.filter((widget) => widget.type === type);
  }

  /**
   * Get widgets by category
   */
  static getByCategory(category: string): WidgetRegistryEntry[] {
    return WIDGET_REGISTRY.filter((widget) => widget.category === category);
  }

  /**
   * Get supported sizes for widget
   */
  static getSupportedSizes(widgetId: string): WidgetSize[] {
    const widget = this.getById(widgetId);
    return widget?.supportedSizes || [];
  }

  /**
   * Check if widget supports size
   */
  static supportsSize(widgetId: string, size: WidgetSize): boolean {
    const supportedSizes = this.getSupportedSizes(widgetId);
    return supportedSizes.includes(size);
  }

  /**
   * Get categories list
   */
  static getCategories(): string[] {
    const categories = new Set(
      WIDGET_REGISTRY.map((widget) => widget.category)
    );
    return Array.from(categories).sort();
  }

  /**
   * Search widgets by name or description
   */
  static search(query: string): WidgetRegistryEntry[] {
    const lowerQuery = query.toLowerCase();
    return WIDGET_REGISTRY.filter(
      (widget) =>
        widget.name.toLowerCase().includes(lowerQuery) ||
        widget.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get default layout for new users
   */
  static getDefaultLayout(): {
    widgetId: string;
    position: { x: number; y: number; w: number; h: number };
  }[] {
    return [
      {
        widgetId: "cashflow-widget",
        position: { x: 0, y: 0, w: 12, h: 2 },
      },
      {
        widgetId: "revenue-widget",
        position: { x: 0, y: 2, w: 3, h: 2 },
      },
      {
        widgetId: "cost-widget",
        position: { x: 3, y: 2, w: 3, h: 2 },
      },
      {
        widgetId: "profit-widget",
        position: { x: 6, y: 2, w: 3, h: 2 },
      },
      {
        widgetId: "tax-widget",
        position: { x: 9, y: 2, w: 3, h: 2 },
      },
    ];
  }
}

export default WidgetRegistry;
