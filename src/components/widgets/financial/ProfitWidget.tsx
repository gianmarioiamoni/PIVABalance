/**
 * Profit Widget Component
 * 
 * SRP: Handles ONLY profit/margin visualization and analysis
 * Specialized widget for profitability metrics and business health
 */

'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Target, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import { WidgetContainer } from '../base/WidgetContainer';
import { BaseWidgetProps } from '../base/types';
import { useProfitData } from '@/hooks/widgets/useProfitData';

/**
 * Profit Data Structure
 * SRP: Handles only profit data interface
 */
export interface ProfitData extends Record<string, unknown> {
    currentMonth: {
        revenue: number;
        costs: number;
        profit: number;
        margin: number; // percentage
    };
    previousMonth: {
        revenue: number;
        costs: number;
        profit: number;
        margin: number;
    };
    yearToDate: {
        revenue: number;
        costs: number;
        profit: number;
        margin: number;
    };
    trends: {
        profitTrend: number; // percentage change
        marginTrend: number; // percentage points change
        revenueTrend: number;
        costTrend: number;
    };
    benchmarks: {
        targetMargin: number; // target profit margin %
        industryAverage: number; // industry benchmark %
        bestMonth: {
            month: string;
            profit: number;
            margin: number;
        };
    };
    healthScore: number; // 0-100 business health score
    recommendations: string[];
}

/**
 * Profit Widget Props
 * SRP: Interface for profit widget specific properties
 */
export interface ProfitWidgetProps extends BaseWidgetProps {
    showBenchmarks?: boolean;
    showRecommendations?: boolean;
    showHealthScore?: boolean;
    monthsToAnalyze?: number;
}

/**
 * Profit Health Indicator Component
 * SRP: Handles only health score visualization
 */
const ProfitHealthIndicator: React.FC<{ score: number; margin: number }> = ({ score, margin }) => {
    const getHealthStatus = (score: number) => {
        if (score >= 80) return { label: 'Eccellente', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
        if (score >= 60) return { label: 'Buono', color: 'text-blue-600', bg: 'bg-blue-50', icon: Target };
        if (score >= 40) return { label: 'Discreto', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: BarChart3 };
        return { label: 'Critico', color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle };
    };

    const status = getHealthStatus(score);
    const StatusIcon = status.icon;

    return (
        <div className={`${status.bg} rounded-lg p-3 border`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-5 w-5 ${status.color}`} />
                    <div>
                        <div className={`text-sm font-semibold ${status.color}`}>
                            {status.label}
                        </div>
                        <div className="text-xs text-gray-600">
                            Health Score: {score}/100
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-lg font-bold ${status.color}`}>
                        {margin.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Margine</div>
                </div>
            </div>
        </div>
    );
};

/**
 * Profit Metrics Display Component
 * SRP: Handles only profit metrics rendering
 */
const ProfitMetrics: React.FC<{
    data: ProfitData;
    showBenchmarks: boolean;
    showHealthScore: boolean
}> = ({ data, showBenchmarks, showHealthScore }) => {
    const profitTrendIcon = data.trends.profitTrend >= 0 ? TrendingUp : TrendingDown;
    const profitTrendColor = data.trends.profitTrend >= 0 ? 'text-green-600' : 'text-red-600';

    return (
        <div className="space-y-4">
            {/* Health Score */}
            {showHealthScore && (
                <ProfitHealthIndicator
                    score={data.healthScore}
                    margin={data.currentMonth.margin}
                />
            )}

            {/* Current vs Previous Month */}
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <div className={`text-xl font-bold ${data.currentMonth.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        €{data.currentMonth.profit.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-600">Profitto Mese</div>
                    <div className="text-xs text-gray-500">
                        {data.currentMonth.margin.toFixed(1)}% margine
                    </div>
                </div>

                <div className="text-center">
                    <div className={`text-xl font-bold ${data.yearToDate.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        €{data.yearToDate.profit.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-600">Profitto Anno</div>
                    <div className="text-xs text-gray-500">
                        {data.yearToDate.margin.toFixed(1)}% margine
                    </div>
                </div>
            </div>

            {/* Trend Indicators */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center space-x-1 p-2 bg-gray-50 rounded">
                    {React.createElement(profitTrendIcon, { className: `h-4 w-4 ${profitTrendColor}` })}
                    <span className={`text-sm font-medium ${profitTrendColor}`}>
                        {data.trends.profitTrend >= 0 ? '+' : ''}{data.trends.profitTrend.toFixed(1)}%
                    </span>
                </div>

                <div className="text-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-700">
                        {data.trends.marginTrend >= 0 ? '+' : ''}{data.trends.marginTrend.toFixed(1)}pp
                    </span>
                    <div className="text-xs text-gray-500">margine</div>
                </div>
            </div>

            {/* Benchmarks */}
            {showBenchmarks && (
                <div className="border-t border-gray-100 pt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Benchmark</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Target Margine:</span>
                            <span className="font-semibold text-blue-600">
                                {data.benchmarks.targetMargin.toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Media Settore:</span>
                            <span className="font-semibold text-purple-600">
                                {data.benchmarks.industryAverage.toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Miglior Mese:</span>
                            <span className="font-semibold text-green-600">
                                {data.benchmarks.bestMonth.margin.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Recommendations */}
            {data.recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        Suggerimenti
                    </h4>
                    <ul className="space-y-1">
                        {data.recommendations.slice(0, 2).map((rec, index) => (
                            <li key={index} className="text-xs text-blue-600 flex items-start">
                                <span className="mr-1">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

/**
 * Profit Widget Component (Client-Side for Calculations)
 * 
 * SRP Responsibilities:
 * 1. Profit data presentation ONLY
 * 2. Profitability metrics ONLY
 * 3. Business health visualization ONLY
 * 
 * NOT responsible for:
 * - Generic widget container logic (delegated to WidgetContainer)
 * - Profit calculation logic (delegated to useProfitData hook)
 * - Dashboard layout management
 */
export const ProfitWidget: React.FC<ProfitWidgetProps> = ({
    config,
    data: _data,
    isEditing,
    onConfigChange,
    onRemove,
    onRefresh,
    showBenchmarks = true,
    showRecommendations: _showRecommendations = true,
    showHealthScore = true,
    monthsToAnalyze = 12,
    className = ''
}) => {
    // Use specialized hook for profit data
    const {
        profitData,
        isLoading,
        error,
        lastUpdated,
        refresh
    } = useProfitData(monthsToAnalyze);

    // Handle refresh action
    const handleRefresh = () => {
        refresh();
        if (onRefresh) {
            onRefresh(config.id);
        }
    };

    // Widget data for container
    const widgetData = {
        id: config.id,
        data: profitData,
        lastUpdated,
        isLoading,
        error: error || undefined
    };

    return (
        <WidgetContainer
            config={config}
            data={widgetData}
            isEditing={isEditing}
            onConfigChange={onConfigChange}
            onRemove={onRemove}
            onRefresh={handleRefresh}
            className={className}
        >
            {/* Widget Content */}
            {profitData && !isLoading && !error ? (
                <ProfitMetrics
                    data={profitData}
                    showBenchmarks={showBenchmarks}
                    showHealthScore={showHealthScore}
                />
            ) : (
                /* Loading/Error handled by WidgetContainer */
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Caricamento analisi profittabilità...</p>
                    </div>
                </div>
            )}
        </WidgetContainer>
    );
};

export default ProfitWidget;
