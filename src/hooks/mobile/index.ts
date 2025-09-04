/**
 * Mobile Hooks Barrel Export
 * 
 * Client-side hooks for mobile interactions and optimizations
 * All hooks follow Single Responsibility Principle
 */

// =============================================================================
// INTERACTION HOOKS
// =============================================================================
export { useTouch } from './useTouch';
export { usePinchZoom } from './usePinchZoom';
export { useFullscreen } from './useFullscreen';

// =============================================================================
// NAVIGATION HOOKS
// =============================================================================
export { useCarouselNavigation } from './useCarouselNavigation';
export { useAutoAdvance } from './useAutoAdvance';

// =============================================================================
// OPTIMIZATION HOOKS
// =============================================================================
export { useScreenSize } from './useScreenSize';
export { useMobileFormatters } from './useMobileFormatters';
export { useMobileChartConfig } from './useMobileChartConfig';
export { useMobileDataOptimizer } from './useMobileDataOptimizer';

// =============================================================================
// TYPE EXPORTS
// =============================================================================
export type {
  TouchPoint,
  SwipeConfig,
  SwipeCallbacks,
  UseTouchResult
} from './useTouch';

export type {
  ZoomConfig,
  UsePinchZoomResult
} from './usePinchZoom';

export type {
  FullscreenConfig,
  UseFullscreenResult
} from './useFullscreen';

export type {
  NavigationConfig,
  UseCarouselNavigationResult
} from './useCarouselNavigation';

export type {
  AutoAdvanceConfig,
  UseAutoAdvanceResult
} from './useAutoAdvance';

export type {
  ScreenSize,
  ScreenBreakpoints,
  UseScreenSizeResult
} from './useScreenSize';

export type {
  MobileFormatters,
  UseMobileFormattersResult
} from './useMobileFormatters';

export type {
  MobileConfigOptions,
  UseMobileChartConfigResult
} from './useMobileChartConfig';

export type {
  DataOptimizationConfig,
  UseMobileDataOptimizerResult
} from './useMobileDataOptimizer';

export type { ChartType } from './useMobileChartConfig';
