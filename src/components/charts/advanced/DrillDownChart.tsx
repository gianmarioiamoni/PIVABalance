/**
 * Drill Down Chart Component
 * 
 * SRP: Handles ONLY chart drill-down functionality
 * Advanced chart with multi-level drill-down capabilities
 */

'use client';

import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Home, Download, Maximize2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DrillDownLevel, ChartDrillDownState, AdvancedChartProps } from './types';

/**
 * Drill Down Navigation Hook
 * SRP: Handles only drill-down navigation state
 */
const useDrillDownNavigation = (initialLevels: DrillDownLevel[], initialLevel: number = 0) => {
    const [state, setState] = useState<ChartDrillDownState>({
        currentLevel: initialLevel,
        levels: initialLevels,
        breadcrumbs: initialLevels.slice(0, initialLevel + 1).map(level => ({
            id: level.id,
            name: level.name
        })),
        canDrillDown: initialLevel < initialLevels.length - 1,
        canDrillUp: initialLevel > 0
    });

    const drillDown = useCallback((levelId: string, dataPoint: Record<string, unknown>) => {
        const nextLevel = state.currentLevel + 1;
        if (nextLevel < state.levels.length) {
            setState(prev => ({
                ...prev,
                currentLevel: nextLevel,
                breadcrumbs: [...prev.breadcrumbs, { id: levelId, name: dataPoint.name as string || 'Unknown' }],
                canDrillDown: nextLevel < prev.levels.length - 1,
                canDrillUp: true
            }));
        }
    }, [state.currentLevel, state.levels.length]);

    const drillUp = useCallback(() => {
        if (state.canDrillUp) {
            const prevLevel = state.currentLevel - 1;
            setState(prev => ({
                ...prev,
                currentLevel: prevLevel,
                breadcrumbs: prev.breadcrumbs.slice(0, -1),
                canDrillDown: true,
                canDrillUp: prevLevel > 0
            }));
        }
    }, [state.canDrillUp, state.currentLevel]);

    const resetToTop = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentLevel: 0,
            breadcrumbs: [prev.levels[0]].map(level => ({ id: level.id, name: level.name })),
            canDrillDown: prev.levels.length > 1,
            canDrillUp: false
        }));
    }, []);

    return {
        state,
        drillDown,
        drillUp,
        resetToTop
    };
};

/**
 * Chart Breadcrumb Navigation
 * SRP: Handles only breadcrumb navigation UI
 */
const ChartBreadcrumbs: React.FC<{
    breadcrumbs: { id: string; name: string }[];
    onNavigate: (levelIndex: number) => void;
    onReset: () => void;
}> = ({ breadcrumbs, onNavigate, onReset }) => {
    return (
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button
                onClick={onReset}
                className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-100 rounded transition-colors"
            >
                <Home className="h-3 w-3" />
                <span>Home</span>
            </button>

            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.id}>
                    <ChevronRight className="h-3 w-3" />
                    <button
                        onClick={() => onNavigate(index)}
                        className={`px-2 py-1 hover:bg-gray-100 rounded transition-colors ${index === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : ''
                            }`}
                    >
                        {crumb.name}
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
};

/**
 * Chart Controls Component
 * SRP: Handles only chart control buttons
 */
const ChartControls: React.FC<{
    canDrillUp: boolean;
    onDrillUp: () => void;
    onExport: () => void;
    onFullscreen: () => void;
    enableExport: boolean;
}> = ({ canDrillUp, onDrillUp, onExport, onFullscreen, enableExport }) => {
    return (
        <div className="flex items-center space-x-2">
            {/* Drill Up Button */}
            <button
                onClick={onDrillUp}
                disabled={!canDrillUp}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-4 w-4" />
                <span>Indietro</span>
            </button>

            {/* Export Button */}
            {enableExport && (
                <button
                    onClick={onExport}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    <Download className="h-4 w-4" />
                    <span>Esporta</span>
                </button>
            )}

            {/* Fullscreen Button */}
            <button
                onClick={onFullscreen}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
                <Maximize2 className="h-4 w-4" />
            </button>
        </div>
    );
};

/**
 * Interactive Chart Renderer
 * SRP: Handles only chart rendering with interactions
 */
const InteractiveChartRenderer: React.FC<{
    data: Record<string, unknown>[];
    config: AdvancedChartProps['config'];
    onDataPointClick?: (dataPoint: Record<string, unknown>) => void;
    height: number;
}> = ({ data, config, onDataPointClick, height }) => {
    const handleBarClick = (data: unknown) => {
        if (config.enableDrillDown && onDataPointClick) {
            onDataPointClick(data as Record<string, unknown>);
        }
    };

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                {config.enableTooltip && (
                    <Tooltip
                        formatter={(value: number) => [`€${value.toLocaleString('it-IT')}`, 'Valore']}
                        labelFormatter={(label) => `Periodo: ${label}`}
                        contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                )}
                <Legend />
                <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    cursor={config.enableDrillDown ? 'pointer' : 'default'}
                    onClick={handleBarClick}
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

/**
 * Drill Down Chart Component (Client-Side for Interactivity)
 * 
 * SRP Responsibilities:
 * 1. Chart drill-down orchestration ONLY
 * 2. Multi-level navigation ONLY
 * 3. Interactive chart coordination ONLY
 * 
 * NOT responsible for:
 * - Data fetching (handled by parent)
 * - Chart rendering logic (delegated to InteractiveChartRenderer)
 * - Navigation UI (delegated to ChartBreadcrumbs)
 * - Control UI (delegated to ChartControls)
 */
export const DrillDownChart: React.FC<AdvancedChartProps> = ({
    data,
    config,
    drillDownConfig,
    exportOptions,
    onDrillDown,
    onDrillUp,
    onExport,
    onDataSelect: _onDataSelect,
    className = ''
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Initialize drill-down navigation if config provided
    const drillDownLevels = drillDownConfig?.levels || [
        { id: 'root', name: 'Overview', data, level: 0 }
    ];

    const {
        state: drillState,
        drillDown,
        drillUp,
        resetToTop
    } = useDrillDownNavigation(drillDownLevels, drillDownConfig?.initialLevel || 0);

    // Handle data point click for drill-down
    const handleDataPointClick = useCallback((dataPoint: Record<string, unknown>) => {
        if (config.enableDrillDown && drillState.canDrillDown) {
            const currentLevel = drillState.levels[drillState.currentLevel];
            drillDown(currentLevel.id, dataPoint);

            if (onDrillDown) {
                onDrillDown(currentLevel.id, dataPoint);
            }
        }
    }, [config.enableDrillDown, drillState, drillDown, onDrillDown]);

    // Handle drill up
    const handleDrillUp = useCallback(() => {
        const currentLevel = drillState.levels[drillState.currentLevel];
        drillUp();

        if (onDrillUp) {
            onDrillUp(currentLevel.id);
        }
    }, [drillState, drillUp, onDrillUp]);

    // Handle export
    const handleExport = useCallback(async () => {
        if (onExport && exportOptions) {
            await onExport(exportOptions);
        }
    }, [onExport, exportOptions]);

    // Handle fullscreen toggle
    const handleFullscreen = useCallback(() => {
        setIsFullscreen(!isFullscreen);
    }, [isFullscreen]);

    // Get current level data
    const currentLevelData = drillState.levels[drillState.currentLevel]?.data || data;

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className} ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''
            }`}>
            {/* Chart Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {drillState.levels[drillState.currentLevel]?.name || 'Advanced Chart'}
                    </h3>

                    {/* Breadcrumbs */}
                    {config.enableDrillDown && drillState.breadcrumbs.length > 1 && (
                        <ChartBreadcrumbs
                            breadcrumbs={drillState.breadcrumbs}
                            onNavigate={(levelIndex) => {
                                // Navigate to specific level
                                while (drillState.currentLevel > levelIndex) {
                                    handleDrillUp();
                                }
                            }}
                            onReset={resetToTop}
                        />
                    )}
                </div>

                {/* Chart Controls */}
                <ChartControls
                    canDrillUp={drillState.canDrillUp}
                    onDrillUp={handleDrillUp}
                    onExport={handleExport}
                    onFullscreen={handleFullscreen}
                    enableExport={config.enableExport}
                />
            </div>

            {/* Chart Content */}
            <div className="p-4">
                <InteractiveChartRenderer
                    data={currentLevelData}
                    config={config}
                    onDataPointClick={handleDataPointClick}
                    height={isFullscreen ? 600 : 400}
                />
            </div>

            {/* Chart Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
                <div className="text-sm text-gray-600">
                    Livello: {drillState.currentLevel + 1}/{drillState.levels.length} •
                    Dati: {currentLevelData.length} elementi
                </div>

                {config.enableDrillDown && drillState.canDrillDown && (
                    <div className="text-sm text-blue-600">
                        💡 Clicca su una barra per approfondire
                    </div>
                )}
            </div>
        </div>
    );
};

export default DrillDownChart;
