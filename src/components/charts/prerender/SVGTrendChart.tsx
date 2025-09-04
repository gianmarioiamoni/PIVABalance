/**
 * Server-Side SVG Trend Chart Renderer
 * 
 * Genera area chart SVG statico per trend analysis
 */

import React from 'react';
import type { TrendDataPoint } from '../types';
import type { SVGChartConfig } from './SVGChartRenderer';
import { createLinearScale, formatValue } from './SVGChartRenderer';

export interface SVGTrendChartProps {
    data: TrendDataPoint[];
    config?: Partial<SVGChartConfig>;
    title?: string;
}

/**
 * Genera path SVG per area chart
 */
const generateAreaPath = (
    points: Array<{ x: number; y: number }>,
    baseY: number
): string => {
    if (points.length === 0) return '';

    // Start from bottom left
    let pathData = `M ${points[0].x} ${baseY}`;

    // Line to first point
    pathData += ` L ${points[0].x} ${points[0].y}`;

    // Draw curve through points
    points.forEach((point, index) => {
        if (index > 0) {
            pathData += ` L ${point.x} ${point.y}`;
        }
    });

    // Close area to bottom
    const lastPoint = points[points.length - 1];
    pathData += ` L ${lastPoint.x} ${baseY}`;
    pathData += ' Z';

    return pathData;
};

export const SVGTrendChart: React.FC<SVGTrendChartProps> = ({
    data,
    config = {},
    title = "Trend Mensile"
}) => {
    const chartConfig = {
        width: 800,
        height: 350,
        margin: { top: 40, right: 30, bottom: 50, left: 60 },
        colors: ['#3B82F6', '#E5E7EB'],
        ...config
    };

    const { width, height, margin, colors } = chartConfig;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    if (!data.length) {
        return (
            <svg width={width} height={height} className="bg-white border rounded">
                <text x={width / 2} y={height / 2} textAnchor="middle" className="text-gray-500">
                    No data available
                </text>
            </svg>
        );
    }

    // Calculate scales
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const average = data.reduce((sum, d) => sum + d.value, 0) / data.length;

    const xScale = createLinearScale([0, data.length - 1], [0, chartWidth]);
    const yScale = createLinearScale([minValue * 0.9, maxValue * 1.1], [chartHeight, 0]);

    // Generate points
    const points = data.map((d, i) => ({
        x: xScale(i),
        y: yScale(d.value)
    }));

    const areaPath = generateAreaPath(points, chartHeight);
    const linePath = points.map((point, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command} ${point.x} ${point.y}`;
    }).join(' ');

    // Calculate growth
    const firstValue = data[0]?.value || 0;
    const lastValue = data[data.length - 1]?.value || 0;
    const overallGrowth = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

    // Growth indicator
    const growthColor = overallGrowth >= 0 ? '#10B981' : '#EF4444';
    const growthText = overallGrowth >= 0 ? `+${overallGrowth.toFixed(1)}%` : `${overallGrowth.toFixed(1)}%`;

    // Y-axis ticks
    const yTicks = 5;
    const yTickValues = Array.from({ length: yTicks }, (_, i) => {
        return minValue + (maxValue - minValue) * (i / (yTicks - 1));
    });

    return (
        <svg width={width} height={height} className="bg-white border rounded">
            {/* Title */}
            <text
                x={width / 2}
                y={25}
                textAnchor="middle"
                className="text-lg font-semibold fill-gray-900"
            >
                {title}
            </text>

            {/* Growth Indicator */}
            <text
                x={width - 20}
                y={35}
                textAnchor="end"
                fill={growthColor}
                className="text-sm font-medium"
            >
                {growthText}
            </text>

            {/* Chart Area */}
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Grid Lines */}
                {yTickValues.map((value, i) => (
                    <g key={i}>
                        <line
                            x1={0}
                            y1={yScale(value)}
                            x2={chartWidth}
                            y2={yScale(value)}
                            stroke="#f3f4f6"
                            strokeDasharray="3,3"
                        />
                        <text
                            x={-10}
                            y={yScale(value)}
                            textAnchor="end"
                            dominantBaseline="middle"
                            className="text-xs fill-gray-600"
                        >
                            €{formatValue(value)}
                        </text>
                    </g>
                ))}

                {/* Average Reference Line */}
                <line
                    x1={0}
                    y1={yScale(average)}
                    x2={chartWidth}
                    y2={yScale(average)}
                    stroke="#f59e0b"
                    strokeDasharray="4,4"
                    strokeWidth={2}
                />
                <text
                    x={chartWidth + 5}
                    y={yScale(average)}
                    dominantBaseline="middle"
                    className="text-xs fill-orange-600"
                >
                    Media
                </text>

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={colors[0]} stopOpacity={0.05} />
                    </linearGradient>
                </defs>

                {/* Area Fill */}
                <path
                    d={areaPath}
                    fill="url(#trendGradient)"
                    stroke="none"
                />

                {/* Trend Line */}
                <path
                    d={linePath}
                    fill="none"
                    stroke={colors[0]}
                    strokeWidth={3}
                />

                {/* Data Points */}
                {points.map((point, i) => (
                    <circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r={5}
                        fill={colors[0]}
                        stroke="white"
                        strokeWidth={2}
                    />
                ))}

                {/* X-Axis Labels */}
                {data.map((d, i) => (
                    <text
                        key={i}
                        x={xScale(i)}
                        y={chartHeight + 20}
                        textAnchor="middle"
                        className="text-xs fill-gray-600"
                    >
                        {d.period}
                    </text>
                ))}
            </g>

            {/* Stats Summary */}
            <g transform={`translate(${margin.left}, ${height - 35})`}>
                <text x={0} y={0} className="text-sm fill-gray-700">
                    Media: €{formatValue(average)}
                </text>
                <text x={150} y={0} className="text-sm fill-gray-700">
                    Max: €{formatValue(maxValue)}
                </text>
                <text x={280} y={0} className="text-sm fill-gray-700">
                    Min: €{formatValue(minValue)}
                </text>
            </g>
        </svg>
    );
};

export default SVGTrendChart;
