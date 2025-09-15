'use client';

import { Dashboard } from '@/components/dashboard';
import { RoleBasedAccess } from '@/components/auth/RoleBasedAccess';

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
    <RoleBasedAccess
      allowedRoles={['user', 'admin']}
      redirectSuperAdminTo="/dashboard/admin"
    >
      <Dashboard />
    </RoleBasedAccess>
  );
}
