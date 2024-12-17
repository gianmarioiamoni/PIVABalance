'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
      
      // Force refresh auth state
      window.location.reload();
      return;
    }

    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [loading, user, router, searchParams]);

  if (loading || searchParams.get('token')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome, {user.name}!
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            This is your dashboard. Here you can manage your finances and track your business performance.
          </p>
        </div>
      </main>
    </div>
  );
}
