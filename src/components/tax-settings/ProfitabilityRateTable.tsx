import React, { useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export interface ProfitabilityRate {
    sector: string;
    atecoCode: string;
    rate: number;
    description?: string;
}

/**
 * Profitability rates data for different ATECO sectors
 * Updated with 2024 coefficients
 */
export const profitabilityRates: ProfitabilityRate[] = [
    {
        sector: "Industrie alimentari e delle bevande",
        atecoCode: "(10-11)",
        rate: 40,
        description: "Produzione di prodotti alimentari e bevande"
    },
    {
        sector: "Commercio all'ingrosso e al dettaglio",
        atecoCode: "45- (da 46.2 a 46.9) – (da 47.1 a 47.7) – 47.9",
        rate: 40,
        description: "Commercio di veicoli, ingrosso e dettaglio"
    },
    {
        sector: "Commercio ambulante di prodotti alimentari e bevande",
        atecoCode: "47.81",
        rate: 40,
        description: "Vendita ambulante di prodotti alimentari e bevande"
    },
    {
        sector: "Attività dei servizi di alloggio e di ristorazione",
        atecoCode: "(55-56)",
        rate: 40,
        description: "Alberghi, ristoranti, bar e servizi di ristorazione"
    },
    {
        sector: "Commercio ambulante di altri prodotti",
        atecoCode: "47.82-47.89",
        rate: 54,
        description: "Vendita ambulante di altri prodotti non alimentari"
    },
    {
        sector: "Intermediari del commercio",
        atecoCode: "46.1",
        rate: 62,
        description: "Intermediari commerciali"
    },
    {
        sector: "Altre attività economiche",
        atecoCode: "(01-02-03) – (05-06-07-08-09) – (12-33) – (35-39) – (53-63) – (77-82) – (84) – (90-99)",
        rate: 67,
        description: "Agricoltura, industria, trasporti, servizi vari"
    },
    {
        sector: "Attività professionali, scientifiche, tecniche, sanitarie, di istruzione, servizi finanziari ed assicurativi",
        atecoCode: "(64-66) – (69-75) – (85-88)",
        rate: 78,
        description: "Professioni tecniche, sanitarie, finanziarie, educative"
    },
    {
        sector: "Costruzioni e attività immobiliari",
        atecoCode: "(41-43) – (68)",
        rate: 86,
        description: "Edilizia, costruzioni e attività immobiliari"
    }
];

interface ProfitabilityRateTableProps {
    isOpen: boolean;
    onSelect: (rate: ProfitabilityRate) => void;
    selectedRate?: number;
    onClose: () => void;
}

/**
 * ProfitabilityRateTable Component
 * Modal dialog for selecting ATECO profitability rates with search functionality
 * Used in the forfettario tax regime to determine taxable income percentage
 */
export const ProfitabilityRateTable: React.FC<ProfitabilityRateTableProps> = ({
    isOpen,
    onSelect,
    selectedRate,
    onClose
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter rates based on search term
    const filteredRates = useMemo(() => {
        if (!searchTerm.trim()) {
            return profitabilityRates;
        }

        const search = searchTerm.toLowerCase();
        return profitabilityRates.filter(rate =>
            rate.sector.toLowerCase().includes(search) ||
            rate.atecoCode.toLowerCase().includes(search) ||
            rate.description?.toLowerCase().includes(search)
        );
    }, [searchTerm]);

    const handleSelect = (rate: ProfitabilityRate) => {
        onSelect(rate);
        onClose();
    };

    const handleClose = () => {
        setSearchTerm('');
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-semibold leading-6 text-gray-900"
                                        >
                                            Coefficienti di Redditività per Settore ATECO
                                        </Dialog.Title>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Seleziona il coefficiente corrispondente alla tua attività economica
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={handleClose}
                                    >
                                        <span className="sr-only">Chiudi</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Search */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Cerca per settore, codice ATECO o descrizione..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    {searchTerm && (
                                        <p className="mt-2 text-sm text-gray-600">
                                            Trovati {filteredRates.length} risultati per "{searchTerm}"
                                        </p>
                                    )}
                                </div>

                                {/* Table */}
                                <div className="max-h-96 overflow-y-auto">
                                    {filteredRates.length > 0 ? (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Settore di Attività
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Codici ATECO 2007
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Coefficiente
                                                    </th>
                                                    <th scope="col" className="relative px-6 py-3">
                                                        <span className="sr-only">Seleziona</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {filteredRates.map((rate, index) => (
                                                    <tr
                                                        key={index}
                                                        className={`transition-colors ${selectedRate === rate.rate
                                                                ? 'bg-blue-50 border-blue-200'
                                                                : 'hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900 font-medium">
                                                                {rate.sector}
                                                            </div>
                                                            {rate.description && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {rate.description}
                                                                </div>
                                                            )}
                                                            {/* Show ATECO codes on mobile */}
                                                            <div className="md:hidden text-xs text-gray-500 mt-1">
                                                                ATECO: {rate.atecoCode}
                                                            </div>
                                                        </td>
                                                        <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">
                                                            {rate.atecoCode}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {rate.rate}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => handleSelect(rate)}
                                                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${selectedRate === rate.rate
                                                                        ? 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                                                        : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                                                    }`}
                                                            >
                                                                {selectedRate === rate.rate ? 'Selezionato' : 'Seleziona'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-gray-500">
                                                Nessun risultato trovato per "{searchTerm}"
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Prova a modificare i termini di ricerca
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <p className="text-xs text-gray-500">
                                        Coefficienti di redditività validi per l'anno 2024.
                                        Consulta sempre la normativa vigente per conferma.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Chiudi
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}; 