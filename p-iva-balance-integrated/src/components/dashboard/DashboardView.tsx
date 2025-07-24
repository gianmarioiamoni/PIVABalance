import React from 'react';
import { StatCard } from './StatCard';
import { RecentActivities } from './RecentActivities';
import { QuickActions } from './QuickActions';
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
 * DashboardView Component (Updated with Design System)
 * 
 * Main dashboard layout component
 * Now uses centralized design system classes for consistency
 */
export const DashboardView: React.FC<DashboardViewProps> = ({
    stats,
    activities,
    quickActions,
    isLoading,
    error
}) => {
    if (isLoading) {
        return (
            <div className="container-app py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
                    <p className="text-secondary mt-4">Caricamento dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-app py-8">
                <div className="status-error p-6 rounded-lg text-center">
                    <h2 className="heading-md mb-2">Errore nel caricamento</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-app py-8 space-y-8">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 className="heading-xl">
                    Dashboard
                </h1>
                <p className="text-secondary mt-2">
                    Panoramica della tua attività finanziaria
                </p>
            </div>

            {/* Stats Grid */}
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
                    title="Tasse Stimate"
                    value={stats.estimatedTaxes}
                    icon={<CalculatorIcon className="h-5 w-5" />}
                    variant="info"
                />
            </div>

            {/* Main Content Grid */}
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

            {/* Additional Content Area */}
            <div className="card animate-fade-in">
                <div className="card-header">
                    <h2 className="heading-sm">
                        Panoramica Finanziaria
                    </h2>
                </div>
                <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary mb-2">
                                {stats.invoicesThisMonth}
                            </div>
                            <div className="text-tertiary text-sm">
                                Fatture emesse
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-success mb-2">
                                {stats.monthlyRevenue}
                            </div>
                            <div className="text-tertiary text-sm">
                                Ricavi del mese
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-warning mb-2">
                                {stats.estimatedTaxes}
                            </div>
                            <div className="text-tertiary text-sm">
                                Tasse da versare
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 