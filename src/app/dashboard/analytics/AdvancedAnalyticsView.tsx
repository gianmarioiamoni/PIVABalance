/**
 * Advanced Analytics View Component
 * 
 * SRP: Handles ONLY advanced analytics view orchestration
 * Client-side analytics dashboard with business intelligence
 */

'use client';

import React, { useState } from 'react';
import { Brain, BarChart3, FileText, Zap } from 'lucide-react';
import { BusinessAnalytics, AnalyticsPeriod } from '@/components/analytics/BusinessAnalytics';
import { ReportGenerator } from '@/components/reports/ReportGenerator';
import { HeatmapChart } from '@/components/charts/advanced/HeatmapChart';
import { useAuth } from '@/hooks/auth/useAuth';

/**
 * Analytics Tab Type
 * SRP: Defines only analytics tab options
 */
type AnalyticsTab = 'overview' | 'kpi' | 'reports' | 'heatmap';

/**
 * Analytics Tab Selector
 * SRP: Handles only tab selection UI
 */
const AnalyticsTabSelector: React.FC<{
    activeTab: AnalyticsTab;
    onTabChange: (tab: AnalyticsTab) => void;
}> = ({ activeTab, onTabChange }) => {
    const tabs: { value: AnalyticsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { value: 'overview', label: 'Panoramica', icon: Brain },
        { value: 'kpi', label: 'KPI Dashboard', icon: BarChart3 },
        { value: 'reports', label: 'Report Generator', icon: FileText },
        { value: 'heatmap', label: 'Heatmap Analisi', icon: Zap }
    ];

    return (
        <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map(tab => {
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => onTabChange(tab.value)}
                            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.value
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <IconComponent className="h-4 w-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

/**
 * Analytics Overview Component
 * SRP: Handles only analytics overview display
 */
const AnalyticsOverview: React.FC<{
    period: AnalyticsPeriod;
    onPeriodChange: (period: AnalyticsPeriod) => void;
    userId: string;
}> = ({ period, onPeriodChange, userId }) => {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                    <Brain className="h-8 w-8 text-blue-600" />
                    <div>
                        <h2 className="text-xl font-bold text-blue-900">Analytics Avanzate</h2>
                        <p className="text-blue-700">Business Intelligence per il tuo business freelance</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-600">📊</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">KPI Dashboard</div>
                        <div className="text-xs text-gray-600">Metriche chiave in tempo reale</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-green-600">📈</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">Trend Analysis</div>
                        <div className="text-xs text-gray-600">Analisi predittive e insights</div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-purple-600">📄</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">Report Avanzati</div>
                        <div className="text-xs text-gray-600">Export PDF/Excel personalizzati</div>
                    </div>
                </div>
            </div>

            {/* Business Analytics */}
            <BusinessAnalytics
                userId={userId}
                period={period}
                onPeriodChange={onPeriodChange}
            />
        </div>
    );
};

/**
 * Heatmap Analytics Component
 * SRP: Handles only heatmap analytics display
 */
const HeatmapAnalytics: React.FC<{
    userId: string;
}> = ({ userId: _userId }) => {
    // Mock heatmap data - would be fetched from analytics service
    const mockHeatmapData = Array.from({ length: 90 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - index);
        return {
            date: date.toISOString(),
            value: Math.random() * 5000 + 1000,
            label: `Giorno ${index + 1}`
        };
    });

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔥 Heatmap Ricavi</h3>
                <HeatmapChart
                    data={mockHeatmapData}
                    title="Distribuzione Ricavi Giornalieri"
                    colorScheme="blue"
                    cellSize="medium"
                    showLabels={false}
                    showLegend={true}
                    enableTooltip={true}
                    onCellClick={(_dataPoint) => {
                        // Handle cell click for drill-down
                    }}
                />
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🌡️ Heatmap Costi</h3>
                <HeatmapChart
                    data={mockHeatmapData.map(d => ({ ...d, value: d.value * 0.3 }))}
                    title="Distribuzione Costi Giornalieri"
                    colorScheme="red"
                    cellSize="medium"
                    showLabels={false}
                    showLegend={true}
                    enableTooltip={true}
                    onCellClick={(_dataPoint) => {
                        // Handle cost heatmap cell click
                    }}
                />
            </div>
        </div>
    );
};

/**
 * Advanced Analytics View Component (Client-Side)
 * 
 * SRP Responsibilities:
 * 1. Analytics view orchestration ONLY
 * 2. Tab management ONLY
 * 3. User session coordination ONLY
 * 
 * NOT responsible for:
 * - Analytics calculations (delegated to BusinessAnalytics)
 * - Report generation (delegated to ReportGenerator)
 * - Chart rendering (delegated to chart components)
 * - Data fetching (delegated to analytics hooks)
 */
export const AdvancedAnalyticsView: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
    const [analyticsPeriod, setAnalyticsPeriod] = useState<AnalyticsPeriod>('6months');

    if (!user?.id) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Accesso Richiesto</h3>
                    <p className="text-gray-600">Effettua l&apos;accesso per visualizzare le analytics avanzate</p>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <AnalyticsOverview
                        period={analyticsPeriod}
                        onPeriodChange={setAnalyticsPeriod}
                        userId={user.id}
                    />
                );

            case 'kpi':
                return (
                    <BusinessAnalytics
                        userId={user.id}
                        period={analyticsPeriod}
                        onPeriodChange={setAnalyticsPeriod}
                    />
                );

            case 'reports':
                return (
                    <ReportGenerator
                        userId={user.id}
                        onReportGenerated={(_reportUrl, _config) => {
                            // Handle report generation completion
                        }}
                    />
                );

            case 'heatmap':
                return (
                    <HeatmapAnalytics userId={user.id} />
                );

            default:
                return null;
        }
    };

    return (
        <div className="container-app py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">📊 Analytics Avanzate</h1>
                <p className="text-gray-600 mt-2">
                    Business Intelligence completa per ottimizzare il tuo business freelance
                </p>
            </div>

            {/* Analytics Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
                <AnalyticsTabSelector
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdvancedAnalyticsView;
