'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

/**
 * Privacy Policy Page
 * 
 * GDPR compliant privacy policy for PIVABalance
 */
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Informativa sulla Privacy
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
            Informazioni su come PIVABalance raccoglie, utilizza e protegge i tuoi dati personali
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

        {/* Data controller */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Titolare del trattamento
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-900">PIVABalance</p>
            <p className="text-gray-700">Sistema di gestione finanziaria per Partite IVA</p>
            <p className="text-gray-700 mt-2">
              <strong>Email:</strong> privacy@pivabalance.com<br />
              <strong>Supporto:</strong> support@pivabalance.com
            </p>
          </div>
        </div>

        {/* Data we collect */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Dati che raccogliamo
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Dati di registrazione e profilo
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Nome e cognome</li>
                <li>Indirizzo email</li>
                <li>Ragione sociale/Nome azienda</li>
                <li>Password (crittografata)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Dati finanziari
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Fatture e documenti fiscali</li>
                <li>Costi e spese aziendali</li>
                <li>Informazioni sui pagamenti</li>
                <li>Dati contabili e fiscali</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Dati tecnici
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Indirizzo IP</li>
                <li>Informazioni sul browser</li>
                <li>Dati di utilizzo dell'applicazione</li>
                <li>Log di accesso e attività</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why we collect data */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Perché raccogliamo i tuoi dati
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Fornitura del servizio (Art. 6.1.b GDPR)
              </h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1 ml-4">
                <li>Gestione del tuo account e autenticazione</li>
                <li>Elaborazione e archiviazione dei dati finanziari</li>
                <li>Generazione di report e analisi</li>
                <li>Supporto tecnico e assistenza clienti</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Obblighi legali (Art. 6.1.c GDPR)
              </h3>
              <ul className="list-disc list-inside text-green-800 space-y-1 ml-4">
                <li>Conservazione documenti fiscali per normativa italiana</li>
                <li>Adempimenti contabili e fiscali</li>
                <li>Risposta a richieste delle autorità competenti</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-400 bg-purple-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-purple-900 mb-2">
                Interesse legittimo (Art. 6.1.f GDPR)
              </h3>
              <ul className="list-disc list-inside text-purple-800 space-y-1 ml-4">
                <li>Sicurezza dell'applicazione e prevenzione frodi</li>
                <li>Miglioramento del servizio e sviluppo nuove funzionalità</li>
                <li>Analisi statistiche anonime</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-orange-900 mb-2">
                Consenso (Art. 6.1.a GDPR)
              </h3>
              <ul className="list-disc list-inside text-orange-800 space-y-1 ml-4">
                <li>Marketing e comunicazioni promozionali</li>
                <li>Cookie non necessari (analytics, marketing)</li>
                <li>Newsletter e aggiornamenti del servizio</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Your rights */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="ml-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                I tuoi diritti
              </h2>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            In conformità al GDPR, hai i seguenti diritti sui tuoi dati personali:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Diritto di accesso</h3>
                <p className="text-sm text-gray-600">Ottenere informazioni sui dati che trattiamo</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Diritto di rettifica</h3>
                <p className="text-sm text-gray-600">Correggere dati inesatti o incompleti</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Diritto alla cancellazione</h3>
                <p className="text-sm text-gray-600">Richiedere l'eliminazione dei tuoi dati</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Diritto di limitazione</h3>
                <p className="text-sm text-gray-600">Limitare il trattamento in certe circostanze</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Diritto alla portabilità</h3>
                <p className="text-sm text-gray-600">Ottenere i tuoi dati in formato strutturato</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Diritto di opposizione</h3>
                <p className="text-sm text-gray-600">Opporti al trattamento per marketing</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Revoca del consenso</h3>
                <p className="text-sm text-gray-600">Ritirare il consenso in qualsiasi momento</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Reclamo al Garante</h3>
                <p className="text-sm text-gray-600">Presentare reclamo all'autorità di controllo</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Come esercitare i tuoi diritti:</strong> Invia una richiesta a privacy@pivabalance.com 
              specificando quale diritto vuoi esercitare. Risponderemo entro 30 giorni dalla ricezione della richiesta.
            </p>
          </div>
        </div>

        {/* Data security */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Sicurezza dei dati
          </h2>
          <div className="prose text-gray-700 space-y-4">
            <p>
              Implementiamo misure tecniche e organizzative appropriate per proteggere 
              i tuoi dati personali contro accessi non autorizzati, perdite o distruzioni:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Crittografia dei dati sensibili (HTTPS/TLS)</li>
              <li>Autenticazione sicura con hash delle password</li>
              <li>Backup regolari e ridondanza dei dati</li>
              <li>Monitoraggio degli accessi e audit trail</li>
              <li>Formazione del personale sulla protezione dei dati</li>
              <li>Valutazioni periodiche della sicurezza</li>
            </ul>
          </div>
        </div>

        {/* Data retention */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Conservazione dei dati
          </h2>
          <div className="prose text-gray-700 space-y-4">
            <p>
              Conserviamo i tuoi dati personali solo per il tempo necessario alle finalità 
              per cui sono stati raccolti:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Dati account:</strong> Per tutta la durata del rapporto contrattuale</li>
              <li><strong>Dati finanziari:</strong> 10 anni (obbligo di legge italiano)</li>
              <li><strong>Dati di marketing:</strong> Fino alla revoca del consenso</li>
              <li><strong>Log tecnici:</strong> Massimo 12 mesi</li>
            </ul>
            <p>
              Alla scadenza dei termini di conservazione, i dati vengono cancellati 
              in modo sicuro e irreversibile.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contatti
          </h2>
          <div className="prose text-gray-700 space-y-4">
            <p>
              Per qualsiasi domanda relativa a questa informativa sulla privacy 
              o per esercitare i tuoi diritti:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Data Protection Officer:</strong> privacy@pivabalance.com</p>
              <p><strong>Supporto generale:</strong> support@pivabalance.com</p>
              <p><strong>Garante Privacy:</strong> <a href="https://www.garanteprivacy.it" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">www.garanteprivacy.it</a></p>
            </div>
            <p>
              Consulta anche la nostra <Link href="/cookie-policy" className="text-blue-600 hover:text-blue-800 underline">Cookie Policy</Link> 
              per informazioni specifiche sui cookie che utilizziamo.
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
