'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import TaxSettings from '@/components/TaxSettings';
import Invoices from '@/components/Invoices';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, setToken } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');
  const [attemptedTab, setAttemptedTab] = useState<string | null>(null);
  const taxSettingsRef = useRef<{ hasChanges: () => boolean } | null>(null);

  const handleTabChange = (newTab: string) => {
    if (activeTab === 'settings' && taxSettingsRef.current?.hasChanges()) {
      setAttemptedTab(newTab);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleConfirmTabChange = (confirmedTab: string) => {
    setActiveTab(confirmedTab);
    setAttemptedTab(null);
  };

  const handleCancelTabChange = () => {
    setAttemptedTab(null);
  };

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

          <div>
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => handleTabChange('settings')}
                  className={classNames(
                    activeTab === 'settings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  )}
                >
                  Impostazioni
                </button>
                <button
                  onClick={() => handleTabChange('invoices')}
                  className={classNames(
                    activeTab === 'invoices'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  )}
                >
                  Fatture
                </button>
              </nav>
            </div>

            <div className="mt-6">
              {activeTab === 'settings' && (
                <TaxSettings
                  ref={taxSettingsRef}
                  activeTab={activeTab}
                  attemptedTab={attemptedTab}
                  onTabChange={handleConfirmTabChange}
                  onCancelTabChange={handleCancelTabChange}
                />
              )}
              {activeTab === 'invoices' && <Invoices />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
