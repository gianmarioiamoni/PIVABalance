/**
 * Mobile Chart Components Barrel Export
 * 
 * Mobile-optimized chart components with SSR/CSR hybrid architecture
 * 
 * Architecture:
 * - Client: Interactive components (require 'use client')
 * - Server: SSR-optimized skeletons and layouts
 * - Hybrid: Progressive enhancement wrappers
 */

// =============================================================================
// CLIENT COMPONENTS (Interactive, Touch-Enabled, SRP-Compliant)
// =============================================================================
export { MobileChartContainer } from './MobileChartContainer';
export { MobileChartCarousel } from './MobileChartCarousel';
export { MobileChartOptimizer, useMobileChartOptimization } from './MobileChartOptimizer';

// =============================================================================
// SERVER COMPONENTS (SSR-Optimized)
// =============================================================================
export * from './server';

// =============================================================================
// HYBRID COMPONENTS (Progressive Enhancement)
// =============================================================================
export * from './hybrid';

// =============================================================================
// TYPES
// =============================================================================
export type { MobileChartContainerProps } from './MobileChartContainer';
export type { 
  ChartCarouselItem,
  MobileChartCarouselProps
} from './MobileChartCarousel';
export type { MobileChartOptimizerProps } from './MobileChartOptimizer';
