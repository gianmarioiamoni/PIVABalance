'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { ChartContainer } from './client/ChartContainer';
import { ChartTooltip, currencyTooltipFormatter } from './client/ChartTooltip';
import { ChartLegend } from './client/ChartLegend';
import { renderPieCustomLabel } from './subcomponents';
import { useTaxBreakdownData } from '@/hooks/charts';
import { formatCurrency } from '@/utils/chartUtils';
import type { TaxBreakdownDataPoint, ChartConfig } from './types';

export interface TaxBreakdownChartProps {
  data: TaxBreakdownDataPoint[];
  config?: ChartConfig;
  loading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  className?: string;
  showPercentages?: boolean;
  showValues?: boolean;
}

/**
 * Tax Breakdown Chart Component
 * 
 * Visual breakdown of tax obligations for freelancers
 * Critical for understanding where money goes to taxes
 * 
 * Features:
 * - Donut chart for modern look
 * - Category-based tax breakdown
 * - Percentage and absolute values
 * - Color-coded categories
 * - Interactive hover states
 * - Custom legend with values
 */
export const TaxBreakdownChart: React.FC<TaxBreakdownChartProps> = ({
  data,
  config = {},
  loading = false,
  error = null,
  title = "Ripartizione Tasse",
  subtitle = "Distribuzione delle imposte e contributi",
  className = '',
  showPercentages = true,
  showValues = true
}) => {
  const defaultConfig: ChartConfig = {
    height: 400,
    responsive: true,
    showTooltip: true,
    showLegend: true,
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

  // Use custom hook for all data processing (SRP: business logic separated)
  const { total, chartData, legendItems, formatPercentage } = useTaxBreakdownData({
    data,
    defaultColors: defaultConfig.colors || [],
    showValues,
    showPercentages
  });

  // Custom tooltip with detailed information
  const customTooltipFormatter = (value: number | string, name: string): [string, string] => {
    const [formattedValue] = currencyTooltipFormatter(value, name);
    const percentage = formatPercentage(value);
    return [`${formattedValue} (${percentage}%)`, name];
  };

  // Summary stats for header
  const summaryActions = (
    <div className="text-right">
      <div className="text-2xl font-bold text-gray-900">
        {formatCurrency(total)}
      </div>
      <div className="text-sm text-gray-600">
        Totale tasse
      </div>
    </div>
  );

  const chartContent = (
    <div className="space-y-6">
      <ResponsiveContainer width="100%" height={defaultConfig.height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={showPercentages ? renderPieCustomLabel : false}
            outerRadius={120}
            innerRadius={60} // Creates donut effect
            fill="#8884d8"
            dataKey="amount"
            strokeWidth={2}
            stroke="white"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {defaultConfig.showTooltip && (
            <Tooltip
              content={
                <ChartTooltip
                  formatter={customTooltipFormatter}
                />
              }
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      {defaultConfig.showLegend && (
        <ChartLegend
          items={legendItems}
          position="bottom"
        />
      )}
    </div>
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      className={className}
      actions={summaryActions}
    >
      {chartContent}
    </ChartContainer>
  );
};

export default TaxBreakdownChart;
