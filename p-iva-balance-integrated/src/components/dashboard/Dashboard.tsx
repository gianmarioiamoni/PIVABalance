'use client';

import { useAuthContext } from '@/providers/AuthProvider';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardView } from './DashboardView';

/**
 * Dashboard Container Component (Client Component)
 * 
 * Container component that handles data fetching and state management.
 * Delegates UI rendering to DashboardView server component.
 * Follows Single Responsibility Principle - only handles data orchestration.
 */
export const Dashboard = () => {
    const { user, isLoading } = useAuthContext();
    const { stats, activities, quickActions } = useDashboard();

    return (
        <DashboardView
            user={user}
            stats={stats}
            activities={activities}
            quickActions={quickActions}
            isLoading={isLoading}
        />
    );
}; 