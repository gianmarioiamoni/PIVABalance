import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Completa | P.IVA Balance',
  description: 'Visualizza in tempo reale la situazione fiscale con grafici intuitivi, report dettagliati e analisi predittive personalizzate.',
};

export default function DashboardCompletaPage() {
  return (
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
          Controllo totale della tua situazione fiscale con visualizzazioni in tempo reale,
          analisi predittive e insights personalizzati per il tuo business.
        </p>
      </div>

      {/* Dashboard Preview */}
      <div className="bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-3xl p-12">
        <div className="content-wide mx-auto">
          <h2 className="heading-xl text-primary text-center mb-12">
            Vista d&apos;Insieme Intelligente
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-sm text-primary">Situazione Fiscale</h3>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">€ 45.2K</div>
              <p className="body-sm text-secondary">Ricavi anno corrente</p>
              <div className="mt-4 bg-green-100 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-sm text-primary">Tasse da Versare</h3>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">!</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-2">€ 8.4K</div>
              <p className="body-sm text-secondary">Prossima scadenza: 16 Feb</p>
              <div className="mt-4 bg-orange-100 h-2 rounded-full">
                <div className="bg-orange-500 h-2 rounded-full w-1/2"></div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-sm text-primary">Costi Deducibili</h3>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">€</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">€ 12.8K</div>
              <p className="body-sm text-secondary">Risparmio fiscale: € 3.2K</p>
              <div className="mt-4 bg-blue-100 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">📈</div>
          <h3 className="heading-md text-primary mb-3">Analytics Avanzate</h3>
          <p className="body-md text-secondary leading-relaxed">
            Grafici interattivi per trend di ricavi, analisi stagionali e confronti
            anno su anno. Scopri i pattern del tuo business.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">🔮</div>
          <h3 className="heading-md text-primary mb-3">Previsioni Intelligenti</h3>
          <p className="body-md text-secondary leading-relaxed">
            AI predittiva per stimare ricavi futuri, calcolare tasse in anticipo
            e pianificare investimenti ottimali.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">⏰</div>
          <h3 className="heading-md text-primary mb-3">Scadenzario Automatico</h3>
          <p className="body-md text-secondary leading-relaxed">
            Non perdere mai una scadenza fiscale. Promemoria personalizzati
            per F24, dichiarazioni e versamenti INPS.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="heading-md text-primary mb-3">KPI Personalizzati</h3>
          <p className="body-md text-secondary leading-relaxed">
            Metriche chiave per il tuo settore. Margini, ROI, cash flow
            e indicatori di performance sempre sotto controllo.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">📱</div>
          <h3 className="heading-md text-primary mb-3">Mobile First</h3>
          <p className="body-md text-secondary leading-relaxed">
            Dashboard ottimizzata per ogni device. Accedi ai tuoi dati
            ovunque sei, con la stessa esperienza desktop.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">🔄</div>
          <h3 className="heading-md text-primary mb-3">Aggiornamenti Real-time</h3>
          <p className="body-md text-secondary leading-relaxed">
            Dati sempre aggiornati in tempo reale. Ogni fattura e costo
            si riflette immediatamente sui tuoi grafici e calcoli.
          </p>
        </div>
      </div>

      {/* Widget Types */}
      <div className="content-wide mx-auto">
        <h2 className="heading-xl text-primary text-center mb-12">
          Widget e Visualizzazioni
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border-l-4 border-blue-500">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="heading-sm text-primary mb-2">Grafici a Barre</h3>
            <p className="body-sm text-secondary">
              Confronta ricavi mensili, costi per categoria e performance annuali
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm border-l-4 border-green-500">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="heading-sm text-primary mb-2">Grafici a Linee</h3>
            <p className="body-sm text-secondary">
              Trend temporali, crescita business e proiezioni future
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm border-l-4 border-purple-500">
            <div className="text-3xl mb-3">🥧</div>
            <h3 className="heading-sm text-primary mb-2">Grafici a Torta</h3>
            <p className="body-sm text-secondary">
              Distribuzione costi, composizione ricavi e allocazione budget
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm border-l-4 border-orange-500">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="heading-sm text-primary mb-2">Tabelle Pivot</h3>
            <p className="body-sm text-secondary">
              Analisi dettagliate con filtri avanzati e esportazione dati
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="content-wide mx-auto">
        <h2 className="heading-xl text-primary text-center mb-12">
          Decisioni Basate sui Dati
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
                <h3 className="heading-sm text-primary mb-2">Visibilità Completa</h3>
                <p className="body-md text-secondary">
                  Situazione fiscale sempre sotto controllo. Identifica opportunità
                  e problemi prima che diventino critici.
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
                <h3 className="heading-sm text-primary mb-2">Pianificazione Strategica</h3>
                <p className="body-md text-secondary">
                  Usa le previsioni AI per pianificare investimenti,
                  assumzioni e strategie di crescita basate su dati reali.
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
                  Identifica automaticamente aree di miglioramento e ricevi
                  suggerimenti personalizzati per ottimizzare la gestione.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="heading-lg text-primary mb-4">
                Business Intelligence
              </h3>
              <p className="body-lg text-secondary leading-relaxed">
                Trasforma i tuoi dati fiscali in insights strategici.
                Prendi decisioni informate che fanno crescere il tuo business.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customization */}
      <div className="bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-3xl p-12">
        <div className="content-wide mx-auto text-center">
          <h2 className="heading-xl text-primary mb-8">
            Dashboard Personalizzabile
          </h2>
          <p className="body-lg text-secondary mb-12 max-w-3xl mx-auto">
            Ogni business è unico. Personalizza la tua dashboard con i widget più importanti
            per il tuo settore e stile di gestione. Drag & drop, ridimensiona e organizza
            tutto secondo le tue preferenze.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="heading-md text-primary mb-3">Layout Flessibile</h3>
              <p className="body-md text-secondary">
                Organizza widget con drag & drop. Crea il layout perfetto per il tuo workflow.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="heading-md text-primary mb-3">Filtri Avanzati</h3>
              <p className="body-md text-secondary">
                Personalizza i dati visualizzati con filtri per periodo, categoria e tipo.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="heading-md text-primary mb-3">Temi Personalizzati</h3>
              <p className="body-md text-secondary">
                Scegli colori, temi e visualizzazioni che riflettono il tuo brand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 