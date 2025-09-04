'use client';

import React, { Suspense, lazy } from 'react';
import { ServerChartContainer, ChartSkeleton } from '../server';
import type {
    ChartConfig,
    CashFlowDataPoint,
    TrendDataPoint,
    TaxBreakdownDataPoint,
    YearComparisonDataPoint
} from '../types';

// Lazy loading dei chart components per code splitting
const CashFlowChart = lazy(() => import('../CashFlowChart'));
const MonthlyTrendChart = lazy(() => import('../MonthlyTrendChart'));
const TaxBreakdownChart = lazy(() => import('../TaxBreakdownChart'));
const YearComparisonChart = lazy(() => import('../YearComparisonChart'));

export type ChartType = 'cashflow' | 'trend' | 'tax' | 'comparison';

export interface ChartWrapperProps {
    type: ChartType;
    data: Record<string, unknown>[];
    config?: ChartConfig;
    loading?: boolean;
    error?: string | null;
    title?: string;
    subtitle?: string;
    className?: string;
    // Props specifiche per charts
    currentYear?: number;
    previousYear?: number;
    showPercentages?: boolean;
    showValues?: boolean;
}

/**
 * Hybrid Chart Wrapper Component
 * 
 * Combina SSR (layout) + CSR (chart interattivo)
 * 
 * Architettura:
 * 1. Container SSR per layout immediato
 * 2. Skeleton SSR per loading state
 * 3. Chart lazy loading per performance
 * 4. Code splitting automatico
 * 
 * Benefici:
 * - Faster First Paint (SSR container)
 * - Progressive Enhancement
 * - Optimal Bundle Size (lazy loading)
 * - SEO-friendly structure
 */
export const ChartWrapper: React.FC<ChartWrapperProps> = ({
    type,
    data,
    config,
    loading = false,
    error = null,
    title,
    subtitle,
    className = '',
    currentYear,
    previousYear,
    showPercentages,
    showValues
}) => {

    // Chart selection basata sul tipo
    const renderChart = () => {
        switch (type) {
            case 'cashflow':
                return (
                    <CashFlowChart
                        data={data as CashFlowDataPoint[]}
                        config={config}
                        loading={loading}
                        error={error}
                        title={title}
                        subtitle={subtitle}
                        className={className}
                    />
                );

            case 'trend':
                return (
                    <MonthlyTrendChart
                        data={data as TrendDataPoint[]}
                        config={config}
                        loading={loading}
                        error={error}
                        title={title}
                        subtitle={subtitle}
                        className={className}
                    />
                );

            case 'tax':
                return (
                    <TaxBreakdownChart
                        data={data as TaxBreakdownDataPoint[]}
                        config={config}
                        loading={loading}
                        error={error}
                        title={title}
                        subtitle={subtitle}
                        className={className}
                        showPercentages={showPercentages}
                        showValues={showValues}
                    />
                );

            case 'comparison':
                return (
                    <YearComparisonChart
                        data={data as YearComparisonDataPoint[]}
                        currentYear={currentYear || new Date().getFullYear()}
                        previousYear={previousYear || new Date().getFullYear() - 1}
                        config={config}
                        loading={loading}
                        error={error}
                        title={title}
                        subtitle={subtitle}
                        className={className}
                    />
                );

            default:
                return (
                    <div className="text-center text-gray-500 py-8">
                        Tipo di grafico non supportato: {type}
                    </div>
                );
        }
    };

    // Fallback skeleton con dimensioni appropriate
    const getSkeletonHeight = () => {
        switch (type) {
            case 'tax': return 400; // Pie chart + legend
            case 'trend': return 350; // Area chart
            case 'comparison': return 400; // Bar chart
            default: return 400; // Default
        }
    };

    return (
        <ServerChartContainer
            title={title}
            subtitle={subtitle}
            className={className}
        >
            <Suspense
                fallback={
                    <ChartSkeleton
                        height={getSkeletonHeight()}
                        showLegend={type === 'tax' || type === 'comparison'}
                        showHeader={false} // Header già nel container
                    />
                }
            >
                {renderChart()}
            </Suspense>
        </ServerChartContainer>
    );
};

export default ChartWrapper;
