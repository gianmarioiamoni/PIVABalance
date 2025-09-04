/**
 * Performance Dashboard Component
 * SRP: Displays performance metrics and monitoring data ONLY
 */

'use client';

import React, { useState } from 'react';
import {
    Activity,
    Zap,
    Clock,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Monitor,
    Smartphone
} from 'lucide-react';
import {
    usePerformanceMonitoring,
    useRealTimePerformance
} from '@/hooks/performance/usePerformanceMonitoring';

interface PerformanceDashboardProps {
    className?: string;
    showRealTime?: boolean;
    autoCollect?: boolean;
}

/**
 * Performance Metrics Card Component
 * SRP: Single metric display ONLY
 */
const PerformanceMetricCard: React.FC<{
    title: string;
    value: number;
    unit: string;
    budget: number;
    icon: React.ReactNode;
    format?: (value: number) => string;
}> = ({ title, value, unit, budget, icon, format }) => {
    const isWithinBudget = value <= budget;
    const percentage = (value / budget) * 100;

    const formatValue = format || ((v: number) => v.toFixed(0));

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-sm font-medium text-gray-700">{title}</h3>
                </div>
                {isWithinBudget ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${isWithinBudget ? 'text-green-600' : 'text-red-600'}`}>
                        {formatValue(value)}
                    </span>
                    <span className="text-sm text-gray-500">{unit}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500">Budget: {formatValue(budget)}{unit}</span>
                    <span className={`font-medium ${isWithinBudget ? 'text-green-600' : 'text-red-600'}`}>
                        ({percentage.toFixed(0)}%)
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${isWithinBudget ? 'bg-green-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

/**
 * Performance Score Component
 * SRP: Overall score visualization ONLY
 */
const PerformanceScoreCard: React.FC<{
    score: number;
    violations: string[];
}> = ({ score, violations }) => {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 90) return 'bg-green-50';
        if (score >= 70) return 'bg-yellow-50';
        return 'bg-red-50';
    };

    return (
        <div className={`rounded-lg border p-6 ${getScoreBgColor(score)}`}>
            <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                    <Activity className={`h-8 w-8 ${getScoreColor(score)}`} />
                </div>

                <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
                    {score}/100
                </div>

                <p className="text-sm text-gray-600 mb-4">Performance Score</p>

                {violations.length > 0 && (
                    <div className="text-left">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Critical Issues:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            {violations.map((violation, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
                                    {violation}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * Real-Time Performance Monitor Component
 * SRP: Real-time metrics display ONLY
 */
const RealTimeMonitor: React.FC<{
    isActive: boolean;
    onToggle: () => void;
}> = ({ isActive: _isActive, onToggle }) => {
    const {
        metricsHistory,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
        latestMetrics
    } = useRealTimePerformance(10000); // Every 10 seconds

    const handleToggle = () => {
        if (isMonitoring) {
            stopMonitoring();
        } else {
            startMonitoring();
        }
        onToggle();
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Real-Time Monitoring</h3>
                <button
                    onClick={handleToggle}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isMonitoring
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                >
                    {isMonitoring ? 'Stop' : 'Start'} Monitoring
                </button>
            </div>

            {isMonitoring && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Monitoring active ({metricsHistory.length} samples)
                    </div>

                    {latestMetrics && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-gray-500">Page Load:</span>
                                <span className="ml-2 font-medium">{latestMetrics.pageLoad.toFixed(0)}ms</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Memory:</span>
                                <span className="ml-2 font-medium">
                                    {latestMetrics.memoryUsage
                                        ? `${(latestMetrics.memoryUsage / 1024 / 1024).toFixed(1)}MB`
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!isMonitoring && metricsHistory.length === 0 && (
                <p className="text-sm text-gray-500">Click &quot;Start Monitoring&quot; to begin real-time performance tracking</p>
            )}
        </div>
    );
};

/**
 * Performance Dashboard Main Component
 * SRP: Performance dashboard orchestration ONLY
 */
export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
    className = '',
    showRealTime = true,
    autoCollect = true,
}) => {
    const [isRealTimeActive, setIsRealTimeActive] = useState(false);
    const {
        metrics,
        isCollecting,
        budgetStatus,
        error,
        collectMetrics,
        resetMetrics
    } = usePerformanceMonitoring(autoCollect);

    const handleManualCollection = async () => {
        await collectMetrics();
    };

    const handleRealTimeToggle = () => {
        setIsRealTimeActive(!isRealTimeActive);
    };

    if (error) {
        return (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
                <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Performance Monitoring Error</span>
                </div>
                <p className="text-sm text-red-600 mt-2">{error}</p>
                <button
                    onClick={resetMetrics}
                    className="mt-3 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                    Reset
                </button>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Performance Monitoring</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Real-time performance metrics and budget compliance
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleManualCollection}
                        disabled={isCollecting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                    >
                        {isCollecting ? 'Collecting...' : 'Collect Metrics'}
                    </button>
                </div>
            </div>

            {/* Performance Score */}
            {budgetStatus && (
                <PerformanceScoreCard
                    score={budgetStatus.score}
                    violations={budgetStatus.violations}
                />
            )}

            {/* Core Web Vitals */}
            {metrics && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <PerformanceMetricCard
                            title="Page Load Time"
                            value={metrics.pageLoad}
                            unit="ms"
                            budget={2000}
                            icon={<Clock className="h-4 w-4 text-blue-500" />}
                        />

                        <PerformanceMetricCard
                            title="First Contentful Paint"
                            value={metrics.firstContentfulPaint}
                            unit="ms"
                            budget={1200}
                            icon={<Zap className="h-4 w-4 text-yellow-500" />}
                        />

                        <PerformanceMetricCard
                            title="Largest Contentful Paint"
                            value={metrics.largestContentfulPaint}
                            unit="ms"
                            budget={2500}
                            icon={<Monitor className="h-4 w-4 text-purple-500" />}
                        />

                        <PerformanceMetricCard
                            title="Cumulative Layout Shift"
                            value={metrics.cumulativeLayoutShift}
                            unit=""
                            budget={0.1}
                            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                            format={(value) => value.toFixed(3)}
                        />

                        <PerformanceMetricCard
                            title="First Input Delay"
                            value={metrics.firstInputDelay}
                            unit="ms"
                            budget={100}
                            icon={<Smartphone className="h-4 w-4 text-indigo-500" />}
                        />

                        {metrics.memoryUsage && (
                            <PerformanceMetricCard
                                title="Memory Usage"
                                value={metrics.memoryUsage}
                                unit="MB"
                                budget={50 * 1024 * 1024} // 50MB
                                icon={<Activity className="h-4 w-4 text-red-500" />}
                                format={(value) => (value / 1024 / 1024).toFixed(1)}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Real-Time Monitoring */}
            {showRealTime && (
                <RealTimeMonitor
                    isActive={isRealTimeActive}
                    onToggle={handleRealTimeToggle}
                />
            )}

            {/* Performance Tips */}
            {budgetStatus && !budgetStatus.isWithinBudget && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-700 mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-medium">Performance Optimization Suggestions</span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Consider implementing code splitting for large components</li>
                        <li>• Optimize images using next/image with WebP format</li>
                        <li>• Enable compression and caching headers</li>
                        <li>• Review and optimize third-party dependencies</li>
                        <li>• Implement lazy loading for below-the-fold content</li>
                    </ul>
                </div>
            )}

            {/* Collection Status */}
            {!metrics && !isCollecting && (
                <div className="text-center py-8">
                    <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Performance Data</h3>
                    <p className="text-gray-600 mb-4">
                        Click &quot;Collect Metrics&quot; to start performance monitoring
                    </p>
                </div>
            )}
        </div>
    );
};
