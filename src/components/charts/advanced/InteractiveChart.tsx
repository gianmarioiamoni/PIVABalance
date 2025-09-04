/**
 * Interactive Chart Component
 * 
 * SRP: Handles ONLY interactive chart functionality
 * Chart with zoom, pan, selection, and export capabilities
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, Square, Download, RotateCcw } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Brush,
    ReferenceLine
} from 'recharts';
import { AdvancedChartProps } from './types';

/**
 * Chart Zoom Hook
 * SRP: Handles only zoom functionality
 */
const useChartZoom = () => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoomDomain, setZoomDomain] = useState<{ startIndex?: number; endIndex?: number }>({});

    const zoomIn = useCallback(() => {
        setZoomLevel(prev => Math.min(prev * 1.5, 5));
    }, []);

    const zoomOut = useCallback(() => {
        setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
    }, []);

    const resetZoom = useCallback(() => {
        setZoomLevel(1);
        setZoomDomain({});
    }, []);

    const handleBrushChange = useCallback((brushData: { startIndex?: number; endIndex?: number }) => {
        setZoomDomain(brushData);
    }, []);

    return {
        zoomLevel,
        zoomDomain,
        zoomIn,
        zoomOut,
        resetZoom,
        handleBrushChange
    };
};

/**
 * Chart Selection Hook
 * SRP: Handles only data selection functionality
 */
const useChartSelection = (onDataSelect?: (data: Record<string, unknown>[]) => void) => {
    const [selectedData, setSelectedData] = useState<Record<string, unknown>[]>([]);
    const [selectionMode, setSelectionMode] = useState(false);

    const toggleSelection = useCallback(() => {
        setSelectionMode(prev => !prev);
        if (selectionMode) {
            setSelectedData([]);
        }
    }, [selectionMode]);

    const handleDataSelection = useCallback((data: Record<string, unknown>) => {
        if (selectionMode) {
            setSelectedData(prev => {
                const isSelected = prev.some(item => item.id === data.id);
                const newSelection = isSelected
                    ? prev.filter(item => item.id !== data.id)
                    : [...prev, data];

                if (onDataSelect) {
                    onDataSelect(newSelection);
                }

                return newSelection;
            });
        }
    }, [selectionMode, onDataSelect]);

    const clearSelection = useCallback(() => {
        setSelectedData([]);
        if (onDataSelect) {
            onDataSelect([]);
        }
    }, [onDataSelect]);

    return {
        selectedData,
        selectionMode,
        toggleSelection,
        handleDataSelection,
        clearSelection
    };
};

/**
 * Chart Toolbar Component
 * SRP: Handles only chart toolbar UI
 */
const ChartToolbar: React.FC<{
    zoomLevel: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    selectionMode: boolean;
    onToggleSelection: () => void;
    selectedCount: number;
    onClearSelection: () => void;
    onExport: () => void;
    enableExport: boolean;
}> = ({
    zoomLevel,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    selectionMode,
    onToggleSelection,
    selectedCount,
    onClearSelection,
    onExport,
    enableExport
}) => {
        return (
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                {/* Left Controls */}
                <div className="flex items-center space-x-2">
                    {/* Zoom Controls */}
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={onZoomOut}
                            disabled={zoomLevel <= 0.5}
                            className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>

                        <span className="text-sm text-gray-600 min-w-[60px] text-center">
                            {Math.round(zoomLevel * 100)}%
                        </span>

                        <button
                            onClick={onZoomIn}
                            disabled={zoomLevel >= 5}
                            className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>

                        <button
                            onClick={onResetZoom}
                            className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Selection Controls */}
                    <div className="flex items-center space-x-2 border-l border-gray-300 pl-3">
                        <button
                            onClick={onToggleSelection}
                            className={`flex items-center space-x-1 px-2 py-1 text-sm rounded transition-colors ${selectionMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Square className="h-4 w-4" />
                            <span>Selezione</span>
                        </button>

                        {selectedCount > 0 && (
                            <>
                                <span className="text-sm text-gray-600">
                                    {selectedCount} selezionati
                                </span>
                                <button
                                    onClick={onClearSelection}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Cancella
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center space-x-2">
                    {enableExport && (
                        <button
                            onClick={onExport}
                            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            <span>Esporta</span>
                        </button>
                    )}
                </div>
            </div>
        );
    };

/**
 * Interactive Chart Component (Client-Side)
 * 
 * SRP Responsibilities:
 * 1. Interactive chart orchestration ONLY
 * 2. User interaction coordination ONLY
 * 3. Chart state management ONLY
 * 
 * NOT responsible for:
 * - Chart rendering (delegated to InteractiveChartRenderer)
 * - Zoom logic (delegated to useChartZoom)
 * - Selection logic (delegated to useChartSelection)
 * - Toolbar UI (delegated to ChartToolbar)
 */
export const InteractiveChart: React.FC<AdvancedChartProps> = ({
    data,
    config,
    exportOptions,
    onExport,
    onDataSelect,
    className = ''
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

    // Use specialized hooks for functionality
    const {
        zoomLevel,
        zoomDomain,
        zoomIn,
        zoomOut,
        resetZoom,
        handleBrushChange
    } = useChartZoom();

    const {
        selectedData,
        selectionMode,
        toggleSelection,
        handleDataSelection: _handleDataSelection,
        clearSelection
    } = useChartSelection(onDataSelect);

    // Handle export functionality
    const handleExport = useCallback(async () => {
        if (onExport && exportOptions) {
            await onExport(exportOptions);
        }
    }, [onExport, exportOptions]);

    // Filter data based on zoom domain
    const displayData = zoomDomain.startIndex !== undefined && zoomDomain.endIndex !== undefined
        ? data.slice(zoomDomain.startIndex, zoomDomain.endIndex + 1)
        : data;

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Chart Toolbar */}
            <ChartToolbar
                zoomLevel={zoomLevel}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onResetZoom={resetZoom}
                selectionMode={selectionMode}
                onToggleSelection={toggleSelection}
                selectedCount={selectedData.length}
                onClearSelection={clearSelection}
                onExport={handleExport}
                enableExport={config.enableExport}
            />

            {/* Chart Content */}
            <div ref={chartRef} className="p-4">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                        />

                        {/* Reference lines for targets */}
                        {data.some(d => d.target) && (
                            <ReferenceLine
                                y={data.find(d => d.target)?.target as number}
                                stroke="#ef4444"
                                strokeDasharray="5 5"
                                label={{ value: "Target", position: "top" }}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>

                {/* Brush for zooming */}
                {config.enableZoom && (
                    <div className="mt-4">
                        <ResponsiveContainer width="100%" height={60}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1} dot={false} />
                                <Brush
                                    dataKey="name"
                                    height={40}
                                    stroke="#3b82f6"
                                    onChange={handleBrushChange}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveChart;
