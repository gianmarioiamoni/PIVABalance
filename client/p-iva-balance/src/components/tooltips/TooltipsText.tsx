export const taxRegimeInfo = (
    <div className="space-y-4">
        <div>
            <h4 className="font-semibold mb-2">Regime forfettario:</h4>
            <ul className="list-disc pl-4 space-y-2">
                <li>Reddito imponibile calcolato come percentuale dei ricavi (determinata dal coefficiente di redditività).</li>
                <li>Imposta sostitutiva al 15% (ridotta al 5% per i primi 5 anni, se soddisfi determinati requisiti).</li>
                <li>Esenzione IVA: non applichi l'IVA sulle fatture emesse, ma non puoi detrarre quella sugli acquisti.</li>
                <li>Limiti: ricavi fino a 85.000€ annui (dal 2023).</li>
            </ul>
        </div>
        <div>
            <h4 className="font-semibold mb-2">Regime ordinario:</h4>
            <ul className="list-disc pl-4 space-y-2">
                <li>Reddito imponibile = Ricavi - Costi deducibili.</li>
                <li>Tassazione basata sull'IRPEF a scaglioni.</li>
                <li>Applicazione e gestione dell'IVA su fatture emesse e ricevute (con possibilità di detrazione dell'IVA sugli acquisti).</li>
                <li>Obbligo di tenuta della contabilità completa (registri IVA, libro giornale, ecc.).</li>
            </ul>
        </div>
    </div>
);

export const profitabilityInfo = (
    <div className="space-y-2">
        <p>
            Il coefficiente di redditività serve a determinare la parte del fatturato che viene considerata "reddito imponibile"
            su cui calcolare le imposte (imposta sostitutiva) e i contributi previdenziali.
        </p>
        <p>
            Ogni attività economica ha un coefficiente di redditività specifico, stabilito in base al codice ATECO che
            identifica la tua attività. Questo coefficiente rappresenta la percentuale del fatturato considerata
            effettivamente come "utile" ai fini fiscali.
        </p>
        <p>
            Il restante fatturato viene invece considerato una stima forfettaria dei costi di esercizio e non è tassato.
        </p>
        <p className="font-medium mt-2">
            Clicca "Seleziona da Tabella" per visualizzare tutti i coefficienti per categoria ATECO.
        </p>
    </div>
);

export const pensionSystemInfo = (
    <div className="space-y-2">
        <div>
            <h4 className="font-semibold mb-2">Gestione Separata INPS:</h4>
            <p>
                Sistema previdenziale obbligatorio per i liberi professionisti senza cassa di previdenza dedicata
                e per i lavoratori autonomi con partita IVA.
            </p>
        </div>
        <div>
            <h4 className="font-semibold mb-2">Cassa Professionale:</h4>
            <p>
                Sistema previdenziale specifico per determinate categorie professionali, gestito da enti previdenziali dedicati.
                Ogni cassa ha le proprie regole e aliquote contributive.
            </p>
        </div>
    </div>
);

export const professionalFundInfo = (
    <div className="space-y-3">
        <p>
            Le casse professionali sono enti previdenziali obbligatori per specifiche categorie professionali.
            Ogni cassa gestisce la previdenza per i propri iscritti con parametri contributivi dedicati.
        </p>
        <div>
            <h4 className="font-semibold mb-2">Principali casse professionali:</h4>
            <ul className="list-disc pl-4 space-y-1 text-sm">
                <li><strong>Cassa Forense:</strong> Avvocati e praticanti avvocati</li>
                <li><strong>CNPDAC:</strong> Dottori commercialisti ed esperti contabili</li>
                <li><strong>Cassa Ragionieri:</strong> Ragionieri e periti commerciali</li>
                <li><strong>Cassa Geometri:</strong> Geometri e geometri laureati</li>
                <li><strong>Inarcassa:</strong> Ingegneri e architetti</li>
                <li><strong>ENPACL:</strong> Consulenti del lavoro</li>
            </ul>
        </div>
        <p className="text-sm">
            <strong>Parametri contributivi:</strong> Ogni cassa definisce aliquote, contributi minimi e contributi fissi
            che vengono aggiornati annualmente. Alcune casse consentono la personalizzazione manuale dei parametri.
        </p>
    </div>
);