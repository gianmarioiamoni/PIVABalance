/**
 * Comparative Chart Component
 * 
 * SRP: Handles ONLY multi-period comparison visualization
 * Advanced chart for comparing data across different time periods
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Calendar, TrendingUp, BarChart3, Filter } from 'lucide-react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { ChartAnalyticsData } from './types';

/**
 * Time Period Type
 * SRP: Defines only time period options
 */
export type TimePeriod = 'month' | 'quarter' | 'year' | 'custom';

/**
 * Comparison Mode Type
 * SRP: Defines only comparison modes
 */
export type ComparisonMode = 'absolute' | 'percentage' | 'difference';

/**
 * Comparative Chart Props
 * SRP: Interface for comparative chart specific properties
 */
export interface ComparativeChartProps {
    primaryData: ChartAnalyticsData;
    secondaryData?: ChartAnalyticsData;
    comparisonData?: ChartAnalyticsData;
    title: string;
    timePeriod: TimePeriod;
    comparisonMode: ComparisonMode;
    onTimePeriodChange: (period: TimePeriod) => void;
    onComparisonModeChange: (mode: ComparisonMode) => void;
    enableComparison?: boolean;
    enableTrendAnalysis?: boolean;
    className?: string;
}

/**
 * Period Selector Hook
 * SRP: Handles only time period selection logic
 */
const usePeriodSelector = (
    initialPeriod: TimePeriod,
    onPeriodChange: (period: TimePeriod) => void
) => {
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(initialPeriod);

    const handlePeriodChange = useCallback((period: TimePeriod) => {
        setSelectedPeriod(period);
        onPeriodChange(period);
    }, [onPeriodChange]);

    return {
        selectedPeriod,
        handlePeriodChange
    };
};

/**
 * Comparison Data Processor
 * SRP: Handles only data comparison calculations
 */
const useComparisonProcessor = (
    primaryData: ChartAnalyticsData,
    secondaryData?: ChartAnalyticsData,
    comparisonMode: ComparisonMode = 'absolute'
) => {
    const processedData = React.useMemo(() => {
        const primary = primaryData.primary || [];
        const secondary = secondaryData?.primary || [];

        // Merge data for comparison
        return primary.map((primaryItem, index) => {
            const secondaryItem = secondary[index];
            const primaryValue = primaryItem.value as number || 0;
            const secondaryValue = secondaryItem?.value as number || 0;

            let comparisonValue = 0;
            if (comparisonMode === 'percentage' && secondaryValue !== 0) {
                comparisonValue = ((primaryValue - secondaryValue) / Math.abs(secondaryValue)) * 100;
            } else if (comparisonMode === 'difference') {
                comparisonValue = primaryValue - secondaryValue;
            } else {
                comparisonValue = primaryValue;
            }

            return {
                ...primaryItem,
                primaryValue,
                secondaryValue,
                comparisonValue,
                name: primaryItem.name || `Periodo ${index + 1}`
            };
        });
    }, [primaryData, secondaryData, comparisonMode]);

    return { processedData };
};

/**
 * Chart Controls Component
 * SRP: Handles only chart control interface
 */
const ChartControls: React.FC<{
    selectedPeriod: TimePeriod;
    onPeriodChange: (period: TimePeriod) => void;
    comparisonMode: ComparisonMode;
    onComparisonModeChange: (mode: ComparisonMode) => void;
    enableComparison: boolean;
}> = ({
    selectedPeriod,
    onPeriodChange,
    comparisonMode,
    onComparisonModeChange,
    enableComparison
}) => {
        const periods: { value: TimePeriod; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
            { value: 'month', label: 'Mensile', icon: Calendar },
            { value: 'quarter', label: 'Trimestrale', icon: BarChart3 },
            { value: 'year', label: 'Annuale', icon: TrendingUp },
            { value: 'custom', label: 'Personalizzato', icon: Filter }
        ];

        const comparisonModes: { value: ComparisonMode; label: string }[] = [
            { value: 'absolute', label: 'Valori Assoluti' },
            { value: 'percentage', label: 'Percentuale' },
            { value: 'difference', label: 'Differenza' }
        ];

        return (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {/* Period Selector */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Periodo:</span>
                    <div className="flex items-center space-x-1">
                        {periods.map(period => {
                            const IconComponent = period.icon;
                            return (
                                <button
                                    key={period.value}
                                    onClick={() => onPeriodChange(period.value)}
                                    className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded transition-colors ${selectedPeriod === period.value
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <IconComponent className="h-4 w-4" />
                                    <span>{period.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Comparison Mode Selector */}
                {enableComparison && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Modalità:</span>
                        <select
                            value={comparisonMode}
                            onChange={(e) => onComparisonModeChange(e.target.value as ComparisonMode)}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {comparisonModes.map(mode => (
                                <option key={mode.value} value={mode.value}>
                                    {mode.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        );
    };



/**
 * Comparative Chart Component (Client-Side for Interactivity)
 * 
 * SRP Responsibilities:
 * 1. Multi-period comparison orchestration ONLY
 * 2. Comparison mode management ONLY
 * 3. Trend analysis coordination ONLY
 * 
 * NOT responsible for:
 * - Data processing (delegated to useComparisonProcessor)
 * - Period selection (delegated to usePeriodSelector)
 * - Chart rendering (delegated to Recharts)
 * - Controls UI (delegated to ChartControls)
 */
export const ComparativeChart: React.FC<ComparativeChartProps> = ({
    primaryData,
    secondaryData,
    comparisonData: _comparisonData,
    title,
    timePeriod,
    comparisonMode,
    onTimePeriodChange,
    onComparisonModeChange,
    enableComparison = true,
    enableTrendAnalysis = true,
    className = ''
}) => {
    // Use specialized hooks
    const { selectedPeriod, handlePeriodChange } = usePeriodSelector(timePeriod, onTimePeriodChange);
    const { processedData } = useComparisonProcessor(primaryData, secondaryData, comparisonMode);

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Chart Header */}
            <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Confronto dati {selectedPeriod === 'month' ? 'mensili' :
                        selectedPeriod === 'quarter' ? 'trimestrali' :
                            selectedPeriod === 'year' ? 'annuali' : 'personalizzati'}
                </p>
            </div>

            {/* Chart Controls */}
            <ChartControls
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                comparisonMode={comparisonMode}
                onComparisonModeChange={onComparisonModeChange}
                enableComparison={enableComparison}
            />

            {/* Chart Content */}
            <div className="p-4">
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            stroke="#666"
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            stroke="#666"
                            tickFormatter={(value) => `€${value.toLocaleString('it-IT')}`}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                `€${value.toLocaleString('it-IT')}`,
                                name === 'primaryValue' ? 'Periodo Corrente' :
                                    name === 'secondaryValue' ? 'Periodo Precedente' : 'Confronto'
                            ]}
                            labelFormatter={(label) => `Periodo: ${label}`}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend />

                        {/* Primary Data as Bars */}
                        <Bar
                            dataKey="primaryValue"
                            fill="#3b82f6"
                            name="Periodo Corrente"
                            radius={[4, 4, 0, 0]}
                        />

                        {/* Secondary Data as Bars (if available) */}
                        {secondaryData && (
                            <Bar
                                dataKey="secondaryValue"
                                fill="#6366f1"
                                name="Periodo Precedente"
                                radius={[4, 4, 0, 0]}
                            />
                        )}

                        {/* Comparison as Line */}
                        {enableComparison && (
                            <Line
                                type="monotone"
                                dataKey="comparisonValue"
                                stroke="#ef4444"
                                strokeWidth={3}
                                name={`Confronto (${comparisonMode === 'percentage' ? '%' : comparisonMode === 'difference' ? '€' : 'Valore'})`}
                                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                                yAxisId="right"
                            />
                        )}

                        {/* Right Y-Axis for comparison */}
                        {enableComparison && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                                tickFormatter={(value) =>
                                    comparisonMode === 'percentage' ? `${value}%` : `€${value.toLocaleString('it-IT')}`
                                }
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Trend Analysis */}
            {enableTrendAnalysis && (
                <ComparativeTrendAnalysis
                    data={processedData}
                    enableTrendAnalysis={enableTrendAnalysis}
                />
            )}
        </div>
    );
};

/**
 * Comparative Trend Analysis Component
 * SRP: Handles only comparative trend analysis display
 */
const ComparativeTrendAnalysis: React.FC<{
    data: Record<string, unknown>[];
    enableTrendAnalysis: boolean;
}> = ({ data, enableTrendAnalysis }) => {
    if (!enableTrendAnalysis || data.length < 2) {
        return null;
    }

    // Calculate trend metrics
    const firstValue = data[0]?.primaryValue as number || 0;
    const lastValue = data[data.length - 1]?.primaryValue as number || 0;
    const trendPercentage = firstValue !== 0 ? ((lastValue - firstValue) / Math.abs(firstValue)) * 100 : 0;
    const isPositiveTrend = trendPercentage >= 0;

    // Calculate volatility
    const values = data.map(d => d.primaryValue as number || 0);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
    const volatility = Math.sqrt(variance) / average * 100;

    // Calculate growth rate
    const growthPoints = [];
    for (let i = 1; i < values.length; i++) {
        const prev = values[i - 1];
        const curr = values[i];
        if (prev !== 0) {
            growthPoints.push(((curr - prev) / Math.abs(prev)) * 100);
        }
    }
    const avgGrowthRate = growthPoints.length > 0
        ? growthPoints.reduce((sum, rate) => sum + rate, 0) / growthPoints.length
        : 0;

    return (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 mb-3">📊 Analisi Comparativa</h4>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Overall Trend */}
                <div className="text-center">
                    <div className={`text-lg font-bold ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositiveTrend ? '+' : ''}{trendPercentage.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">Trend Totale</div>
                </div>

                {/* Average Growth */}
                <div className="text-center">
                    <div className={`text-lg font-bold ${avgGrowthRate >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {avgGrowthRate >= 0 ? '+' : ''}{avgGrowthRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">Crescita Media</div>
                </div>

                {/* Volatility */}
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                        {volatility.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600">Volatilità</div>
                </div>

                {/* Average Value */}
                <div className="text-center">
                    <div className="text-lg font-bold text-gray-700">
                        €{average.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-600">Valore Medio</div>
                </div>
            </div>

            {/* Insights */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                    {isPositiveTrend ? '📈' : '📉'}
                    <strong> Insight:</strong> {
                        Math.abs(trendPercentage) > 20
                            ? `Trend ${isPositiveTrend ? 'molto positivo' : 'molto negativo'} del ${Math.abs(trendPercentage).toFixed(1)}%`
                            : Math.abs(trendPercentage) > 5
                                ? `Trend ${isPositiveTrend ? 'positivo' : 'negativo'} moderato`
                                : 'Andamento stabile'
                    }
                    {volatility > 30 && ' • Alta volatilità rilevata'}
                    {volatility < 10 && ' • Andamento molto stabile'}
                </div>
            </div>
        </div>
    );
};

export default ComparativeChart;
