'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer } from './client/ChartContainer';
import { ChartTooltip, currencyTooltipFormatter } from './client/ChartTooltip';
import type { YearComparisonDataPoint, ChartConfig } from './types';

export interface YearComparisonChartProps {
  data: YearComparisonDataPoint[];
  currentYear: number;
  previousYear: number;
  config?: ChartConfig;
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Year Comparison Chart Component
 * 
 * Compares current year performance with previous year
 * Essential for freelancers to track growth and seasonality
 * 
 * Features:
 * - Side-by-side bar comparison
 * - Month-by-month breakdown
 * - Growth indicators
 * - Seasonal pattern identification
 * - Mobile-responsive design
 */
export const YearComparisonChart: React.FC<YearComparisonChartProps> = ({
  data,
  currentYear,
  previousYear,
  config = {},
  loading = false,
  error = null,
  title,
  subtitle,
  className = ''
}) => {
  const defaultTitle = title || `Confronto ${currentYear} vs ${previousYear}`;
  const defaultSubtitle = subtitle || "Analisi delle performance anno su anno";

  const defaultConfig: ChartConfig = {
    height: 400,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    responsive: true,
    colors: ['#3B82F6', '#E5E7EB'], // Current year blue, previous year gray
    ...config
  };

  // Calculate totals for summary
  const currentYearTotal = data.reduce((sum, item) => sum + item.currentYear, 0);
  const previousYearTotal = data.reduce((sum, item) => sum + item.previousYear, 0);
  const growthPercentage = previousYearTotal > 0
    ? ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100
    : 0;

  // Summary stats for actions
  const summaryActions = (
    <div className="text-right space-y-1">
      <div className="text-lg font-bold text-gray-900">
        {growthPercentage >= 0 ? '+' : ''}{growthPercentage.toFixed(1)}%
      </div>
      <div className="text-sm text-gray-600">
        Crescita annua
      </div>
    </div>
  );

  // Enhanced tooltip with growth calculation
  const customTooltipFormatter = (value: number | string, name: string): [string, string] => {
    const [formattedValue] = currencyTooltipFormatter(value, name);

    // TODO: Access payload data through context for growth calculation
    // For now, just return formatted value
    return [formattedValue, name];
  };

  const chartContent = (
    <ResponsiveContainer width="100%" height={defaultConfig.height}>
      <BarChart
        data={data}
        margin={defaultConfig.margin}
        barCategoryGap="20%"
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
          tickFormatter={(value) =>
            new Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: 'EUR',
              notation: 'compact'
            }).format(value)
          }
        />

        {defaultConfig.showTooltip && (
          <Tooltip
            content={
              <ChartTooltip
                formatter={customTooltipFormatter}
              />
            }
          />
        )}

        {defaultConfig.showLegend && <Legend />}

        {/* Previous Year Bar */}
        <Bar
          dataKey="previousYear"
          fill={defaultConfig.colors?.[1] || '#E5E7EB'}
          name={`${previousYear}`}
          radius={[2, 2, 0, 0]}
          opacity={0.7}
        />

        {/* Current Year Bar */}
        <Bar
          dataKey="currentYear"
          fill={defaultConfig.colors?.[0] || '#3B82F6'}
          name={`${currentYear}`}
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title={defaultTitle}
      subtitle={defaultSubtitle}
      loading={loading}
      error={error}
      className={className}
      actions={summaryActions}
    >
      {chartContent}
    </ChartContainer>
  );
};

export default YearComparisonChart;
