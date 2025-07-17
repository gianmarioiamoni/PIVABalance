import { LoadingSpinner } from '@/components/ui';
import { StatCard } from './StatCard';
import { QuickActions } from './QuickActions';
import { RecentActivities } from './RecentActivities';
import { User } from '@/services/authService';

/**
 * Dashboard data types
 */
interface DashboardStats {
    invoicesThisMonth: number;
    monthlyRevenue: string;
    monthlyCosts: string;
    estimatedTaxes: string;
}

interface QuickAction {
    label: string;
    onClick: () => void;
    bgColor: string;
    hoverColor: string;
}

interface Activity {
    description: string;
    amount: string;
    type: "income" | "expense";
}

/**
 * Props for DashboardView component
 */
interface DashboardViewProps {
    user: User | null | undefined;
    stats: DashboardStats;
    activities: Activity[];
    quickActions: QuickAction[];
    isLoading?: boolean;
}

/**
 * DashboardView Component (Server Component)
 * 
 * Presentational component for dashboard UI.
 * Receives all data as props and focuses solely on rendering.
 * Follows Single Responsibility Principle - only handles UI presentation.
 */
export const DashboardView = ({
    user,
    stats,
    activities,
    quickActions,
    isLoading = false
}: DashboardViewProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                    Benvenuto, {user?.name}. Ecco il riepilogo della tua attività.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                    title="Fatture Questo Mese"
                    value={stats.invoicesThisMonth.toString()}
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                    bgColor="bg-blue-500"
                />
                <StatCard
                    title="Ricavi Mensili"
                    value={stats.monthlyRevenue}
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    }
                    bgColor="bg-green-500"
                />
                <StatCard
                    title="Costi Mensili"
                    value={stats.monthlyCosts}
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                    bgColor="bg-red-500"
                />
                <StatCard
                    title="Tasse Stimate"
                    value={stats.estimatedTaxes}
                    icon={
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    }
                    bgColor="bg-yellow-500"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tax Contributions Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">
                                Contributi e Tasse
                            </h2>
                        </div>
                        <div className="p-6">
                            {/* TaxContributions component will be added here when migrated */}
                            <div className="text-center py-12 text-gray-500">
                                <p>Il componente TaxContributions verrà aggiunto dopo la migrazione.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions and Activities */}
                <div className="space-y-6">
                    <QuickActions actions={quickActions} />
                    <RecentActivities activities={activities} />
                </div>
            </div>
        </div>
    );
}; 