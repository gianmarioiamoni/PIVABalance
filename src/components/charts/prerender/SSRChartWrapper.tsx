/**
 * SSR Chart Wrapper with Pre-rendering
 * 
 * Integra server-side pre-rendering con architettura SSR/CSR esistente
 * Progressive enhancement: Static SVG → Interactive Chart
 */

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ServerChartContainer } from '../server';
import { PrerenderedChart, QuickChartPreview } from './ChartPrerenderer';
import type { ChartDataType, PrerenderConfig } from './ChartPrerenderer';
import type { ChartType } from '../hybrid/ChartWrapper';
import type { CashFlowDataPoint, TrendDataPoint, TaxBreakdownDataPoint } from '../types';

// Dynamic import del chart wrapper interattivo
const InteractiveChartWrapper = dynamic(
    () => import('../hybrid/ChartWrapper'),
    {
        ssr: false,
        loading: () => null // No loading, usa prerendered come fallback
    }
);

export interface SSRChartWrapperProps {
    type: ChartType;
    data: Record<string, unknown>[];
    title?: string;
    subtitle?: string;
    className?: string;
    enablePrerendering?: boolean;
    enableInteractive?: boolean;
    prerenderConfig?: PrerenderConfig;
    // Props specifiche per charts
    currentYear?: number;
    previousYear?: number;
    showPercentages?: boolean;
    showValues?: boolean;
}

/**
 * SSR Chart Wrapper con Pre-rendering
 * 
 * Strategia Progressive Enhancement:
 * 1. Server-side: Layout + SVG statico
 * 2. Client-side: Upgrade a chart interattivo
 * 3. Fallback: Mantiene SVG se JS non disponibile
 */
export const SSRChartWrapper: React.FC<SSRChartWrapperProps> = ({
    type,
    data,
    title,
    subtitle,
    className = '',
    enablePrerendering = true,
    enableInteractive = true,
    prerenderConfig = {},
    ...chartProps
}) => {

    // Converti dati al formato chart specifico
    const getChartData = (): ChartDataType => {
        switch (type) {
            case 'cashflow':
                return { type: 'cashflow', data: data as CashFlowDataPoint[] };
            case 'trend':
                return { type: 'trend', data: data as TrendDataPoint[] };
            case 'tax':
                return { type: 'tax', data: data as TaxBreakdownDataPoint[] };
            default:
                return { type: 'cashflow', data: data as CashFlowDataPoint[] };
        }
    };

    const chartData = getChartData();

    return (
        <ServerChartContainer
            title={title}
            subtitle={subtitle}
            className={className}
        >
            {enablePrerendering ? (
                <div className="chart-progressive-wrapper">
                    {/* Static SVG Preview (Server-side) */}
                    <div className="chart-static-layer">
                        <PrerenderedChart
                            chartData={chartData}
                            title={title}
                            prerenderConfig={{
                                quality: 'medium',
                                enableCaching: true,
                                cacheTTL: 3600,
                                ...prerenderConfig
                            }}
                        />
                    </div>

                    {/* Interactive Layer (Client-side) */}
                    {enableInteractive && (
                        <div className="chart-interactive-layer">
                            <Suspense fallback={null}>
                                <InteractiveEnhancement
                                    type={type}
                                    data={data}
                                    title={title}
                                    subtitle={subtitle}
                                    chartProps={chartProps}
                                />
                            </Suspense>
                        </div>
                    )}

                    {/* CSS per progressive enhancement */}
                    <style jsx>{`
            .chart-progressive-wrapper {
              position: relative;
            }
            
            .chart-static-layer {
              position: relative;
              z-index: 1;
            }
            
            .chart-interactive-layer {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 2;
              opacity: 0;
              transition: opacity 0.3s ease-in-out;
            }
            
            .chart-interactive-layer.loaded {
              opacity: 1;
            }
            
            /* Nascondi static quando interactive è caricato */
            .chart-progressive-wrapper:has(.chart-interactive-layer.loaded) .chart-static-layer {
              opacity: 0;
            }
          `}</style>
                </div>
            ) : (
                /* Solo interactive chart se prerendering disabilitato */
                enableInteractive && (
                    <Suspense fallback={
                        <QuickChartPreview
                            type={type as 'cashflow' | 'trend' | 'tax'}
                            data={data}
                            title={title}
                        />
                    }>
                        <InteractiveChartWrapper
                            type={type}
                            data={data}
                            title={title}
                            subtitle={subtitle}
                            {...chartProps}
                        />
                    </Suspense>
                )
            )}
        </ServerChartContainer>
    );
};

/**
 * Interactive Enhancement Component
 * Si carica dopo il prerendered e lo sostituisce
 */
const InteractiveEnhancement: React.FC<{
    type: ChartType;
    data: Record<string, unknown>[];
    title?: string;
    subtitle?: string;
    chartProps: Record<string, unknown>;
}> = ({ type, data, title, subtitle, chartProps }) => {
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
        // Simula caricamento del chart interattivo
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`interactive-chart ${isLoaded ? 'loaded' : ''}`}>
            <InteractiveChartWrapper
                type={type}
                data={data}
                title={title}
                subtitle={subtitle}
                {...chartProps}
            />
        </div>
    );
};

// =============================================================================
// SPECIALIZED WRAPPERS
// =============================================================================

/**
 * Dashboard Chart con pre-rendering ottimizzato
 */
export const DashboardChart: React.FC<Omit<SSRChartWrapperProps, 'enablePrerendering'>> = (props) => (
    <SSRChartWrapper
        {...props}
        enablePrerendering={true}
        prerenderConfig={{
            quality: 'medium',
            enableCaching: true,
            cacheTTL: 1800, // 30 minuti per dashboard
        }}
    />
);

/**
 * Report Chart con alta qualità
 */
export const ReportChart: React.FC<Omit<SSRChartWrapperProps, 'prerenderConfig'>> = (props) => (
    <SSRChartWrapper
        {...props}
        prerenderConfig={{
            quality: 'high',
            enableCaching: true,
            cacheTTL: 7200, // 2 ore per report
        }}
    />
);

/**
 * Quick Preview per email/PDF
 */
export const EmailChart: React.FC<{
    type: ChartType;
    data: Record<string, unknown>[];
    title?: string;
}> = ({ type, data, title }) => (
    <SSRChartWrapper
        type={type}
        data={data}
        title={title}
        enableInteractive={false} // Solo static per email
        prerenderConfig={{
            quality: 'low',
            enableCaching: true,
            cacheTTL: 300, // 5 minuti
        }}
    />
);

export default SSRChartWrapper;
