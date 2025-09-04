/**
 * Net Cash Flow Dot Component
 * 
 * Specialized dot component for cash flow charts
 * Single Responsibility: Render colored dots based on net value
 */

import React from 'react';
import type { CashFlowDataPoint } from '../types';
import { getNetCashFlowColor } from '@/utils/chartUtils';

export interface NetCashFlowDotProps {
    cx?: number;
    cy?: number;
    payload?: CashFlowDataPoint;
    radius?: number;
}

/**
 * Custom dot renderer for net cash flow line
 * Green for positive values, red for negative values
 */
export const NetCashFlowDot: React.FC<NetCashFlowDotProps> = ({
    cx,
    cy,
    payload,
    radius = 4
}) => {
    if (!payload || cx === undefined || cy === undefined) {
        return null;
    }

    const color = getNetCashFlowColor(payload.net);

    return (
        <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill={color}
            stroke="white"
            strokeWidth={2}
        />
    );
};

export default NetCashFlowDot;
