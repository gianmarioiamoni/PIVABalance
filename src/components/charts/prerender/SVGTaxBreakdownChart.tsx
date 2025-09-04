/**
 * Server-Side SVG Tax Breakdown Chart Renderer
 * 
 * Genera pie chart SVG statico per tax breakdown
 */

import React from 'react';
import type { TaxBreakdownDataPoint } from '../types';
import type { SVGChartConfig } from './SVGChartRenderer';

export interface SVGTaxBreakdownChartProps {
    data: TaxBreakdownDataPoint[];
    config?: Partial<SVGChartConfig>;
    title?: string;
    showPercentages?: boolean;
}

/**
 * Calcola coordinate per arco SVG
 */
const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

/**
 * Genera path SVG per slice del pie chart
 */
const createArcPath = (
    centerX: number,
    centerY: number,
    radius: number,
    startAngle: number,
    endAngle: number
): string => {
    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", centerX, centerY,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
};

export const SVGTaxBreakdownChart: React.FC<SVGTaxBreakdownChartProps> = ({
    data,
    config = {},
    title = "Ripartizione Tasse",
    showPercentages = true
}) => {
    const chartConfig = {
        width: 500,
        height: 400,
        margin: { top: 40, right: 20, bottom: 60, left: 20 },
        colors: [
            '#3B82F6', // Imposte dirette - Blue
            '#10B981', // INPS - Green
            '#F59E0B', // Fondi professionali - Amber
            '#EF4444', // IVA - Red
            '#8B5CF6', // Addizionali - Purple
            '#6B7280'  // Altri - Gray
        ],
        ...config
    };

    const { width, height, margin, colors } = chartConfig;

    if (!data.length) {
        return (
            <svg width={width} height={height} className="bg-white border rounded">
                <text x={width / 2} y={height / 2} textAnchor="middle" className="text-gray-500">
                    No data available
                </text>
            </svg>
        );
    }

    // Calculate total and percentages
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    const dataWithPercentages = data.map((item, index) => ({
        ...item,
        percentage: total > 0 ? (item.amount / total) * 100 : 0,
        color: item.color || colors[index % colors.length]
    }));

    // Chart dimensions
    const centerX = width / 2;
    const centerY = (height - margin.bottom) / 2 + margin.top;
    const radius = Math.min(centerX - margin.left, centerY - margin.top) - 20;
    const innerRadius = radius * 0.4; // Donut effect

    // Calculate angles
    let currentAngle = 0;
    const slices = dataWithPercentages.map(item => {
        const sliceAngle = (item.percentage / 100) * 360;
        const slice = {
            ...item,
            startAngle: currentAngle,
            endAngle: currentAngle + sliceAngle,
            midAngle: currentAngle + sliceAngle / 2
        };
        currentAngle += sliceAngle;
        return slice;
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

            {/* Pie Slices */}
            {slices.map((slice, index) => {
                if (slice.percentage < 0.5) return null; // Skip very small slices

                // Outer arc
                const outerPath = createArcPath(
                    centerX,
                    centerY,
                    radius,
                    slice.startAngle,
                    slice.endAngle
                );

                // Inner arc for donut
                const innerPath = createArcPath(
                    centerX,
                    centerY,
                    innerRadius,
                    slice.startAngle,
                    slice.endAngle
                );

                // Create donut slice path
                const donutPath = outerPath + " " + innerPath;

                return (
                    <g key={index}>
                        <path
                            d={donutPath}
                            fill={slice.color}
                            stroke="white"
                            strokeWidth={2}
                            fillRule="evenodd"
                        />

                        {/* Percentage labels for larger slices */}
                        {showPercentages && slice.percentage >= 5 && (
                            <text
                                x={centerX + (radius * 0.7) * Math.cos((slice.midAngle - 90) * Math.PI / 180)}
                                y={centerY + (radius * 0.7) * Math.sin((slice.midAngle - 90) * Math.PI / 180)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-sm font-semibold fill-white"
                            >
                                {slice.percentage.toFixed(1)}%
                            </text>
                        )}
                    </g>
                );
            })}

            {/* Center total */}
            <g>
                <text
                    x={centerX}
                    y={centerY - 8}
                    textAnchor="middle"
                    className="text-xl font-bold fill-gray-900"
                >
                    €{total.toLocaleString('it-IT')}
                </text>
                <text
                    x={centerX}
                    y={centerY + 12}
                    textAnchor="middle"
                    className="text-sm fill-gray-600"
                >
                    Totale tasse
                </text>
            </g>

            {/* Legend */}
            <g transform={`translate(20, ${height - margin.bottom + 10})`}>
                {slices.map((slice, index) => {
                    const legendX = (index % 3) * 150;
                    const legendY = Math.floor(index / 3) * 20;

                    return (
                        <g key={index} transform={`translate(${legendX}, ${legendY})`}>
                            <circle cx={6} cy={0} r={5} fill={slice.color} />
                            <text x={16} y={0} dominantBaseline="middle" className="text-xs fill-gray-700">
                                {slice.category}: €{slice.amount.toLocaleString('it-IT')}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
};

export default SVGTaxBreakdownChart;
