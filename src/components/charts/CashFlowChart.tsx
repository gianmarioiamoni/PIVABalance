'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ChartContainer } from './client/ChartContainer';
import { ChartTooltip, currencyTooltipFormatter, dateTooltipLabelFormatter } from './client/ChartTooltip';
import { NetCashFlowDot } from './subcomponents';
import { transformCashFlowData, formatCurrencyCompact } from '@/utils/chartUtils';
import type { CashFlowDataPoint, ChartConfig } from './types';

export interface CashFlowChartProps {
  data: CashFlowDataPoint[];
  config?: ChartConfig;
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
  // showProjection?: boolean; // TODO: Add projection feature in future
}

/**
 * Cash Flow Chart Component
 * 
 * The MOST IMPORTANT chart for freelancers - shows money in vs money out
 * 
 * Features:
 * - Income vs Expenses trend
 * - Net cash flow visualization
 * - Zero line reference for break-even
 * - Responsive design for mobile
 * - Italian currency formatting
 * - Month-over-month comparison
 * 
 * Following SOLID principles:
 * - Single Responsibility: Only handles cash flow visualization
 * - Open/Closed: Extensible through props
 * - Dependency Inversion: Uses abstracted chart components
 */
export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  data,
  config = {},
  loading = false,
  error = null,
  title = "Cash Flow",
  subtitle = "Entrate vs Uscite nel tempo",
  className = ''
  // showProjection = false // TODO: Implement projection feature in future
}) => {
  const defaultConfig: ChartConfig = {
    height: 400,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    responsive: true,
    colors: ['#10B981', '#EF4444', '#3B82F6'], // Green, Red, Blue
    ...config
  };

  // Transform data using utility function (SRP: data transformation separated)
  const chartData = transformCashFlowData(data);

  const chartContent = (
    <ResponsiveContainer width="100%" height={defaultConfig.height}>
      <LineChart
        data={chartData}
        margin={defaultConfig.margin}
      >
        {defaultConfig.showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        )}

        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: '#d1d5db' }}
          axisLine={{ stroke: '#d1d5db' }}
        />

        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: '#d1d5db' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickFormatter={formatCurrencyCompact}
        />

        {/* Zero reference line for break-even */}
        <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="2 2" />

        {defaultConfig.showTooltip && (
          <Tooltip
            content={<ChartTooltip formatter={currencyTooltipFormatter} labelFormatter={dateTooltipLabelFormatter} />}
          />
        )}

        {defaultConfig.showLegend && <Legend />}

        {/* Income Line */}
        <Line
          type="monotone"
          dataKey="income"
          stroke={defaultConfig.colors?.[0] || '#10B981'}
          strokeWidth={3}
          dot={{ fill: defaultConfig.colors?.[0] || '#10B981', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: 'white', strokeWidth: 2 }}
          name="Entrate"
        />

        {/* Expenses Line */}
        <Line
          type="monotone"
          dataKey="expenses"
          stroke={defaultConfig.colors?.[1] || '#EF4444'}
          strokeWidth={3}
          dot={{ fill: defaultConfig.colors?.[1] || '#EF4444', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: 'white', strokeWidth: 2 }}
          name="Uscite"
        />

        {/* Net Cash Flow Line */}
        <Line
          type="monotone"
          dataKey="net"
          stroke={defaultConfig.colors?.[2] || '#3B82F6'}
          strokeWidth={4}
          dot={<NetCashFlowDot />}
          activeDot={{ r: 8, stroke: 'white', strokeWidth: 3 }}
          name="Netto"
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      className={className}
    >
      {chartContent}
    </ChartContainer>
  );
};

export default CashFlowChart;
