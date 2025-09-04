import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gestione Fatture e Costi | P.IVA Balance',
    description: 'Organizza fatture emesse e costi sostenuti con categorizzazione automatica per deducibilità fiscale e reporting avanzato.',
};

export default function GestioneFatturePage() {
    return (
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
                    Organizza automaticamente fatture e costi con categorizzazione intelligente.
                    Massimizza le deduzioni fiscali e genera report professionali.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-3xl mb-4">🤖</div>
                    <h3 className="heading-md text-primary mb-3">Categorizzazione Automatica</h3>
                    <p className="body-md text-secondary leading-relaxed">
                        L&apos;AI riconosce automaticamente il tipo di costo e suggerisce la categoria fiscale più appropriata,
                        ottimizzando le deduzioni.
                    </p>
                </div>

                <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="heading-md text-primary mb-3">Tracking Deducibilità</h3>
                    <p className="body-md text-secondary leading-relaxed">
                        Traccia automaticamente percentuali di deducibilità per ogni spesa.
                        Calcoli precisi per uso promiscuo auto, telefono e altre spese miste.
                    </p>
                </div>

                <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-3xl mb-4">🔍</div>
                    <h3 className="heading-md text-primary mb-3">Ricerca Avanzata</h3>
                    <p className="body-md text-secondary leading-relaxed">
                        Trova rapidamente fatture e costi con filtri avanzati per data, categoria,
                        fornitore o importo. Organizzazione semplice e veloce.
                    </p>
                </div>

                <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-3xl mb-4">📱</div>
                    <h3 className="heading-md text-primary mb-3">Acquisizione Mobile</h3>
                    <p className="body-md text-secondary leading-relaxed">
                        Scatta foto agli scontrini con lo smartphone. Il sistema estrae automaticamente
                        dati fiscali e li categorizza per te.
                    </p>
                </div>

                <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-3xl mb-4">💾</div>
                    <h3 className="heading-md text-primary mb-3">Archiviazione Digitale</h3>
                    <p className="body-md text-secondary leading-relaxed">
                        Documenti sempre disponibili nel cloud. Addio scatole di scontrini:
                        tutto organizzato e facilmente accessibile.
                    </p>
                </div>

                <div className="surface-secondary rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="text-3xl mb-4">📈</div>
                    <h3 className="heading-md text-primary mb-3">Report Intelligenti</h3>
                    <p className="body-md text-secondary leading-relaxed">
                        Genera automaticamente report per commercialista, riepiloghi trimestrali
                        e analisi dei costi per categoria.
                    </p>
                </div>
            </div>

            {/* Document Types */}
            <div className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl p-12">
                <div className="content-wide mx-auto">
                    <h2 className="heading-xl text-primary text-center mb-12">
                        Tipologie di Documenti Supportate
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-3xl mb-3">🧾</div>
                            <h3 className="heading-sm text-primary mb-2">Fatture Emesse</h3>
                            <p className="body-sm text-secondary">
                                Tracking automatico dei ricavi e gestione IVA
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-3xl mb-3">📄</div>
                            <h3 className="heading-sm text-primary mb-2">Fatture Ricevute</h3>
                            <p className="body-sm text-secondary">
                                Organizzazione costi e verifica deducibilità
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-3xl mb-3">🧾</div>
                            <h3 className="heading-sm text-primary mb-2">Scontrini</h3>
                            <p className="body-sm text-secondary">
                                Acquisizione mobile e categorizzazione automatica
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                            <div className="text-3xl mb-3">🚗</div>
                            <h3 className="heading-sm text-primary mb-2">Spese Auto</h3>
                            <p className="body-sm text-secondary">
                                Calcolo uso promiscuo e chilometraggio business
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="content-wide mx-auto">
                <h2 className="heading-xl text-primary text-center mb-12">
                    Vantaggi della Gestione Digitale
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
                                <h3 className="heading-sm text-primary mb-2">Massima Deducibilità</h3>
                                <p className="body-md text-secondary">
                                    Il sistema identifica automaticamente tutte le opportunità di deduzione,
                                    massimizzando i risparmi fiscali legali.
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
                                    Tutti i documenti sono archiviati secondo normative fiscali.
                                    Pronto per eventuali controlli o verifiche.
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
                                <h3 className="heading-sm text-primary mb-2">Tempo Risparmiato</h3>
                                <p className="body-md text-secondary">
                                    Addio alla ricerca manuale di documenti.
                                    Tutto accessibile in pochi click quando serve.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                        <div className="text-center">
                            <div className="text-5xl mb-6">🚀</div>
                            <h3 className="heading-lg text-primary mb-4">
                                Automazione Completa
                            </h3>
                            <p className="body-lg text-secondary leading-relaxed">
                                Dalla cattura del documento al calcolo delle deduzioni,
                                tutto avviene automaticamente. Tu pensi al business, noi alla burocrazia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Workflow */}
            <div className="content-wide mx-auto">
                <h2 className="heading-xl text-primary text-center mb-12">
                    Flusso di Lavoro Semplificato
                </h2>

                <div className="grid md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl font-bold text-purple-600">1</span>
                        </div>
                        <h3 className="heading-md text-primary mb-4">Carica</h3>
                        <p className="body-md text-secondary">
                            Scatta foto o carica documenti digitali direttamente nell&apos;app.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl font-bold text-purple-600">2</span>
                        </div>
                        <h3 className="heading-md text-primary mb-4">Elabora</h3>
                        <p className="body-md text-secondary">
                            L&apos;AI estrae automaticamente i dati e categorizza il documento.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl font-bold text-purple-600">3</span>
                        </div>
                        <h3 className="heading-md text-primary mb-4">Verifica</h3>
                        <p className="body-md text-secondary">
                            Controlla e conferma i dati estratti con un semplice tap.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl font-bold text-purple-600">4</span>
                        </div>
                        <h3 className="heading-md text-primary mb-4">Archivia</h3>
                        <p className="body-md text-secondary">
                            Il documento è pronto per report, calcoli fiscali e controlli.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 