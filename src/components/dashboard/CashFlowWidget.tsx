'use client';

import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';
import { CashFlowChart } from '@/components/charts';
import { useCashFlowData } from '@/hooks/useChartData';

export interface CashFlowWidgetProps {
  className?: string;
  months?: number;
  showHeader?: boolean;
}

/**
 * Cash Flow Widget Component
 * 
 * The MOST IMPORTANT widget for freelancers
 * Shows money in vs money out with key insights
 * 
 * Features:
 * - Visual cash flow chart
 * - Key metrics summary
 * - Trend indicators
 * - Quick insights
 * - Refresh capability
 */
/**
 * Cash Flow Data Type
 * SRP: Defines only cash flow data structure
 */
interface CashFlowDataPoint {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

/**
 * Cash Flow Metrics Calculator
 * SRP: Handles only cash flow calculations
 */
const useCashFlowMetrics = (data: CashFlowDataPoint[]) => {
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];

  const currentNet = currentMonth?.net || 0;
  const previousNet = previousMonth?.net || 0;
  const netTrend = previousNet !== 0 ? ((currentNet - previousNet) / Math.abs(previousNet)) * 100 : 0;

  const totalIncome = data.reduce((sum, month) => sum + month.income, 0);
  const totalExpenses = data.reduce((sum, month) => sum + month.expenses, 0);
  const totalNet = totalIncome - totalExpenses;

  return {
    currentNet,
    previousNet,
    netTrend,
    totalIncome,
    totalExpenses,
    totalNet
  };
};

/**
 * Trend Info Calculator
 * SRP: Handles only trend indicator logic
 */
const useTrendInfo = (netTrend: number) => {
  if (netTrend > 5) {
    return { icon: TrendingUp, color: 'text-green-600 bg-green-50', text: 'In crescita' };
  } else if (netTrend < -5) {
    return { icon: TrendingDown, color: 'text-red-600 bg-red-50', text: 'In calo' };
  } else {
    return { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50', text: 'Stabile' };
  }
};

/**
 * Trend Info Type
 * SRP: Defines only trend info structure
 */
interface TrendInfo {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  text: string;
}

/**
 * Cash Flow Header Component
 * SRP: Handles only header rendering with trend
 */
const CashFlowHeader: React.FC<{
  months: number;
  trendInfo: TrendInfo;
  onRefresh: () => void;
  isLoading: boolean;
}> = ({ months, trendInfo, onRefresh, isLoading }) => {
  const TrendIcon = trendInfo.icon;

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Cash Flow</h3>
        <p className="text-sm text-gray-600 mt-1">
          Panoramica ultimi {months} mesi
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Trend Indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${trendInfo.color}`}>
          <TrendIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{trendInfo.text}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          aria-label="Aggiorna dati"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

/**
 * Cash Flow Stats Component
 * SRP: Handles only stats grid rendering
 */
const CashFlowStats: React.FC<{
  totalIncome: number;
  totalExpenses: number;
  totalNet: number;
  netTrend: number;
}> = ({ totalIncome, totalExpenses, totalNet, netTrend }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          €{totalIncome.toLocaleString('it-IT')}
        </div>
        <div className="text-xs text-gray-600">Entrate Totali</div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-bold text-red-600">
          €{totalExpenses.toLocaleString('it-IT')}
        </div>
        <div className="text-xs text-gray-600">Uscite Totali</div>
      </div>

      <div className="text-center">
        <div className={`text-2xl font-bold ${totalNet >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          €{totalNet.toLocaleString('it-IT')}
        </div>
        <div className="text-xs text-gray-600">Netto</div>
      </div>

      <div className="text-center">
        <div className={`text-lg font-bold ${netTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {netTrend >= 0 ? '+' : ''}{netTrend.toFixed(1)}%
        </div>
        <div className="text-xs text-gray-600">Trend Mensile</div>
      </div>
    </div>
  );
};

/**
 * Cash Flow Insights Component
 * SRP: Handles only insights generation and rendering
 */
const CashFlowInsights: React.FC<{
  data: CashFlowDataPoint[];
  currentNet: number;
  netTrend: number;
  months: number;
}> = ({ data, currentNet, netTrend, months }) => {
  const generateInsights = () => {
    const insights: string[] = [];

    if (currentNet > 0) {
      insights.push(`✅ Questo mese hai un cash flow positivo di €${currentNet.toLocaleString('it-IT')}`);
    } else {
      insights.push(`⚠️ Questo mese hai un cash flow negativo di €${Math.abs(currentNet).toLocaleString('it-IT')}`);
    }

    if (netTrend > 10) {
      insights.push(`📈 Ottima crescita del ${netTrend.toFixed(1)}% rispetto al mese scorso!`);
    }

    if (netTrend < -10) {
      insights.push(`📉 Attenzione: calo del ${Math.abs(netTrend).toFixed(1)}% rispetto al mese scorso`);
    }

    if (data.filter(month => month.net < 0).length > months / 2) {
      insights.push(`🔍 Considera di rivedere le spese o aumentare i ricavi`);
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Insights</h4>
      <div className="space-y-1 text-sm text-gray-600">
        {insights.map((insight, index) => (
          <p key={index}>{insight}</p>
        ))}
      </div>
    </div>
  );
};

export const CashFlowWidget: React.FC<CashFlowWidgetProps> = ({
  className = '',
  months = 6, // Shorter period for widget
  showHeader = true
}) => {
  const { data, isLoading, error, refreshData } = useCashFlowData(months);

  // Calculate metrics using specialized hook
  const metrics = useCashFlowMetrics(data);
  const trendInfo = useTrendInfo(metrics.netTrend);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      {showHeader && (
        <CashFlowHeader
          months={months}
          trendInfo={trendInfo}
          onRefresh={refreshData}
          isLoading={isLoading}
        />
      )}

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <CashFlowStats
          totalIncome={metrics.totalIncome}
          totalExpenses={metrics.totalExpenses}
          totalNet={metrics.totalNet}
          netTrend={metrics.netTrend}
        />

        {/* Chart */}
        <div className="h-64">
          <CashFlowChart
            data={data}
            loading={isLoading}
            error={error}
            config={{
              height: 240,
              margin: { top: 10, right: 10, left: 10, bottom: 20 },
              showLegend: false
            }}
          />
        </div>

        {/* Insights */}
        {!isLoading && data.length > 0 && (
          <CashFlowInsights
            data={data}
            currentNet={metrics.currentNet}
            netTrend={metrics.netTrend}
            months={months}
          />
        )}
      </div>
    </div>
  );
};

export default CashFlowWidget;
