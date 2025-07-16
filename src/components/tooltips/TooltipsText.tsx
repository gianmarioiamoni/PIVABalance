import React from 'react';

/**
 * Tax Regime Information Tooltip
 */
export const taxRegimeInfo = (
    <div className="space-y-4 max-w-lg">
        <div>
            <h4 className="font-semibold text-gray-900 mb-2">Regime Forfettario:</h4>
            <ul className="list-disc pl-4 space-y-2 text-sm">
                <li>Reddito imponibile calcolato come percentuale dei ricavi (determinata dal coefficiente di redditività)</li>
                <li>Imposta sostitutiva al 15% (ridotta al 5% per i primi 5 anni con determinati requisiti)</li>
                <li>Esenzione IVA: non applichi l'IVA sulle fatture emesse, ma non puoi detrarre quella sugli acquisti</li>
                <li>Limiti: ricavi fino a 85.000€ annui (dal 2023)</li>
                <li>Contabilità semplificata: registri semplici senza obbligo di bilancio</li>
            </ul>
        </div>
        <div>
            <h4 className="font-semibold text-gray-900 mb-2">Regime Ordinario:</h4>
            <ul className="list-disc pl-4 space-y-2 text-sm">
                <li>Reddito imponibile = Ricavi - Costi deducibili</li>
                <li>Tassazione basata sull'IRPEF a scaglioni progressivi</li>
                <li>Applicazione e gestione dell'IVA con possibilità di detrazione</li>
                <li>Contabilità completa obbligatoria (registri IVA, libro giornale, inventari)</li>
                <li>Maggiori adempimenti fiscali ma più flessibilità nella gestione</li>
            </ul>
        </div>
    </div>
);

/**
 * Profitability Rate Information Tooltip
 */
export const profitabilityInfo = (
    <div className="space-y-3 max-w-md">
        <p className="text-sm leading-relaxed">
            Il <strong>coefficiente di redditività</strong> serve a determinare la parte del fatturato
            che viene considerata "reddito imponibile" su cui calcolare imposte e contributi previdenziali.
        </p>
        <p className="text-sm leading-relaxed">
            Ogni attività economica ha un coefficiente specifico, stabilito in base al
            <strong> codice ATECO</strong> che identifica la tua attività professionale.
        </p>
        <p className="text-sm leading-relaxed">
            Il restante fatturato viene considerato una stima forfettaria dei costi di esercizio
            e non è soggetto a tassazione.
        </p>
        <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-800">
                💡 Clicca "Seleziona" per visualizzare tutti i coefficienti per categoria ATECO
            </p>
        </div>
    </div>
);

/**
 * Pension System Information Tooltip
 */
export const pensionSystemInfo = (
    <div className="space-y-4 max-w-lg">
        <div>
            <h4 className="font-semibold text-gray-900 mb-2">Gestione Separata INPS:</h4>
            <p className="text-sm leading-relaxed mb-2">
                Sistema previdenziale obbligatorio per liberi professionisti senza cassa di previdenza
                dedicata e per lavoratori autonomi con partita IVA.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Aliquota contributiva: 26% (dal 2024)</li>
                <li>Contributo minimo annuale variabile</li>
                <li>Massimale contributivo aggiornato annualmente</li>
            </ul>
        </div>
        <div>
            <h4 className="font-semibold text-gray-900 mb-2">Cassa Professionale:</h4>
            <p className="text-sm leading-relaxed mb-2">
                Sistema previdenziale specifico per determinate categorie professionali,
                gestito da enti previdenziali dedicati.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Aliquote e regole specifiche per ogni cassa</li>
                <li>Spesso più vantaggiose rispetto alla Gestione Separata</li>
                <li>Prestazioni previdenziali e assistenziali dedicate</li>
            </ul>
        </div>
    </div>
);

/**
 * INPS Rate Types Information Tooltip
 */
export const inpsRateTypesInfo = (
    <div className="space-y-3 max-w-md">
        <div>
            <h4 className="font-semibold text-gray-900 mb-2">Collaboratori e Professionisti:</h4>
            <p className="text-sm">
                Aliquota standard per la maggior parte dei liberi professionisti e collaboratori continuativi.
            </p>
        </div>
        <div>
            <h4 className="font-semibold text-gray-900 mb-2">Artigiani e Commercianti:</h4>
            <p className="text-sm">
                Aliquota dedicata per attività artigianali e commerciali con partita IVA.
            </p>
        </div>
        <div>
            <h4 className="font-semibold text-gray-900 mb-2">Produttori Agricoli:</h4>
            <p className="text-sm">
                Aliquota specifica per attività agricole e di produzione primaria.
            </p>
        </div>
    </div>
);

/**
 * Professional Fund Information Tooltip  
 */
export const professionalFundInfo = (
    <div className="space-y-3 max-w-lg">
        <p className="text-sm leading-relaxed">
            Le <strong>Casse di Previdenza Professionali</strong> sono enti previdenziali autonomi
            che gestiscono la previdenza obbligatoria per specifiche categorie professionali.
        </p>

        <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm">Principali vantaggi:</h4>
            <ul className="list-disc pl-4 space-y-1 text-sm">
                <li>Prestazioni previdenziali spesso più favorevoli</li>
                <li>Servizi assistenziali dedicati alla categoria</li>
                <li>Gestione specializzata per la specifica professione</li>
                <li>Possibilità di cumulo con altre forme previdenziali</li>
            </ul>
        </div>

        <div className="mt-3 p-3 bg-amber-50 rounded-md">
            <p className="text-sm font-medium text-amber-800">
                ⚠️ L'iscrizione è obbligatoria se si appartiene a una delle categorie professionali
                che hanno una cassa dedicata
            </p>
        </div>
    </div>
);

/**
 * Export all tooltip content for easy access
 */
export const tooltipContents = {
    taxRegime: taxRegimeInfo,
    profitability: profitabilityInfo,
    pensionSystem: pensionSystemInfo,
    inpsRateTypes: inpsRateTypesInfo,
    professionalFund: professionalFundInfo,
} as const; 