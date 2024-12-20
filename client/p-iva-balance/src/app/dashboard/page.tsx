'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import TaxSettings from '@/components/TaxSettings';

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Benvenuto, {user.name}!
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Gestisci le tue impostazioni fiscali e monitora le tue performance finanziarie.
            </p>
          </div>

          <div className="mt-8">
            <TaxSettings />
          </div>
        </div>
      </main>
    </div>
  );
}
