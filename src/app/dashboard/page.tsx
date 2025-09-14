'use client';

import { Dashboard } from '@/components/dashboard';
import { BusinessProtection } from '@/components/auth/BusinessProtection';
import { SuperAdminRedirect } from '@/components/auth/SuperAdminRedirect';

// Disable prerendering for this page to avoid SSR issues with React Query
export const dynamic = 'force-dynamic';

/**
 * Dashboard Page
 * Uses the Dashboard container component which handles all data fetching and state management
 * Protected from super admin access - business functionality only
 * Super admins are automatically redirected to admin dashboard
 */
export default function DashboardPage() {
  return (
    <>
      <SuperAdminRedirect />
      <BusinessProtection>
        <Dashboard />
      </BusinessProtection>
    </>
  );
}
