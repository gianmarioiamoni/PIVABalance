/**
 * Mobile Formatters Hook
 * 
 * Single Responsibility: Provide mobile-optimized data formatters
 * Extracted from MobileChartOptimizer for SRP compliance
 */

'use client';

import { useMemo } from 'react';
import type { ScreenSize } from './useScreenSize';

export interface MobileFormatters {
  currency: (value: number) => string;
  date: (value: string | Date) => string;
  percentage: (value: number) => string;
  compact: (value: number) => string;
}

export interface UseMobileFormattersResult {
  formatters: MobileFormatters;
}

/**
 * Hook for mobile-optimized data formatters
 * 
 * Features:
 * - Compact currency formatting
 * - Responsive date formatting
 * - Percentage formatting
 * - Number compacting for small screens
 */
export const useMobileFormatters = (
  screenSize: ScreenSize = 'medium'
): UseMobileFormattersResult => {
  
  const formatters = useMemo((): MobileFormatters => ({
    // Compact currency formatter for mobile
    currency: (value: number): string => {
      if (screenSize === 'small') {
        if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `€${(value / 1000).toFixed(1)}K`;
        return `€${value.toFixed(0)}`;
      }
      
      if (screenSize === 'medium') {
        return new Intl.NumberFormat('it-IT', {
          style: 'currency',
          currency: 'EUR',
          notation: 'compact'
        }).format(value);
      }
      
      // Large screens - full formatting
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }).format(value);
    },

    // Responsive date formatter
    date: (value: string | Date): string => {
      const date = new Date(value);
      
      if (screenSize === 'small') {
        return date.toLocaleDateString('it-IT', {
          month: 'short',
          day: 'numeric'
        });
      }
      
      if (screenSize === 'medium') {
        return date.toLocaleDateString('it-IT', {
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        });
      }
      
      // Large screens - full date
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    // Percentage formatter
    percentage: (value: number): string => {
      if (screenSize === 'small') {
        return `${value.toFixed(0)}%`;
      }
      return `${value.toFixed(1)}%`;
    },

    // Compact number formatter
    compact: (value: number): string => {
      if (screenSize === 'small') {
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
        return value.toString();
      }
      
      return new Intl.NumberFormat('it-IT', {
        notation: 'compact'
      }).format(value);
    }
  }), [screenSize]);

  return {
    formatters
  };
};
