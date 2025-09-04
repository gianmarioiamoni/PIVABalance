import React from 'react';

/**
 * Tax Regime Information Tooltip
 */
export const taxRegimeInfo = (
    <div className="space-y-4">
        <div>
            <h4 className="font-semibold mb-2">Regime forfettario:</h4>
            <ul className="list-disc pl-4 space-y-2">
                <li>Tassa fissa del 5% (primi 5 anni) o 15% sul reddito</li>
                <li>Nessuna IVA su fatture emesse</li>
                <li>Soglia massima di ricavi: varia per codice ATECO</li>
                <li>Spese forfettarie calcolate automaticamente</li>
                <li>Semplificazioni amministrative e contabili</li>
            </ul>
        </div>
        <div>
            <p className="text-sm text-gray-600">
                <strong>Attenzione:</strong> Il regime forfettario prevede limitazioni su costi
                deducibili e personale dipendente.
            </p>
        </div>
    </div>
);

/**
 * Profitability Rate Information Tooltip
 */
export const profitabilityInfo = (
    <div className="space-y-3">
        <p>
            <strong>Coefficiente di redditività:</strong> percentuale fissa stabilita
            per legge in base al codice ATECO.
        </p>
        <p>
            Determina l&apos;ammontare del reddito imponibile nel regime forfettario:
        </p>
        <p className="font-mono text-sm bg-gray-100 p-2 rounded">
            Reddito = Ricavi × Coefficiente di redditività
        </p>
    </div>
);

/**
 * Pension System Information Tooltip
 */
export const pensionSystemInfo = (
    <div className="space-y-3">
        <p>
            <strong>Sistema pensionistico:</strong> determina l&apos;aliquota contributiva
            da applicare per la previdenza obbligatoria.
        </p>
        <ul className="list-disc pl-4 space-y-1">
            <li><strong>Contributivo:</strong> aliquote standard attuali</li>
            <li><strong>Retributivo:</strong> aliquote più elevate per chi ha iniziato prima del 1996</li>
        </ul>
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
    <div className="space-y-3">
        <p>
            <strong>Cassa professionale:</strong> ente previdenziale obbligatorio
            per specifiche categorie professionali.
        </p>
        <p>
            Ogni cassa ha proprie aliquote, minimali e massimali contributivi.
            La scelta determina i contributi previdenziali da versare.
        </p>
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