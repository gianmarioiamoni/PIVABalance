import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '../server';
import type { ChartType } from './ChartWrapper';

// Dynamic imports con SSR disabilitato per charts
const DynamicChartWrapper = dynamic(
    () => import('./ChartWrapper'),
    {
        ssr: false, // Charts necessitano DOM
        loading: () => (
            <ChartSkeleton
                height={400}
                showLegend={true}
                showHeader={true}
            />
        )
    }
);

export interface LazyChartProps<T = Record<string, unknown>> {
    type: ChartType;
    data: T[];
    title?: string;
    subtitle?: string;
    className?: string;
    [key: string]: unknown; // Props aggiuntive specifiche per charts
}

/**
 * Lazy Chart Component
 * 
 * Server Component wrapper per charts con lazy loading
 * 
 * Architettura:
 * 1. Server Component per metadata SEO
 * 2. Dynamic import del chart wrapper
 * 3. SSR skeleton per loading immediato
 * 4. Progressive enhancement
 * 
 * Benefici:
 * - Server-Side metadata e SEO
 * - Lazy loading per performance
 * - Smaller initial bundle
 * - Progressive loading experience
 */
export const LazyChart = <T = Record<string, unknown>>({
    type,
    data,
    title,
    subtitle,
    className,
    ...chartProps
}: LazyChartProps<T>) => {

    // Metadata SEO per il chart (server-side)
    const chartMetadata = {
        cashflow: {
            defaultTitle: 'Cash Flow Analysis',
            description: 'Analisi del flusso di cassa mensile',
            keywords: 'cash flow, entrate, uscite, fatturato'
        },
        trend: {
            defaultTitle: 'Monthly Trend Analysis',
            description: 'Analisi delle tendenze mensili',
            keywords: 'trend, crescita, performance, andamento'
        },
        tax: {
            defaultTitle: 'Tax Breakdown',
            description: 'Ripartizione delle imposte e contributi',
            keywords: 'tasse, imposte, contributi, fiscale'
        },
        comparison: {
            defaultTitle: 'Year Comparison',
            description: 'Confronto performance anno su anno',
            keywords: 'confronto, crescita, year over year'
        }
    };

    const metadata = chartMetadata[type];
    const finalTitle = title || metadata.defaultTitle;

    return (
        <div className={`chart-container ${className || ''}`}>
            {/* SEO Metadata (server-side) */}
            <div className="sr-only">
                <h2>{finalTitle}</h2>
                <p>{metadata.description}</p>
                <meta name="keywords" content={metadata.keywords} />
            </div>

            {/* Progressive Chart Loading */}
            <Suspense
                fallback={
                    <ChartSkeleton
                        height={400}
                        showLegend={type === 'tax' || type === 'comparison'}
                        showHeader={Boolean(finalTitle || subtitle)}
                    />
                }
            >
                <DynamicChartWrapper
                    type={type}
                    data={data as Record<string, unknown>[]}
                    title={finalTitle}
                    subtitle={subtitle}
                    className={className}
                    {...chartProps}
                />
            </Suspense>
        </div>
    );
};

export default LazyChart;
