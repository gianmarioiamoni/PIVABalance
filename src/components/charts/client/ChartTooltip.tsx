'use client';

import React from 'react';

interface TooltipPayloadItem {
  value: number | string;
  name: string;
  color: string;
  dataKey?: string;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  formatter?: (value: number | string, name: string) => [string, string];
  labelFormatter?: (label: string) => string;
  className?: string;
}

/**
 * Custom Chart Tooltip Component
 * 
 * Provides consistent tooltip styling across all charts
 * Follows Design System patterns for consistent UX
 */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
  className = ''
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label || '') : label;

  return (
    <div className={`
      bg-white border border-gray-200 rounded-lg shadow-lg p-3 
      max-w-xs z-50 ${className}
    `}>
      {formattedLabel && (
        <p className="text-sm font-medium text-gray-900 mb-2">
          {formattedLabel}
        </p>
      )}

      <div className="space-y-1">
        {payload.map((entry, index) => {
          const [value, name] = formatter
            ? formatter(entry.value, entry.name)
            : [entry.value, entry.name];

          return (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600">{name}:</span>
              </div>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Currency formatter for tooltips
 */
export const currencyTooltipFormatter = (value: number | string, name: string): [string, string] => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const formattedValue = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(numericValue);

  return [formattedValue, name];
};

/**
 * Percentage formatter for tooltips
 */
export const percentageTooltipFormatter = (value: number | string, name: string): [string, string] => {
  return [`${value}%`, name];
};

/**
 * Date formatter for tooltip labels
 */
export const dateTooltipLabelFormatter = (label: string): string => {
  try {
    const date = new Date(label);
    return date.toLocaleDateString('it-IT', {
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return label;
  }
};
