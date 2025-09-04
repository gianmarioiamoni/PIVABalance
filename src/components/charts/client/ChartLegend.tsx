'use client';

import React from 'react';

export interface LegendItem {
  color: string;
  label: string;
  value?: string | number;
}

export interface ChartLegendProps {
  items: LegendItem[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * Chart Legend Component
 * 
 * Provides consistent legend styling across all charts
 * Supports different positioning and value display
 */
export const ChartLegend: React.FC<ChartLegendProps> = ({
  items,
  position = 'bottom',
  className = ''
}) => {
  const getFlexDirection = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return 'flex-row flex-wrap justify-center';
      case 'left':
      case 'right':
        return 'flex-col';
      default:
        return 'flex-row flex-wrap justify-center';
    }
  };

  const getSpacing = () => {
    switch (position) {
      case 'top':
        return 'mb-4';
      case 'bottom':
        return 'mt-4';
      case 'left':
        return 'mr-4';
      case 'right':
        return 'ml-4';
      default:
        return 'mt-4';
    }
  };

  return (
    <div className={`flex ${getFlexDirection()} ${getSpacing()} ${className}`}>
      {items.map((item, index) => (
        <div 
          key={index}
          className="flex items-center space-x-2 mx-2 my-1"
        >
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-sm text-gray-600">
            {item.label}
          </span>
          {item.value && (
            <span className="text-sm font-medium text-gray-900">
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
