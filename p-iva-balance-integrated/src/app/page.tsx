'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { LoadingSpinner } from "@/components/ui";
import Link from "next/link";

/**
 * Landing Page Component
 * 
 * Handles authentication routing:
 * - Authenticated users → Redirect to dashboard
 * - Non-authenticated users → Show landing page
 */
export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading during auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          {/* Hero Section */}
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              P.IVA Balance
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              La soluzione completa per la gestione fiscale della tua partita IVA.
              Calcola tasse, gestisci fatture e costi con semplicità.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signin"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Accedi
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
              >
                Registrati <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 mx-auto">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H3.75zM3.75 6h-.75m0 0v.75c0 .414.336.75.75.75h.75m0-1.5h.75m0 0V4.5c0-.621.504-1.125 1.125-1.125h.75m0 1.5v.75c0 .414.336.75.75.75h.75M6 12v.75c0 .414.336.75.75.75h.75m0-.75V12c0-.621.504-1.125 1.125-1.125h.75m0 1.125v.75c0 .414.336.75.75.75h.75m0-.75V12c0-.621.504-1.125 1.125-1.125h.75M6 7.5v.75c0 .414.336.75.75.75h.75m0-.75V7.5c0-.621.504-1.125 1.125-1.125h.75m0 1.125v.75c0 .414.336.75.75.75h.75M6 18v.75c0 .414.336.75.75.75h.75m0-.75V18c0-.621.504-1.125 1.125-1.125h.75" />
                    </svg>
                  </div>
                  Calcoli Fiscali Automatici
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Calcola automaticamente tasse, contributi INPS e previdenziali per regime forfettario e ordinario.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 mx-auto">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  Gestione Fatture e Costi
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Organizza fatture emesse e costi sostenuti con categorizzazione automatica per deducibilità fiscale.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 mx-auto">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-2.25m2.25 0l.5 1.5m.5-1.5l1 3m-16.5-3l-1 3m1.5 1.5l.5-1.5m.5 1.5l1 3m-16.5-3l1 3m0 0l.5 1.5m-.5-1.5h2.25m-2.25 0l-.5 1.5" />
                    </svg>
                  </div>
                  Dashboard Completa
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Visualizza in tempo reale la situazione fiscale con grafici intuitivi e report dettagliati.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
