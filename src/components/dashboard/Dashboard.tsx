'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { DashboardView } from './DashboardView';

/**
 * Dashboard Component (Client Component)
 * 
 * Orchestrates dashboard data fetching and management.
 * Delegates UI rendering to DashboardView (Server Component).
 * Follows Single Responsibility Principle - only handles dashboard logic.
 */
export const Dashboard: React.FC = () => {
    const {
        stats,
        annualSummary,
        activities,
        quickActions,
        isLoading,
        error
    } = useDashboard();

    return (
        <DashboardView
            stats={stats}
            annualSummary={annualSummary}
            activities={activities}
            quickActions={quickActions}
            isLoading={isLoading}
            error={error}
        />
    );
}; 