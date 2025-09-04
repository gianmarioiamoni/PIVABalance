/**
 * Mobile Chart Carousel (SRP Refactored)
 * 
 * Single Responsibility: UI rendering for chart carousel
 * All logic extracted to dedicated hooks
 */

'use client';

import React from 'react';
import { MobileChartContainer } from './MobileChartContainer';
import { 
  useCarouselNavigation,
  useAutoAdvance,
  useScreenSize,
  type ChartType
} from '../../../hooks/mobile';

export interface ChartCarouselItem {
  id: string;
  type: ChartType;
  title: string;
  subtitle?: string;
  data: Record<string, unknown>[];
  component: React.ReactNode;
}

export interface MobileChartCarouselProps {
  charts: ChartCarouselItem[];
  initialIndex?: number;
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
  showIndicators?: boolean;
  enableInfiniteLoop?: boolean;
  className?: string;
}

/**
 * Mobile Chart Carousel Component (SRP Compliant)
 * 
 * Single Responsibility: Render carousel UI
 * 
 * Features:
 * - Clean UI rendering only
 * - Delegates navigation to useCarouselNavigation
 * - Delegates auto-advance to useAutoAdvance
 * - Delegates responsive behavior to useScreenSize
 * - Composable carousel behaviors
 */
export const MobileChartCarousel: React.FC<MobileChartCarouselProps> = ({
  charts,
  initialIndex = 0,
  autoAdvance = false,
  autoAdvanceInterval = 5000,
  showIndicators = true,
  enableInfiniteLoop = true,
  className = ''
}) => {
  // =============================================================================
  // HOOKS (Logic Delegation)
  // =============================================================================
  
  // Navigation logic
  const {
    currentIndex,
    goToSlide,
    goToNext,
    goToPrevious,
    canGoNext,
    canGoPrevious,
    getVisibleIndices
  } = useCarouselNavigation({
    enableInfiniteLoop,
    totalItems: charts.length,
    initialIndex
  });

  // Auto-advance logic
  const {
    isAutoPlaying,
    handleUserInteraction
  } = useAutoAdvance(
    {
      enabled: autoAdvance,
      interval: autoAdvanceInterval,
      pauseOnInteraction: true,
      totalItems: charts.length
    },
    goToNext
  );

  // Screen size detection
  const { isMobile } = useScreenSize();

  // =============================================================================
  // COMPUTED VALUES (Pure UI Logic)
  // =============================================================================
  
  const visibleIndices = getVisibleIndices();
  const currentChart = charts[currentIndex];
  const hasMultipleCharts = charts.length > 1;

  // =============================================================================
  // EARLY RETURN (Error Boundary)
  // =============================================================================
  
  if (!charts.length) {
    return <EmptyCarouselState />;
  }

  // =============================================================================
  // UI RENDERING (Single Responsibility)
  // =============================================================================
  
  return (
    <div
      className={`mobile-chart-carousel relative ${className}`}
      onTouchStart={handleUserInteraction}
    >
      {/* Main Chart Container */}
      <MobileChartContainer
        title={currentChart.title}
        subtitle={currentChart.subtitle}
        enableSwipe={hasMultipleCharts}
        enableZoom={isMobile}
        enableFullscreen={isMobile}
        onSwipeLeft={canGoNext ? goToNext : undefined}
        onSwipeRight={canGoPrevious ? goToPrevious : undefined}
        className="min-h-[300px]"
      >
        <div className="chart-slide">
          {currentChart.component}
        </div>
      </MobileChartContainer>

      {/* Navigation Indicators */}
      {showIndicators && hasMultipleCharts && (
        <CarouselIndicators
          charts={charts}
          currentIndex={currentIndex}
          onGoToSlide={(index) => {
            goToSlide(index);
            handleUserInteraction();
          }}
        />
      )}

      {/* Chart Info Bar */}
      <CarouselInfoBar
        currentChart={currentChart}
        currentIndex={currentIndex}
        totalCharts={charts.length}
        isAutoPlaying={isAutoPlaying}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
      />

      {/* Preload Adjacent Charts (Performance Optimization) */}
      <PreloadAdjacentCharts
        charts={charts}
        visibleIndices={visibleIndices}
        currentIndex={currentIndex}
      />
    </div>
  );
};

// =============================================================================
// SUB-COMPONENTS (Single Responsibility Each)
// =============================================================================

const EmptyCarouselState: React.FC = () => (
  <div className="mobile-chart-carousel-empty p-8 text-center text-gray-500">
    <div className="mb-4">
      <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-700 mb-2">
      Nessun grafico disponibile
    </h3>
    <p className="text-sm text-gray-500">
      Aggiungi dei dati per visualizzare i grafici
    </p>
  </div>
);

interface CarouselIndicatorsProps {
  charts: ChartCarouselItem[];
  currentIndex: number;
  onGoToSlide: (index: number) => void;
}

const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  charts,
  currentIndex,
  onGoToSlide
}) => (
  <div className="carousel-indicators flex justify-center space-x-2 mt-4 px-4">
    {charts.map((chart, index) => (
      <button
        key={chart.id}
        onClick={() => onGoToSlide(index)}
        className={`
          indicator-dot w-2 h-2 rounded-full transition-all duration-200
          ${index === currentIndex
            ? 'bg-blue-500 w-6'
            : 'bg-gray-300 hover:bg-gray-400'
          }
        `}
        aria-label={`Go to chart ${index + 1}: ${chart.title}`}
      />
    ))}
  </div>
);

interface CarouselInfoBarProps {
  currentChart: ChartCarouselItem;
  currentIndex: number;
  totalCharts: number;
  isAutoPlaying: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const CarouselInfoBar: React.FC<CarouselInfoBarProps> = ({
  currentChart,
  currentIndex,
  totalCharts,
  isAutoPlaying,
  canGoNext,
  canGoPrevious
}) => (
  <div className="chart-info-bar bg-gray-50 px-4 py-3 border-t border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {currentChart.title}
        </h4>
        {currentChart.subtitle && (
          <p className="text-xs text-gray-600 truncate">
            {currentChart.subtitle}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        <span className="text-xs text-gray-500">
          {currentIndex + 1} di {totalCharts}
        </span>
        
        {isAutoPlaying && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600">Auto</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          {canGoPrevious && (
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
          )}
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
          {canGoNext && (
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
          )}
        </div>
      </div>
    </div>
  </div>
);

interface PreloadAdjacentChartsProps {
  charts: ChartCarouselItem[];
  visibleIndices: number[];
  currentIndex: number;
}

const PreloadAdjacentCharts: React.FC<PreloadAdjacentChartsProps> = ({
  charts,
  visibleIndices,
  currentIndex
}) => (
  <div className="sr-only" aria-hidden="true">
    {/* Preload adjacent charts for smooth swiping */}
    {visibleIndices
      .filter(index => index !== currentIndex)
      .map(index => (
        <div key={`preload-${charts[index]?.id}`}>
          {charts[index]?.component}
        </div>
      ))
    }
  </div>
);

export default MobileChartCarousel;
