import React from 'react';
import { StatCard } from './StatCard';
import { RecentActivities } from './RecentActivities';
import { QuickActions } from './QuickActions';
import { CashFlowWidget } from './CashFlowWidget';
import {
    DocumentTextIcon,
    CurrencyEuroIcon,
    ChartBarIcon,
    CalculatorIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
    invoicesThisMonth: number;
    monthlyRevenue: string;
    monthlyCosts: string;
    estimatedTaxes: string;
}

interface Activity {
    description: string;
    amount: string;
    type: 'income' | 'expense';
}

interface QuickAction {
    label: string;
    onClick: () => void;
    bgColor: string;
    hoverColor: string;
}

interface DashboardViewProps {
    stats: DashboardStats;
    activities: Activity[];
    quickActions: QuickAction[];
    isLoading: boolean;
    error: string | null;
}

/**
 * Dashboard Loading State Component
 * SRP: Handles only loading UI state
 */
const DashboardLoading: React.FC = () => {
    return (
        <div className="container-app py-8">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                <p className="text-secondary mt-4">Caricamento dashboard...</p>
            </div>
        </div>
    );
};

/**
 * Dashboard Error State Component
 * SRP: Handles only error UI state
 */
const DashboardError: React.FC<{ error: string }> = ({ error }) => {
    return (
        <div className="container-app py-8">
            <div className="status-error p-6 rounded-lg text-center">
                <h2 className="heading-md mb-2">Errore nel caricamento</h2>
                <p>{error}</p>
            </div>
        </div>
    );
};

/**
 * Dashboard Header Component
 * SRP: Handles only dashboard header rendering
 */
const DashboardHeader: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <h1 className="heading-xl">Dashboard</h1>
            <p className="text-secondary mt-2">
                Panoramica della tua attività finanziaria
            </p>
        </div>
    );
};

/**
 * Stats Grid Component
 * SRP: Handles only stats cards grid rendering
 */
const StatsGrid: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <StatCard
                title="Fatture Mese"
                value={stats.invoicesThisMonth.toString()}
                icon={<DocumentTextIcon className="h-5 w-5" />}
                variant="primary"
            />
            <StatCard
                title="Ricavi Mensili"
                value={stats.monthlyRevenue}
                icon={<CurrencyEuroIcon className="h-5 w-5" />}
                variant="success"
            />
            <StatCard
                title="Costi Mensili"
                value={stats.monthlyCosts}
                icon={<ChartBarIcon className="h-5 w-5" />}
                variant="warning"
            />
            <StatCard
                title="Tasse su Dati Reali"
                value={stats.estimatedTaxes}
                icon={<CalculatorIcon className="h-5 w-5" />}
                variant="info"
            />
        </div>
    );
};

/**
 * Main Content Grid Component
 * SRP: Handles only main content layout
 */
const MainContentGrid: React.FC<{
    activities: Activity[];
    quickActions: QuickAction[];
}> = ({ activities, quickActions }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="animate-slide-up">
                <QuickActions actions={quickActions} />
            </div>

            {/* Recent Activities */}
            <div className="animate-slide-up">
                <RecentActivities activities={activities} />
            </div>
        </div>
    );
};

/**
 * Financial Overview Component
 * SRP: Handles only financial overview rendering
 */
const FinancialOverview: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
    return (
        <div className="card animate-fade-in">
            <div className="card-header">
                <h2 className="heading-sm">Panoramica Finanziaria</h2>
            </div>
            <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-2">
                            {stats.invoicesThisMonth}
                        </div>
                        <div className="text-tertiary text-sm">Fatture emesse</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-success mb-2">
                            {stats.monthlyRevenue}
                        </div>
                        <div className="text-tertiary text-sm">Ricavi del mese</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-warning mb-2">
                            {stats.estimatedTaxes}
                        </div>
                        <div className="text-tertiary text-sm">Tasse su dati effettivi</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * DashboardView Component (Updated with SRP)
 * 
 * SRP Responsibilities:
 * 1. Dashboard layout orchestration ONLY
 * 2. State management coordination ONLY
 * 
 * NOT responsible for:
 * - Loading/Error UI (delegated to DashboardLoading/DashboardError)
 * - Header rendering (delegated to DashboardHeader) 
 * - Stats rendering (delegated to StatsGrid)
 * - Content layout (delegated to MainContentGrid)
 * - Overview rendering (delegated to FinancialOverview)
 */
export const DashboardView: React.FC<DashboardViewProps> = ({
    stats,
    activities,
    quickActions,
    isLoading,
    error
}) => {
    // Handle loading state
    if (isLoading) {
        return <DashboardLoading />;
    }

    // Handle error state
    if (error) {
        return <DashboardError error={error} />;
    }

    // Main dashboard layout
    return (
        <div className="container-app py-8 space-y-8">
            <DashboardHeader />
            <StatsGrid stats={stats} />

            {/* Cash Flow Section - Most Important for Freelancers */}
            <div className="animate-fade-in">
                <CashFlowWidget months={6} />
            </div>

            <MainContentGrid activities={activities} quickActions={quickActions} />
            <FinancialOverview stats={stats} />
        </div>
    );
}; 