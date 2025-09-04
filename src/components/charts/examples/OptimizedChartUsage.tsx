/**
 * Optimized Chart Usage Examples
 * 
 * Dimostra come utilizzare i charts con architettura SSR/CSR ottimizzata
 */

import React from 'react';
import { LazyChart, ChartSkeleton, ServerChartContainer } from '@/components/charts';
import type { CashFlowDataPoint, TrendDataPoint } from '@/components/charts';

// =============================================================================
// ESEMPIO 1: Server Component con Lazy Loading
// =============================================================================

interface DashboardChartsProps {
    cashFlowData: CashFlowDataPoint[];
    trendData: TrendDataPoint[];
}

/**
 * Server Component per dashboard charts
 * Ottimizzato per SEO e performance
 */
export const DashboardCharts: React.FC<DashboardChartsProps> = ({
    cashFlowData,
    trendData
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cash Flow Chart - SSR + Lazy Loading */}
            <LazyChart
                type="cashflow"
                data={cashFlowData}
                title="Analisi Cash Flow"
                subtitle="Entrate vs Uscite mensili"
                className="h-96"
            />

            {/* Trend Chart - SSR + Lazy Loading */}
            <LazyChart
                type="trend"
                data={trendData}
                title="Trend Performance"
                subtitle="Andamento crescita business"
                className="h-96"
            />
        </div>
    );
};

// =============================================================================
// ESEMPIO 2: Skeleton Loading per UX Immediata
// =============================================================================

export const ChartLoadingStates: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Skeleton per loading immediato */}
            <ServerChartContainer
                title="Cash Flow Analysis"
                subtitle="Loading chart data..."
            >
                <ChartSkeleton
                    height={400}
                    showLegend={true}
                    showHeader={false}
                />
            </ServerChartContainer>

            {/* Multiple chart skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ChartSkeleton height={300} showLegend={false} />
                <ChartSkeleton height={300} showLegend={true} />
            </div>
        </div>
    );
};

// =============================================================================
// ESEMPIO 3: Progressive Enhancement Pattern
// =============================================================================

interface ProgressiveChartProps {
    initialData?: CashFlowDataPoint[];
    isLoading?: boolean;
}

/**
 * Progressive Enhancement Chart
 * Server-side structure + Client-side enhancement
 */
export const ProgressiveChart: React.FC<ProgressiveChartProps> = ({
    initialData = [],
    isLoading = false
}) => {
    return (
        <ServerChartContainer
            title="Progressive Chart"
            subtitle="Server structure + Client enhancement"
        >
            {isLoading ? (
                <ChartSkeleton height={400} />
            ) : (
                <LazyChart
                    type="cashflow"
                    data={initialData}
                />
            )}
        </ServerChartContainer>
    );
};

// =============================================================================
// ESEMPIO 4: SEO-Optimized Chart Page
// =============================================================================

export const SEOChartPage: React.FC = () => {
    return (
        <article>
            {/* SEO Metadata (Server-side) */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard Finanziario
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                    Analisi completa delle performance finanziarie
                </p>

                {/* Structured data per SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "DataVisualization",
                            "name": "Dashboard Finanziario",
                            "description": "Analisi cash flow e performance",
                            "creator": "P.IVA Balance"
                        })
                    }}
                />
            </header>

            {/* Charts con lazy loading */}
            <section className="space-y-8">
                <LazyChart
                    type="cashflow"
                    data={[]}
                    title="Cash Flow Mensile"
                />

                <LazyChart
                    type="tax"
                    data={[]}
                    title="Ripartizione Fiscale"
                />
            </section>
        </article>
    );
};

const ChartExamples = {
    DashboardCharts,
    ChartLoadingStates,
    ProgressiveChart,
    SEOChartPage
};

export default ChartExamples;
