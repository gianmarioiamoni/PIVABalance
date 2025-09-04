/**
 * Revenue Widget Component
 * 
 * SRP: Handles ONLY revenue visualization and metrics
 * Specialized widget for revenue analysis and trends
 */

'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { WidgetContainer } from '../base/WidgetContainer';
import { BaseWidgetProps } from '../base/types';
import { useRevenueData } from '@/hooks/widgets/useRevenueData';

/**
 * Revenue Data Structure
 * SRP: Handles only revenue data interface
 */
export interface RevenueData extends Record<string, unknown> {
    currentMonth: number;
    previousMonth: number;
    yearToDate: number;
    targetMonth?: number;
    targetYear?: number;
    monthlyTrend: number; // percentage
    yearlyTrend: number; // percentage
    averageMonthly: number;
    bestMonth: { month: string; amount: number };
    projectedYear: number;
}

/**
 * Revenue Widget Props
 * SRP: Interface for revenue widget specific properties
 */
export interface RevenueWidgetProps extends BaseWidgetProps {
    showProjections?: boolean;
    showTargets?: boolean;
    monthsToAnalyze?: number;
}

/**
 * Revenue Metrics Display Component
 * SRP: Handles only revenue metrics rendering
 */
const RevenueMetrics: React.FC<{ data: RevenueData; showTargets: boolean }> = ({
    data,
    showTargets
}) => {
    const monthlyTrendIcon = data.monthlyTrend >= 0 ? TrendingUp : TrendingDown;
    const monthlyTrendColor = data.monthlyTrend >= 0 ? 'text-green-600' : 'text-red-600';
    const monthlyTrendBg = data.monthlyTrend >= 0 ? 'bg-green-50' : 'bg-red-50';

    return (
        <div className="space-y-4">
            {/* Primary Metrics */}
            <div className="grid grid-cols-2 gap-4">
                {/* Current Month */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        €{data.currentMonth.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-600">Questo Mese</div>
                </div>

                {/* Year to Date */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        €{data.yearToDate.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-600">Anno Corrente</div>
                </div>
            </div>

            {/* Trend Indicator */}
            <div className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-full ${monthlyTrendBg}`}>
                {React.createElement(monthlyTrendIcon, { className: `h-4 w-4 ${monthlyTrendColor}` })}
                <span className={`text-sm font-medium ${monthlyTrendColor}`}>
                    {data.monthlyTrend >= 0 ? '+' : ''}{data.monthlyTrend.toFixed(1)}% vs mese scorso
                </span>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div>
                    <div className="font-semibold text-gray-700">
                        €{data.averageMonthly.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-500">Media Mensile</div>
                </div>

                <div>
                    <div className="font-semibold text-purple-600">
                        €{data.projectedYear.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-500">Proiezione Anno</div>
                </div>
            </div>

            {/* Targets (if enabled) */}
            {showTargets && data.targetMonth && (
                <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Target Mensile:</span>
                        <span className="font-semibold text-blue-600">
                            €{data.targetMonth.toLocaleString('it-IT')}
                        </span>
                    </div>

                    {/* Target Progress */}
                    <div className="mt-2">
                        <div className="bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${Math.min((data.currentMonth / data.targetMonth) * 100, 100)}%`
                                }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-center">
                            {((data.currentMonth / data.targetMonth) * 100).toFixed(1)}% del target
                        </div>
                    </div>
                </div>
            )}

            {/* Best Month Highlight */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-yellow-600" />
                    <div className="text-sm">
                        <span className="text-gray-600">Miglior mese: </span>
                        <span className="font-semibold text-yellow-700">
                            {data.bestMonth.month} (€{data.bestMonth.amount.toLocaleString('it-IT')})
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Revenue Widget Component (Client-Side for Interactivity)
 * 
 * SRP Responsibilities:
 * 1. Revenue data presentation ONLY
 * 2. Revenue-specific metrics ONLY
 * 3. Revenue trend visualization ONLY
 * 
 * NOT responsible for:
 * - Generic widget container logic (delegated to WidgetContainer)
 * - Data fetching logic (delegated to useRevenueData hook)
 * - Dashboard layout management
 */
export const RevenueWidget: React.FC<RevenueWidgetProps> = ({
    config,
    data: _data,
    isEditing,
    onConfigChange,
    onRemove,
    onRefresh,
    showProjections: _showProjections = true,
    showTargets = true,
    monthsToAnalyze = 12,
    className = ''
}) => {
    // Use specialized hook for revenue data
    const {
        revenueData,
        isLoading,
        error,
        refresh
    } = useRevenueData(monthsToAnalyze);

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
        data: revenueData,
        lastUpdated: new Date(),
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
            {revenueData && !isLoading && !error ? (
                <RevenueMetrics
                    data={revenueData}
                    showTargets={showTargets}
                />
            ) : (
                /* Loading/Error handled by WidgetContainer */
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Caricamento dati ricavi...</p>
                    </div>
                </div>
            )}
        </WidgetContainer>
    );
};

export default RevenueWidget;
