'use client';

import React, { useState } from 'react';
import { useCosts } from '@/hooks/costs';
import { costService, CreateCostData } from '@/services/costService';
import { CostForm } from './costs/CostForm';
import { CostList } from './costs/CostList';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PlusIcon, CalendarIcon, CurrencyEuroIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';

export const Costs: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showNewCostForm, setShowNewCostForm] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const {
        costs,
        loading: costsLoading,
        error: costsError,
        refreshCosts,
        handleUpdateCost,
        handleDeleteCost
    } = useCosts(selectedYear);

    // Generate available years starting from current year
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from(
        { length: 5 }, // Show 5 years (current + 4 previous)
        (_, i) => currentYear - i
    );

    // Calculate totals
    const totalCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);
    const deductibleCosts = costs.filter(cost => cost.deductible).reduce((sum, cost) => sum + cost.amount, 0);
    const nonDeductibleCosts = totalCosts - deductibleCosts;

    const loading = costsLoading || createLoading;
    const error = costsError || createError;

    const handleFormSubmit = async (costData: CreateCostData) => {
        try {
            setCreateLoading(true);
            setCreateError(null);
            await costService.createCost(costData);
            setShowNewCostForm(false);
            refreshCosts();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Errore nella creazione del costo';
            setCreateError(errorMessage);
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
        icon: React.ComponentType<{ className?: string }>;
        bgColor: string;
        textColor: string;
    }) => (
        <div className={`${bgColor} rounded-lg shadow-sm border border-gray-200 p-6`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${textColor}`}>
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                        {count} {count === 1 ? 'voce' : 'voci'}
                    </p>
                </div>
                <Icon className={`h-8 w-8 ${textColor}`} />
            </div>
        </div>
    );

    if (loading && costs.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestione Costi</h1>
                        <p className="text-gray-500">Monitora e gestisci i tuoi costi aziendali</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowNewCostForm(true)}
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={loading}
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Nuovo Costo
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Totale Costi"
                    amount={totalCosts}
                    count={costs.length}
                    icon={CurrencyEuroIcon}
                    bgColor="bg-blue-50"
                    textColor="text-blue-600"
                />
                <SummaryCard
                    title="Costi Deducibili"
                    amount={deductibleCosts}
                    count={costs.filter(cost => cost.deductible).length}
                    icon={CalendarIcon}
                    bgColor="bg-green-50"
                    textColor="text-green-600"
                />
                <SummaryCard
                    title="Costi Non Deducibili"
                    amount={nonDeductibleCosts}
                    count={costs.filter(cost => !cost.deductible).length}
                    icon={CalendarIcon}
                    bgColor="bg-red-50"
                    textColor="text-red-600"
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-800">{error}</div>
                </div>
            )}

            {/* New Cost Form */}
            {showNewCostForm && (
                <CostForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                    loading={createLoading}
                    error={createError}
                />
            )}

            {/* Costs List */}
            <CostList
                costs={costs}
                onUpdate={handleUpdateCost}
                onDelete={handleDeleteCost}
                loading={loading}
                error={error}
            />
        </div>
    );
}; 