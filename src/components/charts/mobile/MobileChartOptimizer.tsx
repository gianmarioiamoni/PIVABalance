/**
 * Mobile Chart Optimizer (SRP Refactored)
 * 
 * Single Responsibility: Compose mobile optimization hooks
 * All logic extracted to dedicated hooks
 */

'use client';

import React from 'react';
import {
  useScreenSize,
  useMobileFormatters,
  useMobileChartConfig,
  useMobileDataOptimizer,
  type ChartType,
  type ScreenSize
} from '../../../hooks/mobile';

export interface MobileChartOptimizerProps {
  chartType: ChartType;
  data: Record<string, unknown>[];
  originalConfig?: Record<string, unknown>;
  children: (optimizedProps: MobileOptimizedProps) => React.ReactNode;
}

export interface MobileOptimizedProps {
  config: Record<string, unknown>;
  data: Record<string, unknown>[];
  formatters: Record<string, (value: unknown) => string>;
  screenSize: ScreenSize;
  isMobile: boolean;
  optimizationStats: {
    originalCount: number;
    optimizedCount: number;
    reductionPercentage: number;
  };
}

/**
 * Mobile Chart Optimizer Component (SRP Compliant)
 * 
 * Single Responsibility: Compose and provide mobile optimizations
 * 
 * Features:
 * - Render prop pattern for flexibility
 * - Delegates all logic to specialized hooks
 * - Provides optimized data and config
 * - Clean composition interface
 */
export const MobileChartOptimizer: React.FC<MobileChartOptimizerProps> = ({
  chartType,
  data,
  originalConfig = {},
  children
}) => {
  // =============================================================================
  // HOOKS (Logic Delegation)
  // =============================================================================
  
  // Screen size detection
  const { screenSize, isMobile } = useScreenSize();

  // Mobile-optimized chart configuration
  const { mobileConfig } = useMobileChartConfig({
    chartType,
    screenSize,
    originalConfig
  });

  // Mobile-optimized data
  const {
    optimizedData,
    originalCount,
    optimizedCount,
    reductionPercentage
  } = useMobileDataOptimizer(data, {
    chartType,
    screenSize
  });

  // Mobile formatters
  const { formatters } = useMobileFormatters(screenSize);

  // =============================================================================
  // COMPUTED PROPS (Pure UI Logic)
  // =============================================================================
  
  const optimizedProps: MobileOptimizedProps = {
    config: mobileConfig as Record<string, unknown>,
    data: optimizedData,
    formatters: formatters as unknown as Record<string, (value: unknown) => string>,
    screenSize,
    isMobile,
    optimizationStats: {
      originalCount,
      optimizedCount,
      reductionPercentage
    }
  };

  // =============================================================================
  // UI RENDERING (Single Responsibility)
  // =============================================================================
  
  return (
    <div className="mobile-chart-optimizer">
      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <MobileOptimizationDebugInfo
          chartType={chartType}
          screenSize={screenSize}
          optimizationStats={optimizedProps.optimizationStats}
        />
      )}

      {/* Render optimized chart */}
      {children(optimizedProps)}
    </div>
  );
};

// =============================================================================
// SUB-COMPONENTS (Single Responsibility)
// =============================================================================

interface MobileOptimizationDebugInfoProps {
  chartType: ChartType;
  screenSize: ScreenSize;
  optimizationStats: {
    originalCount: number;
    optimizedCount: number;
    reductionPercentage: number;
  };
}

const MobileOptimizationDebugInfo: React.FC<MobileOptimizationDebugInfoProps> = ({
  chartType,
  screenSize,
  optimizationStats
}) => (
  <div className="mobile-debug-info fixed bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
    <div>📱 {screenSize} | 📊 {chartType}</div>
    <div>
      📉 {optimizationStats.originalCount} → {optimizationStats.optimizedCount} 
      ({optimizationStats.reductionPercentage}% reduction)
    </div>
  </div>
);

// =============================================================================
// HOOKS COMPOSITION (For Backward Compatibility)
// =============================================================================

/**
 * Backward compatibility hook that composes all mobile optimizations
 * @deprecated Use individual hooks for better SRP compliance
 */
export const useMobileChartOptimization = (props: {
  chartType: ChartType;
  data: Record<string, unknown>[];
  originalConfig?: Record<string, unknown>;
}) => {
  const { screenSize, isMobile } = useScreenSize();
  const { mobileConfig } = useMobileChartConfig({
    chartType: props.chartType,
    screenSize,
    originalConfig: props.originalConfig
  });
  const { optimizedData } = useMobileDataOptimizer(props.data, {
    chartType: props.chartType,
    screenSize
  });
  const { formatters } = useMobileFormatters(screenSize);

  return {
    isMobile,
    screenSize,
    config: mobileConfig,
    data: optimizedData,
    formatters
  };
};

export default MobileChartOptimizer;
