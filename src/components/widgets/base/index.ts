/**
 * Widget Base Components - Barrel Export
 *
 * SRP: Handles only widget base component exports
 * Organized by component responsibility
 */

// Core Base Components
export { WidgetContainer } from "./WidgetContainer";
export { default as WidgetHeader } from "./WidgetHeader";
export { WidgetSkeleton } from "./WidgetSkeleton";

// Types and Interfaces
export type {
  WidgetSize,
  WidgetType,
  WidgetPosition,
  WidgetConfig,
  WidgetData,
  BaseWidgetProps,
  WidgetRegistryEntry,
  DashboardLayout,
  WidgetContextType,
  UseWidgetResult,
  WidgetTheme,
} from "./types";

// Component-specific Props
export type { WidgetContainerProps } from "./WidgetContainer";
export type { WidgetHeaderProps } from "./WidgetHeader";
export type { WidgetSkeletonProps } from "./WidgetSkeleton";
