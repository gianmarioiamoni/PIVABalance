import { Metadata } from 'next';
import { Breadcrumbs, BreadcrumbSchema } from '@/components/navigation';
import { RelatedLinks, getRelatedLinks } from '@/components/seo/RelatedLinks';

export const metadata: Metadata = {
  title: 'Dashboard Completa | P.IVA Balance',
  description: 'Visualizza in tempo reale la situazione fiscale con grafici intuitivi, report dettagliati e analisi predittive personalizzate.',
  alternates: {
    canonical: '/features/dashboard-completa'
  }
};

export default function DashboardCompletaPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <BreadcrumbSchema />
        <Breadcrumbs className="mb-8" />
        
        <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="text-6xl mb-6 text-green-600">
          📊
        </div>
        <h1 className="heading-xxl text-primary mb-6">
          Dashboard Completa
        </h1>
        <p className="body-xl text-secondary content-medium mx-auto leading-relaxed">
          Visualizza e analizza la tua situazione finanziaria con dashboard
          interattive, grafici in tempo reale e insights intelligenti.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">📈</div>
          <h3 className="heading-md text-primary mb-3">Analytics in Tempo Reale</h3>
          <p className="body-md text-secondary leading-relaxed">
            Monitora ricavi, costi e profitti con aggiornamenti istantanei
            e visualizzazioni interattive sempre aggiornate.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="heading-md text-primary mb-3">KPI Personalizzati</h3>
          <p className="body-md text-secondary leading-relaxed">
            Definisci e traccia i tuoi indicatori chiave di performance
            con obiettivi personalizzati e alert automatici.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">🔮</div>
          <h3 className="heading-md text-primary mb-3">Previsioni Intelligenti</h3>
          <p className="body-md text-secondary leading-relaxed">
            Algoritmi di machine learning analizzano i tuoi dati per
            prevedere trend futuri e opportunità di crescita.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="heading-md text-primary mb-3">Dashboard Personalizzabile</h3>
          <p className="body-md text-secondary leading-relaxed">
            Organizza widget e grafici con drag & drop per creare
            la dashboard perfetta per le tue esigenze.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">📱</div>
          <h3 className="heading-md text-primary mb-3">Multi-Device</h3>
          <p className="body-md text-secondary leading-relaxed">
            Accedi ai tuoi dati da qualsiasi dispositivo con
            sincronizzazione automatica e layout responsive.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">🔔</div>
          <h3 className="heading-md text-primary mb-3">Alert Intelligenti</h3>
          <p className="body-md text-secondary leading-relaxed">
            Ricevi notifiche automatiche per scadenze, anomalie
            e opportunità di ottimizzazione fiscale.
          </p>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-3xl p-12">
        <div className="content-wide mx-auto">
          <h2 className="heading-xl text-primary text-center mb-12">
            Componenti Dashboard
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl mb-3">💰</div>
              <h4 className="heading-sm text-primary mb-2">Revenue Widget</h4>
              <p className="body-sm text-secondary">
                Ricavi mensili con trend e proiezioni
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl mb-3">📊</div>
              <h4 className="heading-sm text-primary mb-2">Cost Analysis</h4>
              <p className="body-sm text-secondary">
                Analisi costi per categoria e deducibilità
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl mb-3">🎯</div>
              <h4 className="heading-sm text-primary mb-2">Tax Overview</h4>
              <p className="body-sm text-secondary">
                Situazione fiscale e scadenze imminenti
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-2xl mb-3">📈</div>
              <h4 className="heading-sm text-primary mb-2">Profit Trends</h4>
              <p className="body-sm text-secondary">
                Andamento profitti con analisi comparative
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="content-wide mx-auto">
        <h2 className="heading-xl text-primary text-center mb-12">
          Vantaggi Business Intelligence
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="heading-sm text-primary mb-2">Decisioni Data-Driven</h3>
                <p className="body-md text-secondary">
                  Basa le tue scelte strategiche su dati concreti
                  e analisi approfondite della tua attività.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="heading-sm text-primary mb-2">Identificazione Trend</h3>
                <p className="body-md text-secondary">
                  Scopri pattern nascosti nei tuoi dati per
                  anticipare opportunità e rischi futuri.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="heading-sm text-primary mb-2">Ottimizzazione Continua</h3>
                <p className="body-md text-secondary">
                  Migliora costantemente le performance con
                  suggerimenti automatici basati sui tuoi KPI.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="heading-lg text-primary mb-4">
                Crescita Accelerata
              </h3>
              <p className="body-lg text-secondary leading-relaxed">
                Trasforma i tuoi dati in insights actionable per
                accelerare la crescita del tuo business con decisioni informate.
              </p>
            </div>
          </div>
        </div>
      </div>
        </div>

        {/* Related Links */}
        <RelatedLinks 
          links={getRelatedLinks('dashboard-completa')}
          title="Funzionalità Correlate"
        />
      </div>
    </div>
  );
}