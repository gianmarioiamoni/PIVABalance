/**
 * Pie Custom Label Functions
 * 
 * Single Responsibility: Pure functions for pie chart label rendering
 * Compatible with Recharts label prop requirements
 */

import React from 'react';
import { shouldShowPieLabel, calculatePieLabelPosition } from '@/utils/chartUtils';

export interface PieLabelProps {
    cx?: number;
    cy?: number;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percentage?: number;
    fontSize?: number;
    fontWeight?: number;
}

/**
 * Pure function for pie chart custom labels
 * Compatible with Recharts label prop
 * Only shows labels for slices >= 5%
 */
export const renderPieCustomLabel = (props: PieLabelProps): React.ReactElement | null => {
    const {
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percentage,
        fontSize = 12,
        fontWeight = 600
    } = props;

    // Validate required props
    if (!percentage || !cx || !cy || midAngle === undefined || !innerRadius || !outerRadius) {
        return null;
    }

    // Don't show labels for small slices
    if (!shouldShowPieLabel(percentage)) {
        return null;
    }

    const { x, y } = calculatePieLabelPosition(cx, cy, midAngle, innerRadius, outerRadius);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize={fontSize}
            fontWeight={fontWeight}
        >
            {`${percentage.toFixed(1)}%`}
        </text>
    );
};

/**
 * Legacy component wrapper for backward compatibility
 * @deprecated Use renderPieCustomLabel function instead
 */
export const PieCustomLabel: React.FC<PieLabelProps> = (props) => {
    return renderPieCustomLabel(props);
};

export default PieCustomLabel;
