import React from 'react';
import { ChartBarIcon, ArrowUpIcon, ArrowDownIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface AnnualSummaryProps {
  annualSummary: {
    totalRevenue: number;
    totalCosts: number;
    grossCashFlow: number;
    totalTaxes: number;
    netCashFlow: number;
    yearProgress: number;
    formattedRevenue: string;
    formattedCosts: string;
    formattedGrossCashFlow: string;
    formattedTaxes: string;
    formattedNetCashFlow: string;
  };
}

/**
 * Annual Summary Component
 * 
 * Displays a comprehensive year-to-date financial summary with cash flow analysis.
 * Follows SRP by handling only annual summary display.
 * 
 * Features:
 * - Year-to-date revenue and costs
 * - Highlighted cash flow (before and after taxes)
 * - Visual progress indicator for year completion
 * - Color-coded positive/negative cash flow
 * - Clean, professional layout
 */
export const AnnualSummary: React.FC<AnnualSummaryProps> = ({ annualSummary }) => {
  const currentYear = new Date().getFullYear();
  
  // Determine cash flow colors
  const grossCashFlowColor = annualSummary.grossCashFlow >= 0 ? 'text-green-600' : 'text-red-600';
  const netCashFlowColor = annualSummary.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600';
  const grossCashFlowBg = annualSummary.grossCashFlow >= 0 ? 'bg-green-50' : 'bg-red-50';
  const netCashFlowBg = annualSummary.netCashFlow >= 0 ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-primary" />
            <h2 className="heading-sm">Riepilogo Annuale {currentYear}</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-tertiary">
            <CalendarIcon className="h-4 w-4" />
            <span>{annualSummary.yearProgress}% anno completato</span>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-tertiary mb-2">
            <span>Progresso Anno</span>
            <span>{annualSummary.yearProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(annualSummary.yearProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Financial Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Revenue */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Ricavi Totali</p>
                <p className="text-2xl font-bold text-blue-900">{annualSummary.formattedRevenue}</p>
              </div>
              <ArrowUpIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* Total Costs */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Costi Totali</p>
                <p className="text-2xl font-bold text-orange-900">{annualSummary.formattedCosts}</p>
              </div>
              <ArrowDownIcon className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          {/* Gross Cash Flow */}
          <div className={`${grossCashFlowBg} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Cash Flow Lordo</p>
                <p className={`text-2xl font-bold ${grossCashFlowColor}`}>
                  {annualSummary.formattedGrossCashFlow}
                </p>
              </div>
              <ChartBarIcon className={`h-8 w-8 ${grossCashFlowColor}`} />
            </div>
          </div>

          {/* Total Taxes */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Tasse Totali</p>
                <p className="text-2xl font-bold text-purple-900">{annualSummary.formattedTaxes}</p>
              </div>
              <div className="h-8 w-8 bg-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white text-sm font-bold">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Cash Flow - Highlighted */}
        <div className={`${netCashFlowBg} border-2 ${annualSummary.netCashFlow >= 0 ? 'border-green-200' : 'border-red-200'} rounded-lg p-6`}>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">Cash Flow Netto (Dopo Tasse)</p>
            <p className={`text-4xl font-bold ${netCashFlowColor} mb-2`}>
              {annualSummary.formattedNetCashFlow}
            </p>
            <p className="text-sm text-gray-600">
              {annualSummary.netCashFlow >= 0 
                ? '✅ Situazione positiva - liquidità disponibile' 
                : '⚠️ Attenzione - cash flow negativo'}
            </p>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="mt-4 text-center">
          <p className="text-sm text-tertiary">
            Dati aggiornati in tempo reale • Basati su fatture e costi effettivamente registrati
          </p>
        </div>
      </div>
    </div>
  );
};
