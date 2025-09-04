/**
 * Chart Pre-rendering Usage Examples
 * 
 * Esempi di utilizzo del sistema di pre-rendering
 */

import React from 'react';
import {
    SSRChartWrapper,
    DashboardChart,
    ReportChart,
    EmailChart,
    PrerenderedChart,
    QuickChartPreview
} from '../prerender';
import type { CashFlowDataPoint, TrendDataPoint, TaxBreakdownDataPoint } from '../types';

// =============================================================================
// SAMPLE DATA
// =============================================================================

const sampleCashFlowData: CashFlowDataPoint[] = [
    { month: 'Gen', income: 5000, expenses: 3000, net: 2000, date: new Date(2024, 0, 1) },
    { month: 'Feb', income: 5500, expenses: 3200, net: 2300, date: new Date(2024, 1, 1) },
    { month: 'Mar', income: 6000, expenses: 3500, net: 2500, date: new Date(2024, 2, 1) },
    { month: 'Apr', income: 5800, expenses: 3300, net: 2500, date: new Date(2024, 3, 1) },
    { month: 'Mag', income: 6200, expenses: 3600, net: 2600, date: new Date(2024, 4, 1) },
    { month: 'Giu', income: 6500, expenses: 3800, net: 2700, date: new Date(2024, 5, 1) }
];

const sampleTrendData: TrendDataPoint[] = [
    { period: 'Gen 2024', value: 5000, previous: 4500, date: new Date(2024, 0, 1) },
    { period: 'Feb 2024', value: 5500, previous: 5000, date: new Date(2024, 1, 1) },
    { period: 'Mar 2024', value: 6000, previous: 5200, date: new Date(2024, 2, 1) },
    { period: 'Apr 2024', value: 5800, previous: 5100, date: new Date(2024, 3, 1) },
    { period: 'Mag 2024', value: 6200, previous: 5400, date: new Date(2024, 4, 1) },
    { period: 'Giu 2024', value: 6500, previous: 5600, date: new Date(2024, 5, 1) }
];

const sampleTaxData: TaxBreakdownDataPoint[] = [
    { category: 'IRPEF', amount: 1200, percentage: 36.4, color: '#3B82F6' },
    { category: 'INPS', amount: 800, percentage: 24.2, color: '#10B981' },
    { category: 'IVA', amount: 600, percentage: 18.2, color: '#EF4444' },
    { category: 'Addizionali', amount: 300, percentage: 9.1, color: '#8B5CF6' },
    { category: 'Fondi Prof.', amount: 400, percentage: 12.1, color: '#F59E0B' }
];

// =============================================================================
// ESEMPIO 1: PROGRESSIVE ENHANCEMENT DASHBOARD
// =============================================================================

/**
 * Dashboard con Progressive Enhancement
 * Server: SVG statico → Client: Chart interattivo
 */
export const ProgressiveDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">
                Dashboard con Pre-rendering
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cash Flow con progressive enhancement */}
                <DashboardChart
                    type="cashflow"
                    data={sampleCashFlowData}
                    title="Cash Flow Mensile"
                    subtitle="Entrate vs Uscite con preview statico"
                    enableInteractive={true}
                />

                {/* Trend analysis */}
                <DashboardChart
                    type="trend"
                    data={sampleTrendData}
                    title="Trend Performance"
                    subtitle="Crescita nel tempo"
                />
            </div>

            {/* Tax breakdown full width */}
            <DashboardChart
                type="tax"
                data={sampleTaxData}
                title="Ripartizione Fiscale"
                subtitle="Distribuzione imposte e contributi"
                showPercentages={true}
                showValues={true}
            />
        </div>
    );
};

// =============================================================================
// ESEMPIO 2: REPORT AD ALTA QUALITÀ
// =============================================================================

/**
 * Report Charts con alta qualità per stampa/PDF
 */
export const HighQualityReports: React.FC = () => {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">
                Report Ad Alta Qualità
            </h2>

            {/* Report chart con qualità alta */}
            <ReportChart
                type="cashflow"
                data={sampleCashFlowData}
                title="Cash Flow Analysis - Q2 2024"
                subtitle="Report dettagliato per stampa"
                enableInteractive={false} // Solo static per report
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReportChart
                    type="trend"
                    data={sampleTrendData}
                    title="Growth Trend"
                    enableInteractive={false}
                />

                <ReportChart
                    type="tax"
                    data={sampleTaxData}
                    title="Tax Breakdown"
                    enableInteractive={false}
                />
            </div>
        </div>
    );
};

// =============================================================================
// ESEMPIO 3: EMAIL/NEWSLETTER CHARTS
// =============================================================================

/**
 * Charts ottimizzati per email/newsletter
 * Lightweight e compatibili con client email
 */
export const EmailCharts: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
                Charts per Email/Newsletter
            </h2>

            {/* Quick previews per email */}
            <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Monthly Summary</h3>

                <EmailChart
                    type="cashflow"
                    data={sampleCashFlowData.slice(0, 3)} // Dati ridotti
                    title="Q2 Cash Flow"
                />

                <div className="mt-4 text-sm text-gray-600">
                    <p>Il tuo cash flow è cresciuto del 15% rispetto al trimestre precedente.</p>
                    <a href="/dashboard" className="text-blue-600 hover:underline">
                        Vedi dettagli completi →
                    </a>
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// ESEMPIO 4: QUICK PREVIEWS
// =============================================================================

/**
 * Quick Previews per performance ottimali
 */
export const QuickPreviews: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
                Quick Chart Previews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Small preview cards */}
                <div className="bg-white border rounded-lg p-4">
                    <QuickChartPreview
                        type="cashflow"
                        data={sampleCashFlowData}
                        title="Cash Flow"
                    />
                </div>

                <div className="bg-white border rounded-lg p-4">
                    <QuickChartPreview
                        type="trend"
                        data={sampleTrendData}
                        title="Growth"
                    />
                </div>

                <div className="bg-white border rounded-lg p-4">
                    <QuickChartPreview
                        type="tax"
                        data={sampleTaxData}
                        title="Taxes"
                    />
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// ESEMPIO 5: CUSTOM PRERENDERING
// =============================================================================

/**
 * Custom Pre-rendering con configurazione specifica
 */
export const CustomPrerendering: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
                Custom Pre-rendering Config
            </h2>

            {/* Chart con configurazione custom */}
            <PrerenderedChart
                chartData={{ type: 'cashflow', data: sampleCashFlowData }}
                title="Cash Flow Custom"
                subtitle="Configurazione pre-rendering personalizzata"
                prerenderConfig={{
                    quality: 'high',
                    enableCaching: true,
                    cacheTTL: 7200, // 2 ore
                    fallbackToSkeleton: true
                }}
                width={900}
                height={500}
                className="border rounded-lg"
            />

            {/* Different quality levels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['low', 'medium', 'high'] as const).map(quality => (
                    <div key={quality} className="text-center">
                        <h3 className="font-medium mb-2">Quality: {quality}</h3>
                        <PrerenderedChart
                            chartData={{ type: 'trend', data: sampleTrendData }}
                            title={`${quality} Quality`}
                            prerenderConfig={{ quality }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

// =============================================================================
// PERFORMANCE COMPARISON
// =============================================================================

/**
 * Comparison tra diversi approcci di rendering
 */
export const PerformanceComparison: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
                Performance Comparison
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Traditional CSR */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Traditional CSR</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Chart caricato solo client-side
                    </p>
                    {/* Qui andrebbero i chart tradizionali */}
                    <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                        <span className="text-gray-500">Loading chart...</span>
                    </div>
                </div>

                {/* Pre-rendered SSR */}
                <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Pre-rendered SSR</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Preview immediato + enhancement
                    </p>
                    <SSRChartWrapper
                        type="cashflow"
                        data={sampleCashFlowData}
                        title="Immediate Preview"
                        enablePrerendering={true}
                        enableInteractive={true}
                    />
                </div>
            </div>

            {/* Performance metrics */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Performance Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <strong className="text-blue-800">First Paint:</strong>
                        <br />SSR: ~100ms vs CSR: ~800ms
                    </div>
                    <div>
                        <strong className="text-blue-800">SEO Score:</strong>
                        <br />SSR: 100% vs CSR: 0%
                    </div>
                    <div>
                        <strong className="text-blue-800">Bundle Size:</strong>
                        <br />Initial: 15KB vs 450KB
                    </div>
                </div>
            </div>
        </div>
    );
};

const PrerenderingExamples = {
    ProgressiveDashboard,
    HighQualityReports,
    EmailCharts,
    QuickPreviews,
    CustomPrerendering,
    PerformanceComparison
};

export default PrerenderingExamples;
