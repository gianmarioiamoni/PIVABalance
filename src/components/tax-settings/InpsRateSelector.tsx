import React, { useEffect, useState } from 'react';
import { Tooltip } from '@/components/ui';
import { inpsRateTypesInfo } from '@/components/tooltips/TooltipsText';

// INPS Rate Types - these should ideally come from a service/data file
const INPS_RATE_TYPES = {
    COLLABORATORS: {
        id: 'COLLABORATORS',
        name: 'Collaboratori e Professionisti',
        rate: 26.0,
        minContribution: 4200,
        description: 'Aliquota standard per la maggior parte dei liberi professionisti'
    },
    ARTISANS_MERCHANTS: {
        id: 'ARTISANS_MERCHANTS',
        name: 'Artigiani e Commercianti',
        rate: 26.0,
        minContribution: 4200,
        description: 'Aliquota per attività artigianali e commerciali'
    },
    AGRICULTURAL: {
        id: 'AGRICULTURAL',
        name: 'Produttori Agricoli',
        rate: 24.0,
        minContribution: 3800,
        description: 'Aliquota specifica per attività agricole'
    }
} as const;

interface InpsRateSelectorProps {
    value?: string;
    onChange: (type: string, rate: number, minContribution: number) => void;
}

/**
 * InpsRateSelector Component
 * Allows users to select the appropriate INPS contribution rate type
 * Automatically sets the corresponding rate and minimum contribution
 */
export const InpsRateSelector: React.FC<InpsRateSelectorProps> = ({
    value = 'COLLABORATORS',
    onChange
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState(value);

    // Initialize with default value
    useEffect(() => {
        if (!value) {
            const defaultType = INPS_RATE_TYPES.COLLABORATORS;
            onChange(defaultType.id, defaultType.rate, defaultType.minContribution);
            setSelectedType(defaultType.id);
        }
    }, [value, onChange]);

    const handleRateTypeChange = (typeId: string) => {
        const rateType = Object.values(INPS_RATE_TYPES).find(type => type.id === typeId);

        if (rateType) {
            setLoading(true);
            setSelectedType(typeId);

            // Simulate a brief loading state for better UX
            setTimeout(() => {
                onChange(rateType.id, rateType.rate, rateType.minContribution);
                setLoading(false);
            }, 300);
        }
    };

    const currentRate = Object.values(INPS_RATE_TYPES).find(type => type.id === selectedType);

    return (
        <div className="space-y-4">
            {/* Rate Type Selector */}
            <div>
                <div className="flex items-center mb-3">
                    <label
                        htmlFor="inps-rate-type"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Tipo di Contribuente INPS
                    </label>
                    <Tooltip content={inpsRateTypesInfo} />
                </div>

                <select
                    id="inps-rate-type"
                    value={selectedType}
                    onChange={(e) => handleRateTypeChange(e.target.value)}
                    disabled={loading}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-describedby="inps-rate-type-help"
                >
                    {Object.values(INPS_RATE_TYPES).map((rateType) => (
                        <option key={rateType.id} value={rateType.id}>
                            {rateType.name}
                        </option>
                    ))}
                </select>

                <p id="inps-rate-type-help" className="mt-1 text-xs text-gray-500">
                    Seleziona la categoria che corrisponde alla tua attività professionale
                </p>
            </div>

            {/* Rate Details Card */}
            {currentRate ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    {loading ? (
                        <div className="animate-pulse">
                            <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                        </div>
                    ) : (
                        <div>
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">
                                {currentRate.name}
                            </h4>
                            <p className="text-sm text-blue-800 mb-3">
                                {currentRate.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white rounded-md p-3 border border-blue-200">
                                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Aliquota Contributiva
                                    </dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                                        {currentRate.rate}%
                                    </dd>
                                </div>

                                <div className="bg-white rounded-md p-3 border border-blue-200">
                                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Contributo Minimo Annuo
                                    </dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                                        €{currentRate.minContribution.toLocaleString('it-IT')}
                                    </dd>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}

            {/* Additional Info */}
            <div className="text-xs text-gray-500">
                <p>
                    I parametri INPS vengono aggiornati annualmente.
                    Assicurati di verificare le aliquote correnti sul sito ufficiale INPS.
                </p>
            </div>
        </div>
    );
}; 