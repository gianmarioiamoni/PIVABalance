/**
 * Dashboard Components
 * Exports for dashboard-related components following client/server separation
 */

// Main components
export { Dashboard } from "./Dashboard"; // Client container
export { DashboardView } from "./DashboardView"; // Server presentational

// Sub-components
export { StatCard } from "./StatCard"; // Server component
export { QuickActions } from "./QuickActions"; // Client component
export { RecentActivities } from "./RecentActivities"; // Server component
export { CashFlowWidget } from "./CashFlowWidget"; // Client component with charts

// New Customizable Dashboard System (Fase 3)
export { CustomizableDashboard } from "./CustomizableDashboard"; // Client interactive
export { WidgetLibrary } from "./WidgetLibrary"; // Client modal

// SSR/CSR Hybrid Components
export { DashboardSSR } from "./server/DashboardSSR"; // Server skeleton
export { DashboardHybrid } from "./hybrid/DashboardHybrid"; // Progressive enhancement

// Types
export type { CustomizableDashboardProps } from "./CustomizableDashboard";
export type { WidgetLibraryProps } from "./WidgetLibrary";
export type { DashboardSSRProps } from "./server/DashboardSSR";
export type { DashboardHybridProps } from "./hybrid/DashboardHybrid";
