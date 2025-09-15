'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  MegaphoneIcon, 
  WrenchScrewdriverIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

/**
 * Cookie Policy Page
 * 
 * GDPR and Italian Cookie Law compliant information page
 */
export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Cookie Policy
            </h1>
            <Link 
              href="/"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Torna al sito
            </Link>
          </div>
          <p className="text-gray-600 text-lg">
            Informazioni sui cookie utilizzati da PIVABalance e su come gestire le tue preferenze
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p><strong>Ultimo aggiornamento:</strong> {new Date().toLocaleDateString('it-IT', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Versione:</strong> 1.0</p>
          </div>
        </div>

        {/* What are cookies */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Cosa sono i cookie?
          </h2>
          <div className="prose text-gray-700 space-y-4">
            <p>
              I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo 
              (computer, tablet, smartphone) quando visiti un sito web. I cookie ci permettono 
              di riconoscerti e ricordare le tue preferenze per migliorare la tua esperienza 
              di navigazione.
            </p>
            <p>
              I cookie possono essere <strong>"di prima parte"</strong> (impostati direttamente 
              da PIVABalance) o <strong>"di terze parti"</strong> (impostati da altri servizi 
              che utilizziamo sul nostro sito).
            </p>
          </div>
        </div>

        {/* Cookie categories */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Tipi di cookie che utilizziamo
          </h2>
          
          <div className="space-y-6">
            {/* Necessary cookies */}
            <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
              <div className="flex items-start">
                <ShieldCheckIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Cookie Necessari (Sempre Attivi)
                  </h3>
                  <p className="text-green-800 mb-3">
                    Questi cookie sono essenziali per il funzionamento del sito web e 
                    non possono essere disabilitati nei nostri sistemi.
                  </p>
                  <div className="text-sm text-green-700">
                    <p className="font-medium mb-2">Finalità:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Autenticazione e gestione della sessione utente</li>
                      <li>Sicurezza e protezione CSRF</li>
                      <li>Funzionalità di base del sito (navigazione, accesso alle aree riservate)</li>
                      <li>Memorizzazione temporanea dei dati del carrello o form</li>
                    </ul>
                    <p className="mt-3"><strong>Base legale:</strong> Interesse legittimo (art. 6.1.f GDPR)</p>
                    <p><strong>Durata:</strong> Sessione o fino a 30 giorni</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Functional cookies */}
            <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
              <div className="flex items-start">
                <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Cookie Funzionali
                  </h3>
                  <p className="text-blue-800 mb-3">
                    Questi cookie permettono al sito di fornire funzionalità avanzate 
                    e personalizzazioni basate sulle tue scelte.
                  </p>
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-2">Finalità:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Memorizzazione delle preferenze di layout e tema</li>
                      <li>Personalizzazione della dashboard</li>
                      <li>Preferenze di lingua e localizzazione</li>
                      <li>Stato dei componenti UI (sidebar, modali, filtri)</li>
                    </ul>
                    <p className="mt-3"><strong>Base legale:</strong> Consenso (art. 6.1.a GDPR)</p>
                    <p><strong>Durata:</strong> Fino a 1 anno</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics cookies */}
            <div className="border-l-4 border-purple-400 bg-purple-50 p-4 rounded-r-lg">
              <div className="flex items-start">
                <ChartBarIcon className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    Cookie Analitici
                  </h3>
                  <p className="text-purple-800 mb-3">
                    Questi cookie ci aiutano a capire come i visitatori interagiscono 
                    con il sito web raccogliendo e riportando informazioni in forma anonima.
                  </p>
                  <div className="text-sm text-purple-700">
                    <p className="font-medium mb-2">Finalità:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Google Analytics per statistiche di utilizzo</li>
                      <li>Monitoraggio delle performance delle pagine</li>
                      <li>Analisi dei percorsi di navigazione</li>
                      <li>Statistiche di errori e crash reporting</li>
                    </ul>
                    <p className="mt-3"><strong>Servizi utilizzati:</strong> Google Analytics, Hotjar</p>
                    <p><strong>Base legale:</strong> Consenso (art. 6.1.a GDPR)</p>
                    <p><strong>Durata:</strong> Fino a 2 anni</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Marketing cookies */}
            <div className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
              <div className="flex items-start">
                <MegaphoneIcon className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    Cookie di Marketing
                  </h3>
                  <p className="text-orange-800 mb-3">
                    Questi cookie sono utilizzati per personalizzare la pubblicità 
                    e tracciare l'efficacia delle nostre campagne marketing.
                  </p>
                  <div className="text-sm text-orange-700">
                    <p className="font-medium mb-2">Finalità:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Pubblicità personalizzata basata sui tuoi interessi</li>
                      <li>Pixel di tracciamento social media (Facebook, LinkedIn)</li>
                      <li>Cookie di remarketing e retargeting</li>
                      <li>Analisi delle conversioni pubblicitarie</li>
                    </ul>
                    <p className="mt-3"><strong>Servizi utilizzati:</strong> Google Ads, Facebook Pixel, LinkedIn Insight Tag</p>
                    <p><strong>Base legale:</strong> Consenso (art. 6.1.a GDPR)</p>
                    <p><strong>Durata:</strong> Fino a 2 anni</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to manage cookies */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Come gestire i cookie
          </h2>
          <div className="prose text-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Tramite le nostre impostazioni
            </h3>
            <p>
              Puoi gestire le tue preferenze sui cookie in qualsiasi momento:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>
                <Link href="/dashboard/account" className="text-blue-600 hover:text-blue-800 underline">
                  Vai alle impostazioni account → Privacy e Cookie
                </Link>
              </li>
              <li>Clicca su "Mostra Banner" per modificare le tue preferenze</li>
              <li>Seleziona le categorie di cookie che desideri accettare</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Tramite il tuo browser
            </h3>
            <p>
              Puoi anche gestire i cookie direttamente dalle impostazioni del tuo browser:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti</li>
              <li><strong>Firefox:</strong> Impostazioni → Privacy e sicurezza → Cookie e dati dei siti web</li>
              <li><strong>Safari:</strong> Preferenze → Privacy → Gestisci dati siti web</li>
              <li><strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni sito</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-yellow-800">
                <strong>Nota:</strong> Disabilitare i cookie necessari potrebbe compromettere 
                il funzionamento del sito e limitare l'accesso ad alcune funzionalità.
              </p>
            </div>
          </div>
        </div>

        {/* Legal information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Informazioni legali
          </h2>
          <div className="prose text-gray-700 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Normative di riferimento
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>GDPR</strong> - Regolamento (UE) 2016/679 del Parlamento europeo</li>
              <li><strong>Codice Privacy</strong> - D.Lgs. 196/2003 e successive modifiche</li>
              <li><strong>Direttiva ePrivacy</strong> - Direttiva 2002/58/CE</li>
              <li><strong>Provvedimento Garante</strong> - "Individuazione delle modalità semplificate per l'informativa e l'acquisizione del consenso per l'uso dei cookie"</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              Titolare del trattamento
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>PIVABalance</strong></p>
              <p>Email: privacy@pivabalance.com</p>
              <p>Per esercitare i tuoi diritti relativi al trattamento dei dati personali, 
                 consulta la nostra <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 underline">Informativa sulla Privacy</Link>.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-6">
              I tuoi diritti
            </h3>
            <p>In conformità al GDPR, hai diritto a:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Accedere ai tuoi dati personali</li>
              <li>Rettificare dati inesatti</li>
              <li>Cancellare i tuoi dati (diritto all'oblio)</li>
              <li>Limitare il trattamento</li>
              <li>Portabilità dei dati</li>
              <li>Opporti al trattamento</li>
              <li>Revocare il consenso in qualsiasi momento</li>
            </ul>
          </div>
        </div>

        {/* Contact and updates */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contatti e aggiornamenti
          </h2>
          <div className="prose text-gray-700 space-y-4">
            <p>
              Per qualsiasi domanda relativa a questa Cookie Policy o per esercitare 
              i tuoi diritti, puoi contattarci:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@pivabalance.com</p>
              <p><strong>Supporto:</strong> support@pivabalance.com</p>
            </div>
            <p>
              Ci riserviamo il diritto di modificare questa Cookie Policy in qualsiasi momento. 
              Le modifiche saranno pubblicate su questa pagina con l'indicazione della data 
              di ultimo aggiornamento. Ti invitiamo a consultare periodicamente questa pagina 
              per essere sempre informato su come utilizziamo i cookie.
            </p>
          </div>
        </div>

        {/* Back to top */}
        <div className="text-center mt-8">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Torna all'inizio
          </button>
        </div>
      </div>
    </div>
  );
}
