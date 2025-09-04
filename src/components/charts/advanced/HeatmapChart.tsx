/**
 * Heatmap Chart Component
 * 
 * SRP: Handles ONLY heatmap visualization for temporal data analysis
 * Advanced chart for visualizing data patterns over time periods
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Thermometer } from 'lucide-react';

/**
 * Heatmap Data Point
 * SRP: Defines only heatmap data structure
 */
export interface HeatmapDataPoint {
    date: string;
    value: number;
    label?: string;
    category?: string;
}

/**
 * Heatmap Props
 * SRP: Interface for heatmap specific properties
 */
export interface HeatmapChartProps {
    data: HeatmapDataPoint[];
    title: string;
    colorScheme?: 'blue' | 'green' | 'red' | 'purple';
    cellSize?: 'small' | 'medium' | 'large';
    showLabels?: boolean;
    showLegend?: boolean;
    enableTooltip?: boolean;
    onCellClick?: (dataPoint: HeatmapDataPoint) => void;
    className?: string;
}

/**
 * Color Scale Calculator
 * SRP: Handles only color calculation logic
 */
const useColorScale = (
    data: HeatmapDataPoint[],
    colorScheme: string = 'blue'
) => {
    const { minValue, maxValue } = useMemo(() => {
        const values = data.map(d => d.value);
        return {
            minValue: Math.min(...values),
            maxValue: Math.max(...values)
        };
    }, [data]);

    const getColorIntensity = useCallback((value: number): number => {
        if (maxValue === minValue) return 0.5;
        return (value - minValue) / (maxValue - minValue);
    }, [minValue, maxValue]);

    const getColor = useCallback((value: number): string => {
        const intensity = getColorIntensity(value);

        const colorSchemes = {
            blue: {
                light: `rgba(59, 130, 246, ${0.1 + intensity * 0.8})`, // blue-500
                border: `rgba(59, 130, 246, ${0.3 + intensity * 0.4})`
            },
            green: {
                light: `rgba(16, 185, 129, ${0.1 + intensity * 0.8})`, // emerald-500
                border: `rgba(16, 185, 129, ${0.3 + intensity * 0.4})`
            },
            red: {
                light: `rgba(239, 68, 68, ${0.1 + intensity * 0.8})`, // red-500
                border: `rgba(239, 68, 68, ${0.3 + intensity * 0.4})`
            },
            purple: {
                light: `rgba(139, 92, 246, ${0.1 + intensity * 0.8})`, // violet-500
                border: `rgba(139, 92, 246, ${0.3 + intensity * 0.4})`
            }
        };

        return colorSchemes[colorScheme as keyof typeof colorSchemes]?.light || colorSchemes.blue.light;
    }, [colorScheme, getColorIntensity]);

    return {
        minValue,
        maxValue,
        getColor,
        getColorIntensity
    };
};

/**
 * Heatmap Grid Calculator
 * SRP: Handles only grid layout calculations
 */
const useHeatmapGrid = (data: HeatmapDataPoint[], cellSize: string = 'medium') => {
    const gridData = useMemo(() => {
        // Group data by month and day
        const grouped: Record<string, Record<string, HeatmapDataPoint>> = {};

        data.forEach(point => {
            const date = new Date(point.date);
            const _month = date.getMonth();
            const day = date.getDate();
            const monthKey = date.toLocaleDateString('it-IT', { month: 'short' });

            if (!grouped[monthKey]) {
                grouped[monthKey] = {};
            }
            grouped[monthKey][day] = point;
        });

        return grouped;
    }, [data]);

    const cellSizeClasses = {
        small: 'w-6 h-6',
        medium: 'w-8 h-8',
        large: 'w-10 h-10'
    };

    const cellClass = cellSizeClasses[cellSize as keyof typeof cellSizeClasses] || cellSizeClasses.medium;

    return {
        gridData,
        cellClass
    };
};

/**
 * Heatmap Legend Component
 * SRP: Handles only legend rendering
 */
const HeatmapLegend: React.FC<{
    minValue: number;
    maxValue: number;
    colorScheme: string;
    getColor: (value: number) => string;
}> = ({ minValue, maxValue, colorScheme: _colorScheme, getColor }) => {
    const legendSteps = 5;
    const stepValue = (maxValue - minValue) / (legendSteps - 1);

    return (
        <div className="flex items-center justify-center space-x-2 mt-4">
            <span className="text-xs text-gray-600">Meno</span>

            <div className="flex items-center space-x-1">
                {Array.from({ length: legendSteps }, (_, index) => {
                    const value = minValue + (stepValue * index);
                    return (
                        <div
                            key={index}
                            className="w-4 h-4 rounded-sm border"
                            style={{
                                backgroundColor: getColor(value),
                                borderColor: getColor(value)
                            }}
                            title={`€${value.toLocaleString('it-IT')}`}
                        />
                    );
                })}
            </div>

            <span className="text-xs text-gray-600">Più</span>

            <div className="ml-4 text-xs text-gray-600">
                €{minValue.toLocaleString('it-IT')} - €{maxValue.toLocaleString('it-IT')}
            </div>
        </div>
    );
};

/**
 * Heatmap Cell Component
 * SRP: Handles only individual cell rendering
 */
const HeatmapCell: React.FC<{
    dataPoint?: HeatmapDataPoint;
    cellClass: string;
    color: string;
    showLabels: boolean;
    onCellClick?: (dataPoint: HeatmapDataPoint) => void;
    enableTooltip: boolean;
}> = ({ dataPoint, cellClass, color, showLabels, onCellClick, enableTooltip }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    if (!dataPoint) {
        return <div className={`${cellClass} bg-gray-100 border border-gray-200 rounded-sm`} />;
    }

    return (
        <div className="relative">
            <div
                className={`${cellClass} border border-gray-300 rounded-sm cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10`}
                style={{ backgroundColor: color }}
                onClick={() => onCellClick && onCellClick(dataPoint)}
                onMouseEnter={() => enableTooltip && setShowTooltip(true)}
                onMouseLeave={() => enableTooltip && setShowTooltip(false)}
            >
                {showLabels && (
                    <div className="flex items-center justify-center h-full text-xs font-medium text-gray-700">
                        {dataPoint.value > 0 ? Math.round(dataPoint.value) : ''}
                    </div>
                )}
            </div>

            {/* Tooltip */}
            {enableTooltip && showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        <div>{new Date(dataPoint.date).toLocaleDateString('it-IT')}</div>
                        <div className="font-semibold">€{dataPoint.value.toLocaleString('it-IT')}</div>
                        {dataPoint.label && <div className="text-gray-300">{dataPoint.label}</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Heatmap Grid Component
 * SRP: Handles only grid layout rendering
 */
const HeatmapGrid: React.FC<{
    gridData: Record<string, Record<string, HeatmapDataPoint>>;
    cellClass: string;
    getColor: (value: number) => string;
    showLabels: boolean;
    onCellClick?: (dataPoint: HeatmapDataPoint) => void;
    enableTooltip: boolean;
}> = ({ gridData, cellClass, getColor, showLabels, onCellClick, enableTooltip }) => {
    const months = Object.keys(gridData);
    const maxDays = 31;

    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
                {/* Month Headers */}
                <div className="flex items-center mb-2">
                    <div className="w-8" /> {/* Spacer for day labels */}
                    {months.map(month => (
                        <div key={month} className="flex-1 text-center">
                            <div className="text-sm font-medium text-gray-700">{month}</div>
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="space-y-1">
                    {Array.from({ length: maxDays }, (_, dayIndex) => {
                        const day = dayIndex + 1;
                        return (
                            <div key={day} className="flex items-center space-x-1">
                                {/* Day Label */}
                                <div className="w-8 text-xs text-gray-600 text-right">
                                    {day}
                                </div>

                                {/* Cells for each month */}
                                {months.map(month => {
                                    const dataPoint = gridData[month]?.[day];
                                    return (
                                        <HeatmapCell
                                            key={`${month}-${day}`}
                                            dataPoint={dataPoint}
                                            cellClass={cellClass}
                                            color={dataPoint ? getColor(dataPoint.value) : '#f3f4f6'}
                                            showLabels={showLabels}
                                            onCellClick={onCellClick}
                                            enableTooltip={enableTooltip}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/**
 * Heatmap Chart Component (Client-Side for Interactivity)
 * 
 * SRP Responsibilities:
 * 1. Heatmap visualization orchestration ONLY
 * 2. Temporal data pattern display ONLY
 * 3. User interaction coordination ONLY
 * 
 * NOT responsible for:
 * - Color calculations (delegated to useColorScale)
 * - Grid calculations (delegated to useHeatmapGrid)
 * - Cell rendering (delegated to HeatmapCell)
 * - Legend rendering (delegated to HeatmapLegend)
 */
export const HeatmapChart: React.FC<HeatmapChartProps> = ({
    data,
    title,
    colorScheme = 'blue',
    cellSize = 'medium',
    showLabels = false,
    showLegend = true,
    enableTooltip = true,
    onCellClick,
    className = ''
}) => {
    // Use specialized hooks
    const { minValue, maxValue, getColor } = useColorScale(data, colorScheme);
    const { gridData, cellClass } = useHeatmapGrid(data, cellSize);

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Analisi temporale dati • {data.length} punti dati
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Heatmap</span>
                </div>
            </div>

            {/* Heatmap Content */}
            <div className="p-4">
                <HeatmapGrid
                    gridData={gridData}
                    cellClass={cellClass}
                    getColor={getColor}
                    showLabels={showLabels}
                    onCellClick={onCellClick}
                    enableTooltip={enableTooltip}
                />

                {/* Legend */}
                {showLegend && (
                    <HeatmapLegend
                        minValue={minValue}
                        maxValue={maxValue}
                        colorScheme={colorScheme}
                        getColor={getColor}
                    />
                )}
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
                <div className="text-sm text-gray-600">
                    Periodo: {new Date(data[0]?.date).toLocaleDateString('it-IT')} - {new Date(data[data.length - 1]?.date).toLocaleDateString('it-IT')}
                </div>

                <div className="text-sm text-gray-600">
                    Range: €{minValue.toLocaleString('it-IT')} - €{maxValue.toLocaleString('it-IT')}
                </div>
            </div>
        </div>
    );
};

export default HeatmapChart;
