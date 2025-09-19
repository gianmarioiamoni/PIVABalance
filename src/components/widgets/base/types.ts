/**
 * Widget System Types
 *
 * Defines the foundation types for the customizable widget system
 * Following SRP: Each interface has a single, clear responsibility
 */

export type WidgetSize = "small" | "medium" | "large" | "full";
export type WidgetType = "financial" | "analytics" | "productivity" | "chart";
export type WidgetPosition = { x: number; y: number; w: number; h: number };

/**
 * Base Widget Configuration
 * SRP: Handles only widget configuration data
 */
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: WidgetPosition;
  isVisible: boolean;
  refreshInterval?: number; // seconds
  customSettings?: Record<string, unknown>;
}

/**
 * Widget Data Interface
 * SRP: Handles only widget data structure
 */
export interface WidgetData<T = Record<string, unknown>> {
  id: string;
  data: T | null;
  lastUpdated: Date;
  isLoading: boolean;
  error?: string;
}

/**
 * Widget Component Props
 * SRP: Handles only widget component interface
 */
export interface BaseWidgetProps {
  config: WidgetConfig;
  data?: WidgetData;
  isEditing?: boolean;
  onConfigChange?: (config: WidgetConfig) => void;
  onRemove?: (id: string) => void;
  onRefresh?: (id: string) => void;
  className?: string;
}

/**
 * Widget Registry Entry
 * SRP: Handles only widget registration metadata
 */
export interface WidgetRegistryEntry {
  id: string;
  name: string;
  description: string;
  type: WidgetType;
  component: React.ComponentType<BaseWidgetProps>;
  defaultSize: WidgetSize;
  defaultConfig: Partial<WidgetConfig>;
  supportedSizes: WidgetSize[];
  category: string;
  icon?: React.ComponentType<{ className?: string }>;
  preview?: string; // Preview image URL
}

/**
 * Dashboard Layout Configuration
 * SRP: Handles only layout persistence structure
 */
export interface DashboardLayout {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  widgets: WidgetConfig[];
  layoutSettings: {
    columns: number;
    rowHeight: number;
    margin: [number, number];
    containerPadding: [number, number];
    breakpoints: Record<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Widget Context Type
 * SRP: Handles only widget state management interface
 */
export interface WidgetContextType {
  widgets: WidgetConfig[];
  layout: DashboardLayout | null;
  isEditing: boolean;
  addWidget: (type: string, position?: Partial<WidgetPosition>) => void;
  removeWidget: (id: string) => void;
  updateWidget: (_id: string, updates: Partial<WidgetConfig>) => void;
  moveWidget: (_id: string, position: WidgetPosition) => void;
  saveLayout: () => Promise<void>;
  loadLayout: (layoutId?: string) => Promise<void>;
  toggleEditing: () => void;
  refreshWidget: (id: string) => void;
  refreshAll: () => void;
}

/**
 * Widget Hook Return Type
 * SRP: Handles only widget hook interface
 */
export interface UseWidgetResult<T = Record<string, unknown>> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  lastUpdated: Date | null;
}

/**
 * Widget Theme Configuration
 * SRP: Handles only widget theming
 */
export interface WidgetTheme {
  background: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}
