'uuse client';

import React, { useState } from 'react';
import { useCosts, useCostForm } from '@/hooks/costs';
// ✅ Code splitting: Lazy load CostFormWrapper (caricato solo quando necessario)
// const CostFormWrapper = lazy(() => import('./costs/CostFormWrapper').then(module => ({ default: module.CostFormWrapper })));
// Temporary: Use direct import for debugging
import { CostFormWrapper } from './costs/CostFormWrapper';
import { CostList } from './costs/CostList';
import { SummaryCard } from './costs/SummaryCard';
// import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
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
        openForm: openNewCostForm,
        closeForm: closeNewCostForm,
        submitForm: submitNewCost,
        loading: createLoading,
        error: createError
    } = useCostForm({
        onSuccess: async () => {
            // Small delay to ensure the cost is saved and query invalidation completed
            await new Promise(resolve => setTimeout(resolve, 100));
            await refreshCosts();
        }
    });

    // Calculate summary data
    const costSummary = calculateCostSummary(costs);
    const availableYears = generateAvailableYears();
    const error = costsError || createError;

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header with Year Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestione Costi</h1>
                    <p className="text-gray-600 mt-1">Monitora e gestisci i tuoi costi aziendali</p>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <button
                        onClick={openNewCostForm}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2"
                    >
                        <Icon name="PlusIcon" className="h-5 w-5" />
                        Nuovo Costo
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Costi Totali"
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
                <>
                    <CostFormWrapper
                        onSubmit={submitNewCost}
                        onCancel={closeNewCostForm}
                        loading={createLoading}
                        error={createError}
                    />
                </>
            )}

            {/* Cost List */}
            <CostList
                costs={costs}
                loading={costsLoading}
                onUpdate={handleUpdateCost}
                onDelete={handleDeleteCost}
            />
        </div>
    );
}; 