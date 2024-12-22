import React, { useState, useEffect } from 'react';
import { ProfessionalFund, professionalFundService } from '@/services/professionalFundService';

interface ProfessionalFundSelectorProps {
  value?: string;
  onChange: (fundId: string) => void;
  onFundChange: (fund: ProfessionalFund | null) => void;
  onParametersChange?: (params: { contributionRate: number; minimumContribution: number }) => void;
  error?: string;
}

export default function ProfessionalFundSelector({
  value,
  onChange,
  onFundChange,
  onParametersChange,
  error
}: ProfessionalFundSelectorProps) {
  const [funds, setFunds] = useState<ProfessionalFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedFund, setSelectedFund] = useState<ProfessionalFund | null>(null);
  const [manualContributionRate, setManualContributionRate] = useState<number | null>(null);
  const [manualMinimumContribution, setManualMinimumContribution] = useState<number | null>(null);

  useEffect(() => {
    loadFunds();
  }, []);

  useEffect(() => {
    if (value && funds.length > 0) {
      const fund = funds.find(f => f.code === value) || null;
      setSelectedFund(fund);
      onFundChange(fund);
    } else {
      setSelectedFund(null);
      onFundChange(null);
    }
  }, [value, funds, onFundChange]);

  const loadFunds = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const fetchedFunds = await professionalFundService.getAllFunds();
      setFunds(fetchedFunds);
    } catch (err) {
      setLoadError('Errore nel caricamento delle casse professionali');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fundCode = event.target.value;
    onChange(fundCode);
    
    const fund = funds.find(f => f.code === fundCode) || null;
    setSelectedFund(fund);
    onFundChange(fund);
  };

  if (loading) {
    return <div className="text-gray-500">Caricamento casse professionali...</div>;
  }

  if (loadError) {
    return <div className="text-red-500">{loadError}</div>;
  }

  const currentParameters = selectedFund 
    ? professionalFundService.getCurrentParameters(selectedFund)
    : null;

  return (
    <div className="space-y-2">
      <select
        value={value || ''}
        onChange={handleChange}
        className={`w-full p-2 border rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Seleziona una cassa professionale</option>
        {funds.map((fund) => (
          <option key={fund.code} value={fund.code}>
            {fund.name}
          </option>
        ))}
      </select>
      
      {error && <div className="text-red-500 text-sm">{error}</div>}
      
      {selectedFund && currentParameters && (
        <div className="mt-2 p-3 bg-gray-50 rounded">
          <h4 className="font-medium text-gray-700 mb-2">Parametri contributivi {currentParameters.year}</h4>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[150px_120px_auto] gap-2 items-center">
              <label className="text-gray-600">Aliquota contributiva:</label>
              {selectedFund.allowManualEdit ? (
                <>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={manualContributionRate !== null ? manualContributionRate : currentParameters.contributionRate}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setManualContributionRate(value);
                        if (onParametersChange) {
                          onParametersChange({
                            contributionRate: value,
                            minimumContribution: manualMinimumContribution !== null ? manualMinimumContribution : currentParameters.minimumContribution
                          });
                        }
                      }}
                      className="w-full p-1 border rounded text-right pr-8"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setManualContributionRate(null);
                      if (onParametersChange) {
                        onParametersChange({
                          contributionRate: currentParameters.contributionRate,
                          minimumContribution: manualMinimumContribution !== null ? manualMinimumContribution : currentParameters.minimumContribution
                        });
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs justify-self-start"
                  >
                    Reset
                  </button>
                </>
              ) : (
                <div className="col-span-2">
                  <span className="text-gray-700">{currentParameters.contributionRate}%</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-[150px_120px_auto] gap-2 items-center">
              <label className="text-gray-600">Contributo minimo:</label>
              {selectedFund.allowManualEdit ? (
                <>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={manualMinimumContribution !== null ? manualMinimumContribution : currentParameters.minimumContribution}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setManualMinimumContribution(value);
                        if (onParametersChange) {
                          onParametersChange({
                            contributionRate: manualContributionRate !== null ? manualContributionRate : currentParameters.contributionRate,
                            minimumContribution: value
                          });
                        }
                      }}
                      className="w-full p-1 border rounded text-right pl-8"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setManualMinimumContribution(null);
                      if (onParametersChange) {
                        onParametersChange({
                          contributionRate: manualContributionRate !== null ? manualContributionRate : currentParameters.contributionRate,
                          minimumContribution: currentParameters.minimumContribution
                        });
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs justify-self-start"
                  >
                    Reset
                  </button>
                </>
              ) : (
                <div className="col-span-2">
                  <span className="text-gray-700">€{currentParameters.minimumContribution.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
