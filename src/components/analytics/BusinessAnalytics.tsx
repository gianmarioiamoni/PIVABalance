/**
 * Business Analytics Component
 * 
 * SRP: Handles ONLY business analytics orchestration
 * Advanced analytics dashboard with forecasting and insights
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Brain, AlertTriangle, Filter } from 'lucide-react';
import { DrillDownChart, InteractiveChart, ComparativeChart } from '../charts/advanced';
import { KPIDashboard } from './KPIDashboard';
import { AdvancedFilters } from './AdvancedFilters';
import { useBusinessAnalytics } from '@/hooks/analytics/useBusinessAnalytics';
import { useAdvancedFilters } from '@/hooks/analytics/useAdvancedFilters';
import { ChartAnalyticsData, KPIMetric, BusinessInsight } from '../charts/advanced/types';

/**
 * Analytics Period Type
 * SRP: Defines only analytics period options
 */
export type AnalyticsPeriod = '3months' | '6months' | '12months' | '24months';

/**
 * Business Analytics Props
 * SRP: Interface for business analytics specific properties
 */
export interface BusinessAnalyticsProps {
    userId: string;
    period: AnalyticsPeriod;
    onPeriodChange: (period: AnalyticsPeriod) => void;
    className?: string;
}

/**
 * Analytics Period Selector
 * SRP: Handles only period selection UI
 */
const AnalyticsPeriodSelector: React.FC<{
    selectedPeriod: AnalyticsPeriod;
    onPeriodChange: (period: AnalyticsPeriod) => void;
}> = ({ selectedPeriod, onPeriodChange }) => {
    const periods: { value: AnalyticsPeriod; label: string }[] = [
        { value: '3months', label: '3 Mesi' },
        { value: '6months', label: '6 Mesi' },
        { value: '12months', label: '12 Mesi' },
        { value: '24months', label: '24 Mesi' }
    ];

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Periodo Analisi:</span>
            <div className="flex items-center space-x-1">
                {periods.map(period => (
                    <button
                        key={period.value}
                        onClick={() => onPeriodChange(period.value)}
                        className={`px-3 py-1.5 text-sm rounded transition-colors ${selectedPeriod === period.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {period.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

/**
 * Analytics Summary Component
 * SRP: Handles only analytics summary rendering
 */
const AnalyticsSummary: React.FC<{
    kpis: KPIMetric[];
    insights: BusinessInsight[];
    period: string;
}> = ({ kpis, insights, period: _period }) => {
    const criticalKPIs = kpis.filter(k => k.status === 'critical').length;
    const warningKPIs = kpis.filter(k => k.status === 'warning').length;
    const goodKPIs = kpis.filter(k => k.status === 'good').length;

    const highImpactInsights = insights.filter(i => i.impact === 'high').length;
    const actionableInsights = insights.filter(i => i.actionable).length;

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
                <Brain className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Riepilogo Analytics</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{goodKPIs}</div>
                    <div className="text-xs text-gray-600">KPI Positivi</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{warningKPIs}</div>
                    <div className="text-xs text-gray-600">KPI Attenzione</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{criticalKPIs}</div>
                    <div className="text-xs text-gray-600">KPI Critici</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{highImpactInsights}</div>
                    <div className="text-xs text-gray-600">Insight Importanti</div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{actionableInsights}</div>
                    <div className="text-xs text-gray-600">Azioni Possibili</div>
                </div>
            </div>
        </div>
    );
};

/**
 * Analytics Charts Grid Component
 * SRP: Handles only charts grid layout
 */
const AnalyticsChartsGrid: React.FC<{
    revenueData: ChartAnalyticsData;
    costData: ChartAnalyticsData;
    profitData: ChartAnalyticsData;
    period: AnalyticsPeriod;
}> = ({ revenueData, costData, profitData, period }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Comparison */}
            <ComparativeChart
                primaryData={revenueData}
                secondaryData={revenueData} // Previous period would be calculated
                title="Analisi Ricavi Comparativa"
                timePeriod={period === '3months' ? 'month' : period === '6months' ? 'month' : 'quarter'}
                comparisonMode="percentage"
                onTimePeriodChange={() => {
                    // Handled by parent
                }}
                onComparisonModeChange={() => {
                    // Handled by parent
                }}
                enableComparison={true}
                enableTrendAnalysis={true}
            />

            {/* Interactive Cost Analysis */}
            <InteractiveChart
                data={costData.primary}
                config={{
                    enableDrillDown: false,
                    enableZoom: true,
                    enablePan: true,
                    enableTooltip: true,
                    enableLegendToggle: true,
                    enableDataSelection: true,
                    enableExport: true,
                    enableFullscreen: false
                }}
                exportOptions={{
                    format: 'png',
                    quality: 'high',
                    includeData: true,
                    filename: `cost-analysis-${period}`
                }}
            />

            {/* Profit Drill-Down */}
            <DrillDownChart
                data={profitData.primary}
                config={{
                    enableDrillDown: true,
                    enableZoom: false,
                    enablePan: false,
                    enableTooltip: true,
                    enableLegendToggle: false,
                    enableDataSelection: false,
                    enableExport: true,
                    enableFullscreen: true
                }}
                drillDownConfig={{
                    levels: [
                        { id: 'overview', name: 'Panoramica Profitti', data: profitData.primary, level: 0 },
                        { id: 'monthly', name: 'Dettaglio Mensile', data: profitData.secondary || [], level: 1 },
                        { id: 'categories', name: 'Per Categoria', data: profitData.comparison || [], level: 2 }
                    ]
                }}
                exportOptions={{
                    format: 'pdf',
                    quality: 'high',
                    includeData: true,
                    filename: `profit-drilldown-${period}`
                }}
            />

            {/* Revenue Trend Forecast */}
            <InteractiveChart
                data={revenueData.primary}
                config={{
                    enableDrillDown: false,
                    enableZoom: true,
                    enablePan: false,
                    enableTooltip: true,
                    enableLegendToggle: false,
                    enableDataSelection: true,
                    enableExport: true,
                    enableFullscreen: false
                }}
                exportOptions={{
                    format: 'excel',
                    quality: 'high',
                    includeData: true,
                    filename: `revenue-forecast-${period}`
                }}
            />
        </div>
    );
};

/**
 * Business Analytics Component (Client-Side for Advanced Features)
 * 
 * SRP Responsibilities:
 * 1. Business analytics orchestration ONLY
 * 2. Analytics dashboard layout ONLY
 * 3. Period management coordination ONLY
 * 
 * NOT responsible for:
 * - Data fetching (delegated to useBusinessAnalytics)
 * - KPI calculations (delegated to analytics hooks)
 * - Chart rendering (delegated to chart components)
 * - Insights generation (delegated to analytics services)
 */
export const BusinessAnalytics: React.FC<BusinessAnalyticsProps> = ({
    userId,
    period,
    onPeriodChange,
    className = ''
}) => {
    const [showFilters, setShowFilters] = useState(false);

    // Use business analytics hook for data
    const {
        kpis,
        insights,
        revenueData,
        costData,
        profitData,
        isLoading,
        error,
        refresh
    } = useBusinessAnalytics(userId, period);

    // Convert chart data to filterable format
    const filterableData = useMemo(() => {
        return [
            ...revenueData.primary.map(item => ({
                id: item.id as string || '',
                date: item.date as string || '',
                amount: item.value as number || 0,
                description: item.name as string || '',
                clientName: item.clientName as string,
                category: item.category as string,
                type: 'revenue'
            })),
            ...costData.primary.map(item => ({
                id: item.id as string || '',
                date: item.date as string || '',
                amount: item.value as number || 0,
                description: item.name as string || '',
                category: 'cost',
                type: 'cost'
            }))
        ];
    }, [revenueData, costData]);

    // Use advanced filters hook
    const {
        criteria,
        setCriteria,
        filteredData: _filteredData,
        availableClients,
        availableCategories,
        statistics,
        resetFilters,
        applyFilters
    } = useAdvancedFilters(filterableData);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Caricamento analytics avanzate...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-red-900 mb-2">Errore Analytics</h3>
                <p className="text-red-700">{error}</p>
                <button
                    onClick={refresh}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Riprova
                </button>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Period Selector & Filters Toggle */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <AnalyticsPeriodSelector
                        selectedPeriod={period}
                        onPeriodChange={onPeriodChange}
                    />

                    <div className="flex items-center space-x-3">
                        {/* Filter Statistics */}
                        {statistics.appliedFilters > 0 && (
                            <div className="text-sm text-gray-600">
                                {statistics.filteredItems} di {statistics.totalItems} elementi
                                ({statistics.filterEfficiency.toFixed(1)}%)
                            </div>
                        )}

                        {/* Filters Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${showFilters || statistics.appliedFilters > 0
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Filter className="h-4 w-4" />
                            <span>Filtri</span>
                            {statistics.appliedFilters > 0 && (
                                <span className="px-2 py-0.5 text-xs bg-blue-200 text-blue-800 rounded-full">
                                    {statistics.appliedFilters}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <AdvancedFilters
                    criteria={criteria}
                    onCriteriaChange={setCriteria}
                    availableClients={availableClients}
                    availableCategories={availableCategories}
                    onReset={resetFilters}
                    onApply={applyFilters}
                />
            )}

            {/* Analytics Summary */}
            <AnalyticsSummary
                kpis={kpis}
                insights={insights}
                period={period}
            />

            {/* KPI Dashboard */}
            <KPIDashboard
                kpis={kpis}
                insights={insights}
                period={period}
                lastUpdated={new Date()}
            />

            {/* Advanced Charts Grid */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Analisi Avanzate</h3>
                <AnalyticsChartsGrid
                    revenueData={revenueData}
                    costData={costData}
                    profitData={profitData}
                    period={period}
                />
            </div>
        </div>
    );
};

export default BusinessAnalytics;
