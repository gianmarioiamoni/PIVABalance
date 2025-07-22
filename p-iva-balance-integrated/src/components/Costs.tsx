'use client';

import React, { useState, Suspense, lazy } from 'react';
import { useCosts, useCostForm } from '@/hooks/costs';
// ✅ Code splitting: Lazy load CostForm (caricato solo quando necessario)
const CostForm = lazy(() => import('./costs/CostForm').then(module => ({ default: module.CostForm })));
import { CostList } from './costs/CostList';
import { SummaryCard } from './costs/SummaryCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
// ✅ Ottimizzazione: Uso sistema Icon dinamico invece di import diretti
import { Icon } from '@/components/ui';
import {
    calculateCostSummary,
    generateAvailableYears
} from '@/utils/costSummaryCalculations';

export const Costs: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const {
        costs,
        loading: costsLoading,
        error: costsError,
        refreshCosts,
        handleUpdateCost,
        handleDeleteCost
    } = useCosts(selectedYear);

    const {
        showForm: showNewCostForm,
        loading: createLoading,
        error: createError,
        openForm: openNewCostForm,
        closeForm: closeNewCostForm,
        submitForm: submitNewCost
    } = useCostForm({
        onSuccess: refreshCosts
    });

    // Pure functions for calculations and data generation
    const availableYears = generateAvailableYears(5);
    const costSummary = calculateCostSummary(costs);

    const loading = costsLoading || createLoading;
    const error = costsError || createError;



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
                            className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <button
                            onClick={openNewCostForm}
                            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            disabled={loading}
                        >
                            <Icon name="plus" className="h-4 w-4 mr-2" />
                            Nuovo Costo
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Totale Costi"
                    amount={costSummary.totalCosts}
                    count={costSummary.totalCount}
                    icon={({ className }) => <Icon name="CurrencyEuroIcon" className={className} />}
                    bgColor="bg-blue-50"
                    textColor="text-blue-600"
                />
                <SummaryCard
                    title="Costi Deducibili"
                    amount={costSummary.deductibleCosts}
                    count={costSummary.deductibleCount}
                    icon={({ className }) => <Icon name="CheckCircleIcon" className={className} />}
                    bgColor="bg-green-50"
                    textColor="text-green-600"
                />
                <SummaryCard
                    title="Costi Non Deducibili"
                    amount={costSummary.nonDeductibleCosts}
                    count={costSummary.nonDeductibleCount}
                    icon={({ className }) => <Icon name="XCircleIcon" className={className} />}
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
                <Suspense fallback={<LoadingSpinner />}>
                    <CostForm
                        onSubmit={submitNewCost}
                        onCancel={closeNewCostForm}
                        loading={createLoading}
                        error={createError}
                    />
                </Suspense>
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