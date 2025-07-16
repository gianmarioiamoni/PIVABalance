'use client';

import React, { useState } from 'react';
import { useCosts } from '@/hooks/costs';
import { costService } from '@/services/costService';
import { CostForm } from './CostForm';
import { CostList } from './CostList';
import { LoadingSpinner } from '../invoices/LoadingSpinner';
import { PlusIcon, CalendarIcon, CurrencyEuroIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';

export const Costs: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showNewCostForm, setShowNewCostForm] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // Generate available years (current year and a few previous years)
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const {
        costs,
        deductibleCosts,
        nonDeductibleCosts,
        totalDeductibleCosts,
        totalNonDeductibleCosts,
        loading: costsLoading,
        error: costsError,
        handleUpdateCost,
        handleDeleteCost,
        refreshCosts
    } = useCosts(selectedYear);

    const loading = costsLoading || createLoading;
    const error = costsError || createError;

    const handleFormSubmit = async (costData: any) => {
        try {
            setCreateLoading(true);
            setCreateError(null);
            await costService.createCost(costData);
            setShowNewCostForm(false);
            refreshCosts();
        } catch (err: any) {
            setCreateError(err.response?.data?.message || 'Errore nella creazione del costo');
            console.error('Error creating cost:', err);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleCancelForm = () => {
        setShowNewCostForm(false);
        setCreateError(null);
    };

    const SummaryCard = ({
        title,
        amount,
        count,
        icon: Icon,
        bgColor,
        textColor
    }: {
        title: string;
        amount: number;
        count: number;
        icon: any;
        bgColor: string;
        textColor: string;
    }) => (
        <div className={`${bgColor} rounded-lg shadow-sm border border-gray-200 p-6`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {formatCurrency(amount)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        {count} {count === 1 ? 'costo' : 'costi'}
                    </p>
                </div>
                <div className={`p-3 rounded-full ${bgColor.replace('bg-', 'bg-').replace('-50', '-100')}`}>
                    <Icon className={`h-6 w-6 ${textColor}`} />
                </div>
            </div>
        </div>
    );

    if (loading && costs.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestione Costi</h1>
                    <p className="text-gray-600 mt-1">
                        Monitora e gestisci tutti i tuoi costi aziendali
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setShowNewCostForm(true)}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Nuovo Costo
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard
                    title="Costi Deducibili"
                    amount={totalDeductibleCosts}
                    count={deductibleCosts.length}
                    icon={CurrencyEuroIcon}
                    bgColor="bg-green-50"
                    textColor="text-green-600"
                />
                <SummaryCard
                    title="Costi Non Deducibili"
                    amount={totalNonDeductibleCosts}
                    count={nonDeductibleCosts.length}
                    icon={CurrencyEuroIcon}
                    bgColor="bg-gray-50"
                    textColor="text-gray-600"
                />
                <SummaryCard
                    title="Totale Costi"
                    amount={totalDeductibleCosts + totalNonDeductibleCosts}
                    count={costs.length}
                    icon={CurrencyEuroIcon}
                    bgColor="bg-blue-50"
                    textColor="text-blue-600"
                />
            </div>

            {/* New Cost Form */}
            {showNewCostForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-blue-900">Nuovo Costo</h2>
                        <button
                            onClick={handleCancelForm}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    <CostForm
                        onSubmit={handleFormSubmit}
                        onCancel={handleCancelForm}
                        loading={createLoading}
                        error={createError}
                    />
                </div>
            )}

            {/* Deductible Costs Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Costi Deducibili
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Questi costi riducono il tuo reddito imponibile
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Totale</p>
                            <p className="text-xl font-bold text-green-600">
                                {formatCurrency(totalDeductibleCosts)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <CostList
                        costs={deductibleCosts}
                        onUpdate={handleUpdateCost}
                        onDelete={handleDeleteCost}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>

            {/* Non-Deductible Costs Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Costi Non Deducibili
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Questi costi non influiscono sul calcolo delle tasse
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Totale</p>
                            <p className="text-xl font-bold text-gray-600">
                                {formatCurrency(totalNonDeductibleCosts)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <CostList
                        costs={nonDeductibleCosts}
                        onUpdate={handleUpdateCost}
                        onDelete={handleDeleteCost}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>

            {/* Summary Footer */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Riepilogo Costi {selectedYear}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                            <p className="text-blue-100">Costi Deducibili</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalDeductibleCosts)}</p>
                        </div>
                        <div>
                            <p className="text-blue-100">Costi Non Deducibili</p>
                            <p className="text-2xl font-bold">{formatCurrency(totalNonDeductibleCosts)}</p>
                        </div>
                        <div>
                            <p className="text-blue-100">Totale Complessivo</p>
                            <p className="text-3xl font-bold">
                                {formatCurrency(totalDeductibleCosts + totalNonDeductibleCosts)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 