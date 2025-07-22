'use client';

import { Dashboard } from '@/components/dashboard';

// Disable prerendering for this page to avoid SSR issues with React Query
export const dynamic = 'force-dynamic';

/**
 * Dashboard Page
 * Uses the Dashboard container component which handles all data fetching and state management
 */
export default function DashboardPage() {
  return <Dashboard />;
}
