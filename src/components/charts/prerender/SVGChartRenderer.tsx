/**
 * Server-Side SVG Chart Renderer
 * 
 * Genera SVG statici lato server per preview immediati
 * Compatible with SSR e SEO-friendly
 */

import React from 'react';
import type {
    CashFlowDataPoint
} from '../types';

// =============================================================================
// SVG CHART DIMENSIONS & CONFIG
// =============================================================================

export interface SVGChartConfig {
    width: number;
    height: number;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    colors: string[];
}

export const DEFAULT_SVG_CONFIG: SVGChartConfig = {
    width: 800,
    height: 400,
    margin: { top: 20, right: 30, bottom: 40, left: 60 },
    colors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Calcola scale lineare per coordinate SVG
 */
export const createLinearScale = (
    domain: [number, number],
    range: [number, number]
) => {
    const [domainMin, domainMax] = domain;
    const [rangeMin, rangeMax] = range;
    const scale = (rangeMax - rangeMin) / (domainMax - domainMin);

    return (value: number): number => {
        return rangeMin + (value - domainMin) * scale;
    };
};

/**
 * Formatta valori per display
 */
export const formatValue = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
};

/**
 * Genera path SVG per line chart
 */
export const generateLinePath = (
    points: Array<{ x: number; y: number }>
): string => {
    if (points.length === 0) return '';

    const pathData = points.map((point, index) => {
        const command = index === 0 ? 'M' : 'L';
        return `${command} ${point.x} ${point.y}`;
    }).join(' ');

    return pathData;
};

// =============================================================================
// CASH FLOW SVG RENDERER
// =============================================================================

export interface SVGCashFlowChartProps {
    data: CashFlowDataPoint[];
    config?: Partial<SVGChartConfig>;
    title?: string;
}

export const SVGCashFlowChart: React.FC<SVGCashFlowChartProps> = ({
    data,
    config = {},
    title = "Cash Flow"
}) => {
    const chartConfig = { ...DEFAULT_SVG_CONFIG, ...config };
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
    const maxValue = Math.max(
        ...data.map(d => Math.max(d.income, Math.abs(d.expenses), Math.abs(d.net)))
    );
    const minValue = Math.min(
        ...data.map(d => Math.min(-Math.abs(d.expenses), d.net))
    );

    const xScale = createLinearScale([0, data.length - 1], [0, chartWidth]);
    const yScale = createLinearScale([minValue, maxValue], [chartHeight, 0]);

    // Generate line paths
    const incomePoints = data.map((d, i) => ({
        x: xScale(i),
        y: yScale(d.income)
    }));

    const expensePoints = data.map((d, i) => ({
        x: xScale(i),
        y: yScale(Math.abs(d.expenses))
    }));

    const netPoints = data.map((d, i) => ({
        x: xScale(i),
        y: yScale(d.net)
    }));

    const incomePath = generateLinePath(incomePoints);
    const expensePath = generateLinePath(expensePoints);
    const netPath = generateLinePath(netPoints);

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
                y={20}
                textAnchor="middle"
                className="text-lg font-semibold fill-gray-900"
            >
                {title}
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

                {/* Zero Line */}
                <line
                    x1={0}
                    y1={yScale(0)}
                    x2={chartWidth}
                    y2={yScale(0)}
                    stroke="#6b7280"
                    strokeWidth={2}
                />

                {/* Income Line */}
                <path
                    d={incomePath}
                    fill="none"
                    stroke={colors[0]}
                    strokeWidth={3}
                />

                {/* Expense Line */}
                <path
                    d={expensePath}
                    fill="none"
                    stroke={colors[1]}
                    strokeWidth={3}
                />

                {/* Net Line */}
                <path
                    d={netPath}
                    fill="none"
                    stroke={colors[2]}
                    strokeWidth={4}
                />

                {/* Data Points */}
                {incomePoints.map((point, i) => (
                    <circle
                        key={`income-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r={4}
                        fill={colors[0]}
                        stroke="white"
                        strokeWidth={2}
                    />
                ))}

                {expensePoints.map((point, i) => (
                    <circle
                        key={`expense-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r={4}
                        fill={colors[1]}
                        stroke="white"
                        strokeWidth={2}
                    />
                ))}

                {netPoints.map((point, i) => (
                    <circle
                        key={`net-${i}`}
                        cx={point.x}
                        cy={point.y}
                        r={5}
                        fill={data[i].net >= 0 ? '#10B981' : '#EF4444'}
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
                        {d.month}
                    </text>
                ))}
            </g>

            {/* Legend */}
            <g transform={`translate(${margin.left}, ${height - 30})`}>
                <g>
                    <circle cx={0} cy={0} r={4} fill={colors[0]} />
                    <text x={10} y={0} dominantBaseline="middle" className="text-sm fill-gray-700">
                        Entrate
                    </text>
                </g>
                <g transform="translate(80, 0)">
                    <circle cx={0} cy={0} r={4} fill={colors[1]} />
                    <text x={10} y={0} dominantBaseline="middle" className="text-sm fill-gray-700">
                        Uscite
                    </text>
                </g>
                <g transform="translate(160, 0)">
                    <circle cx={0} cy={0} r={4} fill={colors[2]} />
                    <text x={10} y={0} dominantBaseline="middle" className="text-sm fill-gray-700">
                        Netto
                    </text>
                </g>
            </g>
        </svg>
    );
};

export default SVGCashFlowChart;
