/**
 * Cost Widget Component
 * 
 * SRP: Handles ONLY cost visualization and analysis
 * Specialized widget for cost tracking and categorization
 */

'use client';

import React from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, PieChart, AlertTriangle } from 'lucide-react';
import { WidgetContainer } from '../base/WidgetContainer';
import { BaseWidgetProps } from '../base/types';
import { useCostData } from '@/hooks/widgets/useCostData';

/**
 * Cost Widget Props
 * SRP: Interface for cost widget specific properties
 */
export interface CostWidgetProps extends BaseWidgetProps {
    showCategories?: boolean;
    showDeductible?: boolean;
    monthsToAnalyze?: number;
}

/**
 * Cost Data Structure
 * SRP: Handles only cost data interface
 */
export interface CostData extends Record<string, unknown> {
    currentMonth: number;
    previousMonth: number;
    yearToDate: number;
    monthlyTrend: number; // percentage
    averageMonthly: number;
    categories: {
        name: string;
        amount: number;
        percentage: number;
        trend: number;
    }[];
    deductibleAmount: number;
    deductiblePercentage: number;
    highestCategory: {
        name: string;
        amount: number;
    };
    projectedYear: number;
}

/**
 * Cost Categories Display Component
 * SRP: Handles only cost categories visualization
 */
const CostCategories: React.FC<{ categories: CostData['categories'] }> = ({ categories }) => {
    return (
        <div className="space-y-2">
            {categories.slice(0, 3).map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: `hsl(${index * 120}, 60%, 50%)` }}
                        />
                        <span className="text-gray-700 truncate">{category.name}</span>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold text-gray-900">
                            €{category.amount.toLocaleString('it-IT')}
                        </div>
                        <div className="text-xs text-gray-500">
                            {category.percentage.toFixed(1)}%
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * Cost Metrics Display Component
 * SRP: Handles only cost metrics rendering
 */
const CostMetrics: React.FC<{ data: CostData }> = ({ data }) => {
    const monthlyTrendIcon = data.monthlyTrend >= 0 ? TrendingUp : TrendingDown;
    const monthlyTrendColor = data.monthlyTrend >= 0 ? 'text-red-600' : 'text-green-600'; // Inverted for costs
    const monthlyTrendBg = data.monthlyTrend >= 0 ? 'bg-red-50' : 'bg-green-50';

    return (
        <div className="space-y-4">
            {/* Primary Metrics */}
            <div className="grid grid-cols-2 gap-4">
                {/* Current Month */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                        €{data.currentMonth.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-600">Questo Mese</div>
                </div>

                {/* Year to Date */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
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

            {/* Deductible Amount */}
            <div className="bg-green-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <PieChart className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">Deducibili</span>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold text-green-700">
                            €{data.deductibleAmount.toLocaleString('it-IT')}
                        </div>
                        <div className="text-xs text-green-600">
                            {data.deductiblePercentage.toFixed(1)}% del totale
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Categories */}
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Top Categorie
                </h4>
                <CostCategories categories={data.categories} />
            </div>

            {/* Highest Category Alert */}
            {data.highestCategory.amount > data.averageMonthly * 0.3 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <div className="text-sm">
                            <span className="text-yellow-700 font-medium">Attenzione: </span>
                            <span className="text-yellow-600">
                                {data.highestCategory.name} rappresenta il {
                                    ((data.highestCategory.amount / data.currentMonth) * 100).toFixed(1)
                                }% dei costi
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Cost Widget Component (Client-Side for Interactivity)
 * 
 * SRP Responsibilities:
 * 1. Cost data presentation ONLY
 * 2. Cost-specific metrics ONLY
 * 3. Cost category visualization ONLY
 * 
 * NOT responsible for:
 * - Generic widget container logic (delegated to WidgetContainer)
 * - Data fetching logic (delegated to useCostData hook)
 * - Dashboard layout management
 */
export const CostWidget: React.FC<CostWidgetProps> = ({
    config,
    data: _data,
    isEditing,
    onConfigChange,
    onRemove,
    onRefresh,
    showCategories: _showCategories = true,
    showDeductible: _showDeductible = true,
    monthsToAnalyze = 12,
    className = ''
}) => {
    // Use specialized hook for cost data
    const {
        costData,
        isLoading,
        error,
        refresh
    } = useCostData(monthsToAnalyze);

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
        data: costData,
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
            {costData && !isLoading && !error ? (
                <CostMetrics data={costData} />
            ) : (
                /* Loading/Error handled by WidgetContainer */
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Caricamento dati costi...</p>
                    </div>
                </div>
            )}
        </WidgetContainer>
    );
};

export default CostWidget;
