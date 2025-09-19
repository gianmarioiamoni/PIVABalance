/**
 * Tax Widget Component
 * 
 * SRP: Handles ONLY tax visualization and fiscal status
 * Specialized widget for tax calculations and obligations
 */

'use client';

import React from 'react';
import { Calculator, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { WidgetContainer } from '../base/WidgetContainer';
import { BaseWidgetProps } from '../base/types';
import { useTaxData } from '@/hooks/widgets/useTaxData';

/**
 * Tax Data Structure
 * SRP: Handles only tax data interface
 */
export interface TaxData extends Record<string, unknown> {
    currentQuarter: {
        irpef: number;
        inps: number;
        professionalFund: number;
        total: number;
    };
    yearToDate: {
        irpef: number;
        inps: number;
        professionalFund: number;
        total: number;
    };
    nextPayments: {
        description: string;
        amount: number;
        dueDate: Date;
        type: 'irpef' | 'inps' | 'fund' | 'iva';
        isPaid: boolean;
    }[];
    taxRegime: 'forfettario' | 'ordinario';
    estimatedYearEnd: number;
    savingsOpportunity: number; // Potential savings
}

/**
 * Tax Widget Props
 * SRP: Interface for tax widget specific properties
 */
export interface TaxWidgetProps extends BaseWidgetProps {
    showNextPayments?: boolean;
    showSavings?: boolean;
    maxPayments?: number;
}

/**
 * Next Payments Display Component
 * SRP: Handles only upcoming payments visualization
 */
const NextPayments: React.FC<{ payments: TaxData['nextPayments']; maxItems: number }> = ({
    payments,
    maxItems
}) => {
    const upcomingPayments = payments
        .filter(payment => !payment.isPaid)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
        .slice(0, maxItems);

    if (upcomingPayments.length === 0) {
        return (
            <div className="text-center py-4">
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-green-600">Nessun pagamento in scadenza</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {upcomingPayments.map((payment, index) => {
                const isUrgent = payment.dueDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 days
                const daysUntilDue = Math.ceil((payment.dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

                return (
                    <div key={index} className={`flex items-center justify-between p-2 rounded ${isUrgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                        }`}>
                        <div className="flex items-center space-x-2">
                            {isUrgent ? (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : (
                                <Calendar className="h-4 w-4 text-gray-500" />
                            )}
                            <div>
                                <div className="text-sm font-medium text-gray-900">
                                    {payment.description}
                                </div>
                                <div className={`text-xs ${isUrgent ? 'text-red-600' : 'text-gray-500'}`}>
                                    {daysUntilDue > 0 ? `${daysUntilDue} giorni` : 'Scaduto'}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                                €{payment.amount.toLocaleString('it-IT')}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

/**
 * Tax Metrics Display Component
 * SRP: Handles only tax metrics rendering
 */
const TaxMetrics: React.FC<{ data: TaxData; showSavings: boolean }> = ({ data, showSavings }) => {
    const regimeColor = data.taxRegime === 'forfettario' ? 'text-blue-600' : 'text-purple-600';
    const regimeLabel = data.taxRegime === 'forfettario' ? 'Forfettario' : 'Ordinario';

    return (
        <div className="space-y-4">
            {/* Tax Regime Indicator */}
            <div className="text-center">
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-100`}>
                    <Calculator className="h-4 w-4 text-gray-600" />
                    <span className={`text-sm font-medium ${regimeColor}`}>
                        Regime {regimeLabel}
                    </span>
                </div>
            </div>

            {/* Current Quarter */}
            <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-700 mb-2">Trimestre Corrente</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-blue-600">IRPEF:</span>
                        <span className="font-semibold">€{data.currentQuarter.irpef.toLocaleString('it-IT')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-blue-600">INPS:</span>
                        <span className="font-semibold">€{data.currentQuarter.inps.toLocaleString('it-IT')}</span>
                    </div>
                    {data.currentQuarter.professionalFund > 0 && (
                        <div className="flex justify-between col-span-2">
                            <span className="text-blue-600">Cassa Prof.:</span>
                            <span className="font-semibold">€{data.currentQuarter.professionalFund.toLocaleString('it-IT')}</span>
                        </div>
                    )}
                </div>
                <div className="border-t border-blue-200 mt-2 pt-2">
                    <div className="flex justify-between font-semibold text-blue-700">
                        <span>Totale:</span>
                        <span>€{data.currentQuarter.total.toLocaleString('it-IT')}</span>
                    </div>
                </div>
            </div>

            {/* Year to Date */}
            <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <div className="text-lg font-bold text-gray-700">
                        €{data.yearToDate.total.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-500">Pagato Anno</div>
                </div>
                <div>
                    <div className="text-lg font-bold text-orange-600">
                        €{data.estimatedYearEnd.toLocaleString('it-IT')}
                    </div>
                    <div className="text-xs text-gray-500">Stima Fine Anno</div>
                </div>
            </div>

            {/* Savings Opportunity */}
            {showSavings && data.savingsOpportunity > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <div className="text-sm">
                            <span className="text-green-700 font-medium">Risparmio Possibile: </span>
                            <span className="text-green-600 font-semibold">
                                €{data.savingsOpportunity.toLocaleString('it-IT')}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                        Ottimizza le deduzioni per ridurre il carico fiscale
                    </p>
                </div>
            )}
        </div>
    );
};

/**
 * Tax Widget Component (Client-Side for Calculations)
 * 
 * SRP Responsibilities:
 * 1. Tax data presentation ONLY
 * 2. Tax-specific metrics ONLY
 * 3. Fiscal obligations visualization ONLY
 * 
 * NOT responsible for:
 * - Generic widget container logic (delegated to WidgetContainer)
 * - Tax calculation logic (delegated to useTaxData hook)
 * - Dashboard layout management
 */
export const TaxWidget: React.FC<TaxWidgetProps> = ({
    config,
    data: _data,
    isEditing,
    onConfigChange,
    onRemove,
    onRefresh,
    showNextPayments = true,
    showSavings = true,
    maxPayments = 3,
    className = ''
}) => {
    // Use specialized hook for tax data
    const {
        taxData,
        isLoading,
        error,
        lastUpdated,
        refresh
    } = useTaxData();

    // Handle refresh action
    const handleRefresh = () => {
        refresh();
        if (onRefresh) {
            onRefresh(config.id);
        }
    };

    // Widget data for container
    const widgetData = {
        id: config.id,
        data: taxData,
        lastUpdated: lastUpdated || new Date(),
        isLoading,
        error: error || undefined
    };

    return (
        <WidgetContainer
            config={config}
            data={widgetData}
            isEditing={isEditing}
            onConfigChange={onConfigChange}
            onRemove={onRemove}
            onRefresh={handleRefresh}
            className={className}
        >
            {/* Widget Content */}
            {taxData && !isLoading && !error ? (
                <div className="space-y-4">
                    <TaxMetrics data={taxData} showSavings={showSavings} />

                    {showNextPayments && taxData.nextPayments.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                Prossimi Pagamenti
                            </h4>
                            <NextPayments payments={taxData.nextPayments} maxItems={maxPayments} />
                        </div>
                    )}
                </div>
            ) : (
                /* Loading/Error handled by WidgetContainer */
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Caricamento calcoli fiscali...</p>
                    </div>
                </div>
            )}
        </WidgetContainer>
    );
};

export default TaxWidget;
