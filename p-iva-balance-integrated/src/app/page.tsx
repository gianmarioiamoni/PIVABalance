'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { LoadingSpinner } from "@/components/ui";
import Link from "next/link";

// 📊 Trust data configuration - easily manageable
const TRUST_DATA = {
  enabled: false, // Set to true when we have real data
  userCount: 0, // e.g., 250
  rating: 0, // e.g., 4.9
  maxRating: 5,
  reviewCount: 0 // e.g., 127
};

/**
 * Landing Page Component (Modern Design)
 * 
 * Handles authentication routing with a beautiful, modern design:
 * - Authenticated users → Redirect to dashboard
 * - Non-authenticated users → Show elegant landing page
 * Features: gradients, animations, modern cards, micro-interactions
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
      <div className="min-h-screen flex items-center justify-center surface-primary">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show modern landing page for non-authenticated users
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-pink-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative container-app">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          {/* Hero Section */}
          <div className="mx-auto max-w-6xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8 animate-slide-up bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent font-bold">
              P.IVA Balance
            </h1>
            
            <p className="text-xl lg:text-2xl leading-relaxed text-secondary max-w-5xl mx-auto mb-12 animate-slide-up delay-200">
              La <span className="font-semibold text-brand-primary">soluzione completa</span> per la gestione fiscale della tua partita IVA.
              <br className="hidden sm:block" />
              Calcola tasse, gestisci fatture e costi con <span className="font-semibold text-brand-secondary">semplicità</span>.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-300">
              <Link
                href="/signin"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-blue-500/20"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                <span className="relative">Accedi alla Dashboard</span>
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200 transform hover:scale-105"
              >
                Inizia Gratis
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Trust Badge - Only show if enabled and has real data */}
            {TRUST_DATA.enabled && TRUST_DATA.userCount > 0 && (
              <div className="mt-12 animate-fade-in delay-500">
                <p className="text-sm text-tertiary mb-4">
                  Già scelto da {TRUST_DATA.userCount.toLocaleString()} professionisti
                </p>
                <div className="flex items-center justify-center space-x-8 opacity-60">
                  <div className="flex items-center space-x-1">
                    {[...Array(TRUST_DATA.maxRating)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(TRUST_DATA.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-tertiary ml-2">
                      {TRUST_DATA.rating}/{TRUST_DATA.maxRating} ({TRUST_DATA.reviewCount} recensioni)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Features */}
          <div className="mx-auto mt-20 max-w-7xl">
            <div className="mb-12 animate-fade-in delay-600">
              <h2 className="heading-lg mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tutto quello che ti serve per gestire la tua P.IVA
              </h2>
              <p className="text-secondary max-w-4xl mx-auto text-lg leading-relaxed">
                Una piattaforma completa progettata per semplificare la gestione fiscale e amministrativa
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
              {/* Feature 1 */}
              <div className="group relative animate-slide-up delay-700">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                <div className="relative card p-8 hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H3.75zM3.75 6h-.75m0 0v.75c0 .414.336.75.75.75h.75m0-1.5h.75m0 0V4.5c0-.621.504-1.125 1.125-1.125h.75m0 1.5v.75c0 .414.336.75.75.75h.75M6 12v.75c0 .414.336.75.75.75h.75m0-.75V12c0-.621.504-1.125 1.125-1.125h.75m0 1.125v.75c0 .414.336.75.75.75h.75m0-.75V12c0-.621.504-1.125 1.125-1.125h.75M6 7.5v.75c0 .414.336.75.75.75h.75m0-.75V7.5c0-.621.504-1.125 1.125-1.125h.75m0 1.125v.75c0 .414.336.75.75.75h.75M6 18v.75c0 .414.336.75.75.75h.75m0-.75V18c0-.621.504-1.125 1.125-1.125h.75" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="heading-sm mb-4 group-hover:text-brand-primary transition-colors duration-300">
                    Calcoli Fiscali Automatici
                  </h3>
                  <p className="body-lg text-secondary leading-relaxed">
                    Calcola automaticamente tasse, contributi INPS e previdenziali per regime forfettario e ordinario con precisione garantita.
                  </p>
                  <div className="mt-6 flex items-center text-brand-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Scopri di più
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative animate-slide-up delay-800">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300"></div>
                <div className="relative card p-8 hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse delay-500"></div>
                    </div>
                  </div>
                  <h3 className="heading-sm mb-4 group-hover:text-purple-600 transition-colors duration-300">
                    Gestione Fatture e Costi
                  </h3>
                  <p className="body-lg text-secondary leading-relaxed">
                    Organizza fatture emesse e costi sostenuti con categorizzazione automatica per deducibilità fiscale e reporting avanzato.
                  </p>
                  <div className="mt-6 flex items-center text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Scopri di più
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative animate-slide-up delay-900">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-2xl transform rotate-2 group-hover:rotate-4 transition-transform duration-300"></div>
                <div className="relative card p-8 hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-2.25m2.25 0l.5 1.5m.5-1.5l1 3m-16.5-3l-1 3m1.5 1.5l.5-1.5m.5 1.5l1 3m-16.5-3l1 3m0 0l.5 1.5m-.5-1.5h2.25m-2.25 0l-.5 1.5" />
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
                    </div>
                  </div>
                  <h3 className="heading-sm mb-4 group-hover:text-green-600 transition-colors duration-300">
                    Dashboard Completa
                  </h3>
                  <p className="body-lg text-secondary leading-relaxed">
                    Visualizza in tempo reale la situazione fiscale con grafici intuitivi, report dettagliati e analisi predittive personalizzate.
                  </p>
                  <div className="mt-6 flex items-center text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Scopri di più
                    <svg className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-20 animate-fade-in delay-1000">
            <div className="relative p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              </div>
              <div className="relative text-center">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  Pronto a semplificare la tua gestione fiscale?
                </h3>
                <p className="text-blue-100 text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
                  Unisciti a centinaia di professionisti che hanno già scelto P.IVA Balance per gestire la loro attività
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-200 transform hover:scale-105"
                >
                  Inizia la prova gratuita
                  <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
