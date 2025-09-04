/**
 * Mobile Lazy Chart (Hybrid SSR/CSR)
 * 
 * Progressive enhancement strategy for mobile charts
 * Server renders skeleton, client hydrates with full functionality
 */

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MobileChartSkeleton } from '../server';
import type { MobileChartContainerProps } from '../MobileChartContainer';

// Dynamic imports for client-side components (SRP-compliant versions)
const DynamicMobileChartContainer = dynamic(
  () => import('../MobileChartContainer').then(mod => ({ default: mod.MobileChartContainer })),
  {
    ssr: false, // Client-side only due to touch events
    loading: () => (
      <MobileChartSkeleton
        showControls={true}
        showIndicators={false}
        height={300}
      />
    )
  }
);

const DynamicMobileChartCarousel = dynamic(
  () => import('../MobileChartCarousel').then(mod => ({ default: mod.MobileChartCarousel })),
  {
    ssr: false, // Client-side only due to timers and touch events
    loading: () => (
      <MobileChartSkeleton
        showControls={true}
        showIndicators={true}
        height={300}
      />
    )
  }
);

export interface MobileLazyChartProps extends MobileChartContainerProps {
  mode?: 'container' | 'carousel';
  carouselProps?: Record<string, unknown>; // Generic props object
}

/**
 * Mobile Lazy Chart with Progressive Enhancement
 * 
 * Architecture:
 * 1. Server renders skeleton for immediate visual feedback
 * 2. Client hydrates with full interactivity
 * 3. Fallback to skeleton if client JS fails
 * 
 * Benefits:
 * - Immediate visual feedback (SSR skeleton)
 * - SEO-friendly structure
 * - Progressive enhancement
 * - Graceful degradation
 */
export const MobileLazyChart: React.FC<MobileLazyChartProps> = ({
  mode = 'container',
  carouselProps,
  title,
  subtitle,
  children,
  ...containerProps
}) => {
  // SEO-friendly metadata (server-rendered)
  const chartMetadata = {
    title: title || 'Grafico Mobile',
    description: subtitle || 'Visualizzazione dati ottimizzata per dispositivi mobili'
  };

  return (
    <div className="mobile-lazy-chart">
      {/* SEO Metadata (server-rendered) */}
      <div className="sr-only">
        <h2>{chartMetadata.title}</h2>
        <p>{chartMetadata.description}</p>
      </div>

      {/* Progressive Enhancement Wrapper */}
      <Suspense 
        fallback={
          <MobileChartSkeleton
            title={title}
            subtitle={subtitle}
            showControls={true}
            showIndicators={mode === 'carousel'}
            height={300}
          />
        }
      >
        {mode === 'carousel' ? (
          <DynamicMobileChartCarousel
            charts={[]} // Default empty charts array
            {...carouselProps}
            className="mobile-chart-enhanced"
          />
        ) : (
          <DynamicMobileChartContainer
            title={title}
            subtitle={subtitle}
            {...containerProps}
            className="mobile-chart-enhanced"
          >
            {children}
          </DynamicMobileChartContainer>
        )}
      </Suspense>

      {/* Fallback for no-JS environments */}
      <noscript>
        <div className="mobile-chart-fallback bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {title || 'Grafico Non Disponibile'}
          </h3>
          <p className="text-gray-600 mb-4">
            {subtitle || 'JavaScript è richiesto per visualizzare questo grafico interattivo.'}
          </p>
          <div className="text-sm text-gray-500">
            Per una migliore esperienza, abilita JavaScript nel tuo browser.
          </div>
        </div>
      </noscript>
    </div>
  );
};

/**
 * Hook for mobile chart optimization detection
 * Server-safe version
 */
export const useMobileChartDetection = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return {
    isMobile: isHydrated ? isMobile : false, // SSR-safe default
    isHydrated
  };
};

export default MobileLazyChart;
