import React, { useState, useEffect } from 'react';
import { ProfessionalFund, professionalFundService } from '@/services/professionalFundService';

interface ProfessionalFundSelectorProps {
  value?: string;
  onChange: (fundId: string) => void;
  onFundChange: (fund: ProfessionalFund | null) => void;
  onParametersChange?: (params: { contributionRate: number; minimumContribution: number; fixedAnnualContributions: number }) => void;
  error?: string;
  initialManualValues?: {
    manualContributionRate?: number;
    manualMinimumContribution?: number;
    manualFixedAnnualContributions?: number;
  };
}

export default function ProfessionalFundSelector({
  value,
  onChange,
  onFundChange,
  onParametersChange,
  error,
  initialManualValues
}: ProfessionalFundSelectorProps) {
  const [funds, setFunds] = useState<ProfessionalFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedFund, setSelectedFund] = useState<ProfessionalFund | null>(null);
  const [manualContributionRate, setManualContributionRate] = useState<number | null>(null);
  const [manualMinimumContribution, setManualMinimumContribution] = useState<number | null>(null);
  const [manualFixedAnnualContributions, setManualFixedAnnualContributions] = useState<number | null>(null);

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

  useEffect(() => {
    if (initialManualValues) {
      if (initialManualValues.manualContributionRate !== undefined) {
        setManualContributionRate(initialManualValues.manualContributionRate);
      }
      if (initialManualValues.manualMinimumContribution !== undefined) {
        setManualMinimumContribution(initialManualValues.manualMinimumContribution);
      }
      if (initialManualValues.manualFixedAnnualContributions !== undefined) {
        setManualFixedAnnualContributions(initialManualValues.manualFixedAnnualContributions);
      }
    }
  }, [initialManualValues]);

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
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={manualContributionRate ?? currentParameters.contributionRate}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setManualContributionRate(value);
                      if (onParametersChange) {
                        onParametersChange({
                          contributionRate: value,
                          minimumContribution: manualMinimumContribution ?? currentParameters.minimumContribution,
                          fixedAnnualContributions: manualFixedAnnualContributions ?? currentParameters.fixedAnnualContributions
                        });
                      }
                    }}
                    className="w-20 p-1 border rounded"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <span>%</span>
                </div>
              ) : (
                <div>{currentParameters.contributionRate}%</div>
              )}
              {selectedFund.allowManualEdit && (
                <button
                  onClick={() => {
                    setManualContributionRate(null);
                    if (onParametersChange) {
                      onParametersChange({
                        contributionRate: currentParameters.contributionRate,
                        minimumContribution: manualMinimumContribution ?? currentParameters.minimumContribution,
                        fixedAnnualContributions: manualFixedAnnualContributions ?? currentParameters.fixedAnnualContributions
                      });
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-[150px_120px_auto] gap-2 items-center">
              <label className="text-gray-600">Contributo minimo:</label>
              {selectedFund.allowManualEdit ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={manualMinimumContribution ?? currentParameters.minimumContribution}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setManualMinimumContribution(value);
                      if (onParametersChange) {
                        onParametersChange({
                          contributionRate: manualContributionRate ?? currentParameters.contributionRate,
                          minimumContribution: value,
                          fixedAnnualContributions: manualFixedAnnualContributions ?? currentParameters.fixedAnnualContributions
                        });
                      }
                    }}
                    className="w-20 p-1 border rounded"
                    min="0"
                    step="0.01"
                  />
                  <span>€</span>
                </div>
              ) : (
                <div>{currentParameters.minimumContribution}€</div>
              )}
              {selectedFund.allowManualEdit && (
                <button
                  onClick={() => {
                    setManualMinimumContribution(null);
                    if (onParametersChange) {
                      onParametersChange({
                        contributionRate: manualContributionRate ?? currentParameters.contributionRate,
                        minimumContribution: currentParameters.minimumContribution,
                        fixedAnnualContributions: manualFixedAnnualContributions ?? currentParameters.fixedAnnualContributions
                      });
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-[150px_120px_auto] gap-2 items-center">
              <label className="text-gray-600">Contributi annuali fissi:</label>
              {selectedFund.allowManualEdit ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={manualFixedAnnualContributions ?? currentParameters.fixedAnnualContributions}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setManualFixedAnnualContributions(value);
                      if (onParametersChange) {
                        onParametersChange({
                          contributionRate: manualContributionRate ?? currentParameters.contributionRate,
                          minimumContribution: manualMinimumContribution ?? currentParameters.minimumContribution,
                          fixedAnnualContributions: value
                        });
                      }
                    }}
                    className="w-20 p-1 border rounded"
                    min="0"
                    step="0.01"
                  />
                  <span>€</span>
                </div>
              ) : (
                <div>{currentParameters.fixedAnnualContributions}€</div>
              )}
              {selectedFund.allowManualEdit && (
                <button
                  onClick={() => {
                    setManualFixedAnnualContributions(null);
                    if (onParametersChange) {
                      onParametersChange({
                        contributionRate: manualContributionRate ?? currentParameters.contributionRate,
                        minimumContribution: manualMinimumContribution ?? currentParameters.minimumContribution,
                        fixedAnnualContributions: currentParameters.fixedAnnualContributions
                      });
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
