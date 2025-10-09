import { Metadata } from 'next';
import { Breadcrumbs, BreadcrumbSchema } from '@/components/navigation';
import { RelatedLinks, getRelatedLinks } from '@/components/seo/RelatedLinks';

export const metadata: Metadata = {
  title: 'Gestione Fatture e Costi | P.IVA Balance',
  description: 'Organizza fatture emesse e costi sostenuti con categorizzazione automatica per deducibilità fiscale e reporting avanzato.',
  alternates: {
    canonical: '/features/gestione-fatture'
  }
};

export default function GestioneFatturePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <BreadcrumbSchema pathname="/features/gestione-fatture" />
        <Breadcrumbs className="mb-8" />

        <div className="space-y-16">
          {/* Hero Section */}
          <div className="text-center py-12">
            <div className="text-6xl mb-6 text-purple-600">
              📄
            </div>
            <h1 className="heading-xxl text-primary mb-6">
              Gestione Fatture e Costi
            </h1>
            <p className="body-xl text-secondary content-medium mx-auto leading-relaxed">
              Organizza e controlla ogni aspetto della tua attività finanziaria.
              Fatture, costi e deducibilità tutto sotto controllo.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="heading-md text-primary mb-3">Gestione Fatture</h3>
              <p className="body-md text-secondary leading-relaxed">
                Crea, modifica e organizza le tue fatture con numerazione automatica,
                gestione IVA e tracking dei pagamenti.
              </p>
            </div>

            <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="heading-md text-primary mb-3">Controllo Costi</h3>
              <p className="body-md text-secondary leading-relaxed">
                Registra e categorizza tutti i costi aziendali con classificazione
                automatica per deducibilità fiscale.
              </p>
            </div>

            <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="heading-md text-primary mb-3">Reporting Avanzato</h3>
              <p className="body-md text-secondary leading-relaxed">
                Report dettagliati per periodo, cliente, categoria con export
                in PDF ed Excel per commercialista.
              </p>
            </div>

            <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="heading-md text-primary mb-3">Ricerca Intelligente</h3>
              <p className="body-md text-secondary leading-relaxed">
                Trova rapidamente fatture e costi con filtri avanzati per data,
                cliente, importo e categoria.
              </p>
            </div>

            <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="heading-md text-primary mb-3">Automazione</h3>
              <p className="body-md text-secondary leading-relaxed">
                Calcolo automatico IVA, scadenze, promemoria pagamenti
                e categorizzazione intelligente dei costi.
              </p>
            </div>

            <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="heading-md text-primary mb-3">Mobile Ready</h3>
              <p className="body-md text-secondary leading-relaxed">
                Gestisci fatture e costi ovunque ti trovi con l&apos;app
                mobile ottimizzata per tutti i dispositivi.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl p-12">
            <div className="content-wide mx-auto">
              <h2 className="heading-xl text-primary text-center mb-12">
                Vantaggi per la Tua Attività
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
                      <h3 className="heading-sm text-primary mb-2">Organizzazione Totale</h3>
                      <p className="body-md text-secondary">
                        Tutti i documenti fiscali in un unico posto,
                        facilmente accessibili e sempre aggiornati.
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
                      <h3 className="heading-sm text-primary mb-2">Deducibilità Automatica</h3>
                      <p className="body-md text-secondary">
                        Il sistema riconosce automaticamente quali costi
                        sono deducibili per ottimizzare la tua situazione fiscale.
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
                      <h3 className="heading-sm text-primary mb-2">Export Professionale</h3>
                      <p className="body-md text-secondary">
                        Report pronti per commercialista con tutti i dettagli
                        necessari per dichiarazioni e adempimenti.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                  <div className="text-center">
                    <div className="text-5xl mb-6">📈</div>
                    <h3 className="heading-lg text-primary mb-4">
                      Controllo Finanziario
                    </h3>
                    <p className="body-lg text-secondary leading-relaxed">
                      Monitora in tempo reale entrate, uscite e marginalità.
                      Prendi decisioni informate per far crescere il tuo business.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <RelatedLinks
          links={getRelatedLinks('gestione-fatture')}
          title="Funzionalità Correlate"
        />
      </div>
    </div>
  );
}