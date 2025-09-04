'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ChartContainer } from './client/ChartContainer';
import { ChartTooltip, currencyTooltipFormatter, dateTooltipLabelFormatter } from './client/ChartTooltip';
import { TrendIndicator } from './subcomponents';
import { useTrendAnalysis } from '@/hooks/charts';
import { formatCurrencyCompact } from '@/utils/chartUtils';
import type { TrendDataPoint, ChartConfig } from './types';

export interface MonthlyTrendChartProps {
  data: TrendDataPoint[];
  config?: ChartConfig;
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
  metric?: 'revenue' | 'profit' | 'expenses';
}

/**
 * Monthly Trend Chart Component
 * 
 * Shows performance trends with growth indicators
 * Critical for freelancers to understand business trajectory
 * 
 * Features:
 * - Smooth area chart for visual appeal
 * - Growth indicators with icons
 * - Trend analysis with previous period comparison
 * - Average line reference
 * - Mobile-optimized responsive design
 */
export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({
  data,
  config = {},
  loading = false,
  error = null,
  title = "Trend Mensile",
  subtitle = "Andamento delle performance nel tempo",
  className = ''
  // metric = 'revenue' // TODO: Use metric for future customization
}) => {
  const defaultConfig: ChartConfig = {
    height: 350,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    showGrid: true,
    showTooltip: true,
    responsive: true,
    colors: ['#3B82F6', '#E5E7EB'], // Blue gradient
    ...config
  };

  // Use custom hook for trend analysis (SRP: business logic separated)
  const { average, overallGrowth, getGrowthText } = useTrendAnalysis({ data });

  // Enhanced tooltip with growth information
  const customTooltipFormatter = (value: number | string, name: string): [string, string] => {
    const [formattedValue] = currencyTooltipFormatter(value, name);

    // Find current data point for growth calculation
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const currentIndex = data.findIndex(point => point.value === numericValue);
    const currentPoint = data[currentIndex];

    const growthText = currentPoint?.previous
      ? getGrowthText(numericValue, currentPoint.previous)
      : '';

    return [formattedValue + growthText, name];
  };

  const actions = (
    <div className="flex items-center space-x-2">
      <TrendIndicator growth={overallGrowth} />
    </div>
  );

  const chartContent = (
    <ResponsiveContainer width="100%" height={defaultConfig.height}>
      <AreaChart
        data={data}
        margin={defaultConfig.margin}
      >
        {defaultConfig.showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        )}

        <XAxis
          dataKey="period"
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

        {/* Average reference line */}
        <ReferenceLine
          y={average}
          stroke="#f59e0b"
          strokeDasharray="4 4"
          label={{ value: "Media", position: "top" }}
        />

        {defaultConfig.showTooltip && (
          <Tooltip
            content={
              <ChartTooltip
                formatter={customTooltipFormatter}
                labelFormatter={dateTooltipLabelFormatter}
              />
            }
          />
        )}

        {/* Main trend area */}
        <Area
          type="monotone"
          dataKey="value"
          stroke={defaultConfig.colors?.[0] || '#3B82F6'}
          fill="url(#trendGradient)"
          strokeWidth={3}
          dot={{ fill: defaultConfig.colors?.[0] || '#3B82F6', strokeWidth: 2, r: 5 }}
          activeDot={{ r: 7, stroke: 'white', strokeWidth: 2 }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={defaultConfig.colors?.[0] || '#3B82F6'} stopOpacity={0.3} />
            <stop offset="95%" stopColor={defaultConfig.colors?.[0] || '#3B82F6'} stopOpacity={0.05} />
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      className={className}
      actions={actions}
    >
      {chartContent}
    </ChartContainer>
  );
};

export default MonthlyTrendChart;
