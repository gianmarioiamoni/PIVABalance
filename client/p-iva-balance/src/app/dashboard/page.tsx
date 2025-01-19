'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import TaxSettings from '@/components/TaxSettings';
import Invoices from '@/components/Invoices';
import Costs from '@/components/Costs';
import { useTaxSettings } from '@/hooks/useTaxSettings';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, setToken } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');
  const [attemptedTab, setAttemptedTab] = useState<string | undefined>(undefined);
  const taxSettingsRef = useRef<{ hasChanges: () => boolean } | null>(null);
  const { state: { settings } } = useTaxSettings();

  const isOrdinaryRegime = settings?.taxRegime === 'ordinario';

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

  const handleTabChange = (newTab: string) => {
    if (newTab === 'costs' && !isOrdinaryRegime) {
      return;
    }
    
    if (activeTab === 'settings' && taxSettingsRef.current?.hasChanges()) {
      setAttemptedTab(newTab);
    } else {
      setActiveTab(newTab);
    }
  };

  const handleConfirmTabChange = (confirmedTab: string) => {
    setActiveTab(confirmedTab);
    setAttemptedTab(undefined);
  };

  const handleCancelTabChange = () => {
    setAttemptedTab(undefined);
  };

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
            <div className="lg:col-span-3">
              <div className="px-4 sm:px-0">
                <nav className="isolate flex divide-x divide-gray-200 rounded-lg shadow" aria-label="Tabs">
                  <button
                    type="button"
                    onClick={() => handleTabChange('settings')}
                    className={classNames(
                      activeTab === 'settings'
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700',
                      'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
                    )}
                    aria-current={activeTab === 'settings' ? 'page' : undefined}
                  >
                    <span>Impostazioni</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        activeTab === 'settings' ? 'bg-indigo-500' : 'bg-transparent',
                        'absolute inset-x-0 bottom-0 h-0.5'
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('invoices')}
                    className={classNames(
                      activeTab === 'invoices'
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700',
                      'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium hover:bg-gray-50 focus:z-10'
                    )}
                    aria-current={activeTab === 'invoices' ? 'page' : undefined}
                  >
                    <span>Fatture</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        activeTab === 'invoices' ? 'bg-indigo-500' : 'bg-transparent',
                        'absolute inset-x-0 bottom-0 h-0.5'
                      )}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('costs')}
                    className={classNames(
                      activeTab === 'costs'
                        ? 'text-gray-900'
                        : 'text-gray-500',
                      !isOrdinaryRegime ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-700 hover:bg-gray-50',
                      'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-center text-sm font-medium focus:z-10'
                    )}
                    aria-current={activeTab === 'costs' ? 'page' : undefined}
                    disabled={!isOrdinaryRegime}
                    title={!isOrdinaryRegime ? "Costi attivi solo per Regime Ordinario" : undefined}
                  >
                    <span>Costi</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        activeTab === 'costs' ? 'bg-indigo-500' : 'bg-transparent',
                        'absolute inset-x-0 bottom-0 h-0.5'
                      )}
                    />
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
                {activeTab === 'costs' && isOrdinaryRegime && <Costs />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
