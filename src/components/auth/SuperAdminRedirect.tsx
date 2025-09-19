'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';

/**
 * Super Admin Redirect Component
 * 
 * Automatically redirects super admins to the admin dashboard
 * when they try to access the main dashboard.
 * 
 * This ensures super admins are directed to their appropriate
 * system management interface rather than business pages.
 */
export const SuperAdminRedirect = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect during loading
    if (isLoading) return;

    // Redirect super admin to admin dashboard
    if ((user as { role?: string } | null)?.role === 'super_admin') {
      router.push('/dashboard/admin');
    }
  }, [user, isLoading, router]);

  // Show loading while redirecting
  if (isLoading || (user as { role?: string } | null)?.role === 'super_admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {(user as { role?: string } | null)?.role === 'super_admin'
              ? 'Reindirizzamento al pannello amministrazione...'
              : 'Caricamento...'
            }
          </p>
        </div>
      </div>
    );
  }

  return null;
};
