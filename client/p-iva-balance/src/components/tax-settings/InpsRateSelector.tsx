import React, { useEffect, useState } from 'react';
import { InpsParameters, InpsRate, inpsService } from '@/services/inpsService';

interface InpsRateSelectorProps {
  value?: string;
  onChange: (type: string, rate: number, minContribution: number) => void;
}

export const InpsRateSelector: React.FC<InpsRateSelectorProps> = ({ value, onChange }) => {
  const [parameters, setParameters] = useState<InpsParameters | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParameters = async () => {
      try {
        const params = await inpsService.getCurrentParameters();
        setParameters(params);
        if (!value) {
          // Se non c'è un valore selezionato, usa il default
          const defaultRate = inpsService.getDefaultRate();
          onChange(
            defaultRate.type,
            defaultRate.rate,
            params.minContributions[defaultRate.type] || 0
          );
        }
        setError(null);
      } catch (err) {
        setError('Errore nel caricamento dei parametri INPS');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadParameters();
  }, [value, onChange]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error || !parameters) {
    return (
      <div className="text-red-600 text-sm">
        {error || 'Errore nel caricamento dei parametri INPS'}
      </div>
    );
  }

  const handleRateChange = (rate: InpsRate) => {
    onChange(
      rate.type,
      rate.rate,
      parameters.minContributions[rate.type] || 0
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {parameters.rates.map((rate) => (
          <div
            key={rate.type}
            className={`relative flex items-center p-4 cursor-pointer rounded-lg border ${
              value === rate.type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
            }`}
            onClick={() => handleRateChange(rate)}
          >
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900">
                {rate.description}
              </div>
              <div className="mt-1 flex items-center">
                <span className="text-sm text-gray-500">
                  Aliquota: {rate.rate}%
                </span>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-sm text-gray-500">
                  Contributo minimo: €{parameters.minContributions[rate.type].toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div
                className={`h-5 w-5 rounded-full border ${
                  value === rate.type
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {value === rate.type && (
                  <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
