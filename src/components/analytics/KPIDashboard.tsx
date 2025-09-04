/**
 * KPI Dashboard Component
 * 
 * SRP: Handles ONLY KPI dashboard orchestration and layout
 * Business Intelligence dashboard with advanced KPI visualization
 */

'use client';

import React, { useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Target,
    AlertTriangle,
    CheckCircle,
    Clock,
    Activity
} from 'lucide-react';
import { KPIMetric, BusinessInsight } from '../charts/advanced/types';

/**
 * KPI Dashboard Props
 * SRP: Interface for KPI dashboard specific properties
 */
export interface KPIDashboardProps {
    kpis: KPIMetric[];
    insights: BusinessInsight[];
    period: string;
    lastUpdated: Date;
    onKPIClick?: (kpi: KPIMetric) => void;
    onInsightAction?: (insight: BusinessInsight, action: string) => void;
    className?: string;
}

/**
 * KPI Card Component
 * SRP: Handles only individual KPI card rendering
 */
const KPICard: React.FC<{
    kpi: KPIMetric;
    onClick?: (kpi: KPIMetric) => void;
}> = ({ kpi, onClick }) => {
    const trendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Target;
    const trendColor = kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-gray-600';
    const statusColor = kpi.status === 'good' ? 'border-green-200 bg-green-50' :
        kpi.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
            'border-red-200 bg-red-50';

    const formatValue = (value: number, unit: string): string => {
        if (unit === 'currency') {
            return `€${value.toLocaleString('it-IT')}`;
        } else if (unit === 'percentage') {
            return `${value.toFixed(1)}%`;
        } else if (unit === 'number') {
            return value.toLocaleString('it-IT');
        }
        return `${value} ${unit}`;
    };

    return (
        <div
            className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${statusColor}`}
            onClick={() => onClick && onClick(kpi)}
        >
            {/* KPI Header */}
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">{kpi.name}</h4>
                {React.createElement(trendIcon, { className: `h-4 w-4 ${trendColor}` })}
            </div>

            {/* KPI Value */}
            <div className="mb-2">
                <div className="text-2xl font-bold text-gray-900">
                    {formatValue(kpi.value, kpi.unit)}
                </div>

                {/* Trend */}
                <div className={`text-sm flex items-center space-x-1 ${trendColor}`}>
                    <span>{kpi.trendPercentage >= 0 ? '+' : ''}{kpi.trendPercentage.toFixed(1)}%</span>
                    <span className="text-gray-500">vs precedente</span>
                </div>
            </div>

            {/* Target Progress (if available) */}
            {kpi.target && (
                <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Target</span>
                        <span>{formatValue(kpi.target, kpi.unit)}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${kpi.value >= kpi.target ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                            style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {((kpi.value / kpi.target) * 100).toFixed(1)}% del target
                    </div>
                </div>
            )}

            {/* Description */}
            {kpi.description && (
                <p className="text-xs text-gray-600 mt-2">{kpi.description}</p>
            )}
        </div>
    );
};

/**
 * Insight Card Component
 * SRP: Handles only business insight rendering
 */
const InsightCard: React.FC<{
    insight: BusinessInsight;
    onAction?: (insight: BusinessInsight, action: string) => void;
}> = ({ insight, onAction }) => {
    const getInsightIcon = () => {
        switch (insight.type) {
            case 'opportunity': return { icon: CheckCircle, color: 'text-green-600' };
            case 'risk': return { icon: AlertTriangle, color: 'text-red-600' };
            case 'trend': return { icon: TrendingUp, color: 'text-blue-600' };
            case 'anomaly': return { icon: Activity, color: 'text-orange-600' };
            default: return { icon: Activity, color: 'text-gray-600' };
        }
    };

    const getImpactColor = () => {
        switch (insight.impact) {
            case 'high': return 'border-red-200 bg-red-50';
            case 'medium': return 'border-yellow-200 bg-yellow-50';
            case 'low': return 'border-blue-200 bg-blue-50';
            default: return 'border-gray-200 bg-gray-50';
        }
    };

    const { icon: InsightIcon, color } = getInsightIcon();

    return (
        <div className={`p-4 rounded-lg border ${getImpactColor()}`}>
            {/* Insight Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <InsightIcon className={`h-5 w-5 ${color}`} />
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                            <span className="capitalize">{insight.type}</span>
                            <span>•</span>
                            <span className="capitalize">Impatto {insight.impact}</span>
                            <span>•</span>
                            <span>{insight.confidence}% confidenza</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-3">{insight.description}</p>

            {/* Suggested Actions */}
            {insight.actionable && insight.suggestedActions && insight.suggestedActions.length > 0 && (
                <div className="space-y-2">
                    <h5 className="text-xs font-medium text-gray-800">Azioni Suggerite:</h5>
                    <div className="space-y-1">
                        {insight.suggestedActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => onAction && onAction(insight, action)}
                                className="block w-full text-left text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            >
                                • {action}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * KPI Grid Component
 * SRP: Handles only KPI grid layout
 */
const KPIGrid: React.FC<{
    kpis: KPIMetric[];
    onKPIClick?: (kpi: KPIMetric) => void;
}> = ({ kpis, onKPIClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kpis.map(kpi => (
                <KPICard key={kpi.id} kpi={kpi} onClick={onKPIClick} />
            ))}
        </div>
    );
};

/**
 * Insights Panel Component
 * SRP: Handles only insights panel layout
 */
const InsightsPanel: React.FC<{
    insights: BusinessInsight[];
    onInsightAction?: (insight: BusinessInsight, action: string) => void;
}> = ({ insights, onInsightAction }) => {
    const [filter, setFilter] = useState<'all' | 'opportunity' | 'risk' | 'trend' | 'anomaly'>('all');

    const filteredInsights = filter === 'all'
        ? insights
        : insights.filter(insight => insight.type === filter);

    return (
        <div className="space-y-4">
            {/* Insights Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">💡 Business Insights</h3>

                {/* Filter */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as typeof filter)}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tutti ({insights.length})</option>
                    <option value="opportunity">Opportunità ({insights.filter(i => i.type === 'opportunity').length})</option>
                    <option value="risk">Rischi ({insights.filter(i => i.type === 'risk').length})</option>
                    <option value="trend">Trend ({insights.filter(i => i.type === 'trend').length})</option>
                    <option value="anomaly">Anomalie ({insights.filter(i => i.type === 'anomaly').length})</option>
                </select>
            </div>

            {/* Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredInsights.map(insight => (
                    <InsightCard
                        key={insight.id}
                        insight={insight}
                        onAction={onInsightAction}
                    />
                ))}
            </div>

            {filteredInsights.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nessun insight disponibile per questo filtro</p>
                </div>
            )}
        </div>
    );
};

/**
 * KPI Dashboard Component (Client-Side for Interactivity)
 * 
 * SRP Responsibilities:
 * 1. KPI dashboard layout orchestration ONLY
 * 2. Business intelligence coordination ONLY
 * 3. User interaction management ONLY
 * 
 * NOT responsible for:
 * - KPI calculations (handled by data hooks)
 * - Individual KPI rendering (delegated to KPICard)
 * - Insights analysis (delegated to InsightsPanel)
 * - Grid layout (delegated to KPIGrid)
 */
export const KPIDashboard: React.FC<KPIDashboardProps> = ({
    kpis,
    insights,
    period,
    lastUpdated,
    onKPIClick,
    onInsightAction,
    className = ''
}) => {
    return (
        <div className={`space-y-6 ${className}`}>
            {/* Dashboard Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">📊 Business Intelligence</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Analisi KPI • Periodo: {period}
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>Aggiornato: {lastUpdated.toLocaleTimeString('it-IT')}</span>
                        </div>

                        <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-gray-600">
                                    {kpis.filter(k => k.status === 'good').length} Buoni
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-xs text-gray-600">
                                    {kpis.filter(k => k.status === 'warning').length} Attenzione
                                </span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-xs text-gray-600">
                                    {kpis.filter(k => k.status === 'critical').length} Critici
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Key Performance Indicators</h3>
                <KPIGrid kpis={kpis} onKPIClick={onKPIClick} />
            </div>

            {/* Insights Panel */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <InsightsPanel insights={insights} onInsightAction={onInsightAction} />
            </div>
        </div>
    );
};

export default KPIDashboard;
