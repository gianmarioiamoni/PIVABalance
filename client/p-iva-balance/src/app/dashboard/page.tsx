'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
      return;
    }

    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [searchParams, user, isLoading, router, setToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
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
