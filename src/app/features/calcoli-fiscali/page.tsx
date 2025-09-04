import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calcoli Fiscali Automatici | P.IVA Balance',
  description: 'Calcola automaticamente tasse, contributi INPS e previdenziali per regime forfettario e ordinario con precisione garantita.',
};

export default function CalcoliFiscaliPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="text-6xl mb-6 text-blue-600">
          🧮
        </div>
        <h1 className="heading-xxl text-primary mb-6">
          Calcoli Fiscali Automatici
        </h1>
        <p className="body-xl text-secondary content-medium mx-auto leading-relaxed">
          Elimina gli errori e risparmia tempo con il nostro sistema di calcolo automatico.
          Precisione garantita per regime forfettario e ordinario.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="heading-md text-primary mb-3">Regime Forfettario</h3>
          <p className="body-md text-secondary leading-relaxed">
            Calcolo automatico dell&apos;imposta sostitutiva, contributi INPS fissi e gestione separata
            con percentuali aggiornate secondo normativa vigente.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">📈</div>
          <h3 className="heading-md text-primary mb-3">Regime Ordinario</h3>
          <p className="body-md text-secondary leading-relaxed">
            IRPEF per scaglioni, addizionali regionali e comunali, contributi INPS proporzionali
            e deduzioni fiscali automatiche.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">⚡</div>
          <h3 className="heading-md text-primary mb-3">Calcolo Istantaneo</h3>
          <p className="body-md text-secondary leading-relaxed">
            Risultati in tempo reale ad ogni modifica. Vedi immediatamente l&apos;impatto
            di ogni variazione sui tuoi obblighi fiscali.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="heading-md text-primary mb-3">Precisione Garantita</h3>
          <p className="body-md text-secondary leading-relaxed">
            Algoritmi sempre aggiornati con le ultime normative fiscali.
            Zero errori di calcolo, conformità garantita.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">📋</div>
          <h3 className="heading-md text-primary mb-3">Report Dettagliati</h3>
          <p className="body-md text-secondary leading-relaxed">
            Esporta calcoli dettagliati per commercialista o revisore.
            Documentazione completa per ogni periodo fiscale.
          </p>
        </div>

        <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="text-3xl mb-4">🔄</div>
          <h3 className="heading-md text-primary mb-3">Aggiornamenti Automatici</h3>
          <p className="body-md text-secondary leading-relaxed">
            Sistema sempre aggiornato con le ultime modifiche normative.
            Non dovrai più preoccuparti di restare indietro.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-3xl p-12">
        <div className="content-wide mx-auto">
          <h2 className="heading-xl text-primary text-center mb-12">
            Come Funziona
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="heading-md text-primary mb-4">Inserisci i Dati</h3>
              <p className="body-md text-secondary">
                Carica i tuoi ricavi, costi e informazioni fiscali.
                Il sistema riconosce automaticamente il regime più vantaggioso.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="heading-md text-primary mb-4">Calcolo Automatico</h3>
              <p className="body-md text-secondary">
                I nostri algoritmi elaborano i dati in tempo reale,
                applicando tutte le normative fiscali vigenti.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="heading-md text-primary mb-4">Risultati Dettagliati</h3>
              <p className="body-md text-secondary">
                Ottieni calcoli precisi, scadenzari personalizzati
                e report pronti per commercialista o F24.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
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
                <h3 className="heading-sm text-primary mb-2">Risparmio di Tempo</h3>
                <p className="body-md text-secondary">
                  Da ore di calcoli manuali a risultati istantanei.
                  Dedica più tempo alla tua attività principale.
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
                <h3 className="heading-sm text-primary mb-2">Zero Errori</h3>
                <p className="body-md text-secondary">
                  Elimina il rischio di errori di calcolo che possono
                  costare sanzioni e interessi di mora.
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
                <h3 className="heading-sm text-primary mb-2">Conformità Garantita</h3>
                <p className="body-md text-secondary">
                  Sempre aggiornato con le ultime normative.
                  Dormi sonni tranquilli sulla correttezza dei calcoli.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="heading-lg text-primary mb-4">
                Ottimizzazione Fiscale
              </h3>
              <p className="body-lg text-secondary leading-relaxed">
                Il sistema analizza automaticamente la tua situazione e suggerisce
                le strategie più vantaggiose per ridurre il carico fiscale legalmente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 