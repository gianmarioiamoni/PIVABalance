import React, { useState, useEffect, useMemo } from 'react';
import { useTaxSettings } from '@/hooks/useTaxSettings';
import { useInvoices } from '@/hooks/invoices/useInvoices';
import { useContributions } from '@/hooks/useContributions';
import { contributionsService } from '@/services/contributionsService';
import { NumericFormat } from 'react-number-format';

export default function TaxAndContributions() {
  const { state: taxState } = useTaxSettings();
  const isForfettario = taxState.settings?.taxRegime === 'forfettario';
  const currentYear = new Date().getFullYear();

  const { invoices } = useInvoices(currentYear, taxState.settings?.taxRegime);
  const { contributions, saveContributions, loadContributions } = useContributions(currentYear);
  const [calculatedTaxableIncome, setCalculatedTaxableIncome] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('0');
  const [localPreviousYearContributions, setLocalPreviousYearContributions] = useState('0');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize values when contributions are loaded
  useEffect(() => {
    if (contributions) {
      setLocalPreviousYearContributions(contributions.previousYearContributions.toString());
      setInputValue(contributions.previousYearContributions.toString());
    }
  }, [contributions]);

  const handleInputChange = (values: { floatValue: number | undefined }) => {
    const value = values.floatValue?.toString() ?? '0';
    setInputValue(value);
  };

  const handleUpdateContributions = async () => {
    try {
      setIsLoading(true);
      setSaveError(null);
      const contributionsValue = parseFloat(inputValue) || 0;
      
      if (contributions?._id) {
        await contributionsService.updateContributions(currentYear, {
          previousYearContributions: contributionsValue
        });
      } else {
        await saveContributions({
          year: currentYear,
          previousYearContributions: contributionsValue
        });
      }
      
      // Update the local state
      setLocalPreviousYearContributions(inputValue);
      
      // Reload to ensure we have the latest data
      await loadContributions();
      setSaveError(null);
    } catch (error) {
      console.error('Error saving contributions:', error);
      setSaveError('Errore nel salvataggio dei contributi');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcola l'imponibile totale dalle fatture incassate nell'anno
  const totalIncome = useMemo(() => {
    return invoices.reduce((sum, invoice) => {
      if (invoice.paymentDate) {
        const paymentYear = new Date(invoice.paymentDate).getFullYear();
        if (paymentYear === currentYear) {
          return sum + invoice.amount;
        }
      }
      return sum;
    }, 0);
  }, [invoices, currentYear]);

  // Calculate taxable income whenever relevant values change
  useEffect(() => {
    if (isForfettario) {
      const taxableIncome = (totalIncome * (taxState.settings?.profitabilityRate ?? 0)) / 100;
      const previousYearContributions = parseFloat(localPreviousYearContributions) || 0;
      const finalTaxableIncome = Math.max(0, taxableIncome - previousYearContributions);
      setCalculatedTaxableIncome(Math.round(finalTaxableIncome));
    } else {
      setCalculatedTaxableIncome(Math.round(totalIncome));
    }
  }, [totalIncome, isForfettario, taxState.settings?.profitabilityRate, localPreviousYearContributions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(value).replace(/€\s*/g, '') + ' €'; // Rimuove il simbolo dell'euro all'inizio e lo aggiunge alla fine
  };

  // Calcola l'IVA (solo per regime ordinario)
  const totalVAT = !isForfettario
    ? invoices.reduce((sum, invoice) => sum + (invoice.amount * (invoice.vat?.rate || 0) / 100), 0)
    : 0;

  // Calcola l'IRPEF
  const irpefRate = taxState.settings?.irpefRate || 0;
  const irpefAmount = calculatedTaxableIncome !== null ? calculatedTaxableIncome * (irpefRate / 100) : 0;

  // Calcola i contributi previdenziali
  const pensionContributionRate = taxState.settings?.manualContributionRate || 0;
  const pensionContributions = totalIncome * (pensionContributionRate / 100);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl mb-6">
      <div className="px-4 py-6 sm:p-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {isForfettario && (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <div className="space-y-2">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Contributi anno precedente
                  </h2>
                  <div className="mt-2 flex items-start gap-2">
                    <NumericFormat
                      value={inputValue}
                      onValueChange={handleInputChange}
                      thousandSeparator="."
                      decimalSeparator=","
                      suffix=" €"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    />
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed "
                      onClick={handleUpdateContributions}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Aggiornamento...
                        </>
                      ) : 'Aggiorna'}
                    </button>
                  </div>
                  {saveError && (
                    <p className="mt-2 text-sm text-red-600">{saveError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Section title="Imponibile">
        <div className="space-y-4">
          <div>
            <span className="block text-sm font-medium text-gray-700">
              Totale incassi {currentYear}
            </span>
            <span className="mt-1 block text-sm text-gray-900">
              € {formatCurrency(totalIncome)}
            </span>
          </div>

          {isForfettario && (
            <>
              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Coefficiente di redditività
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {taxState.settings?.profitabilityRate}%
                </span>
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Reddito lordo
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  € {formatCurrency((totalIncome * (taxState.settings?.profitabilityRate ?? 0)) / 100)}
                </span>
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Contributi anno precedente
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  € {formatCurrency(parseFloat(localPreviousYearContributions) || 0)}
                </span>
              </div>
            </>
          )}

          <div>
            <span className="block text-sm font-medium text-gray-700">
              Imponibile {currentYear}
            </span>
            <span className="mt-1 block text-sm text-gray-900">
              € {formatCurrency(calculatedTaxableIncome ?? 0)}
            </span>
          </div>
        </div>
      </Section>

      {!isForfettario && (
        <Section title="IVA">
          <div>
            <span className="block text-sm font-medium text-gray-700">
              Totale IVA
            </span>
            <span className="mt-1 block text-sm text-gray-900">
              € {formatCurrency(totalVAT)}
            </span>
          </div>
        </Section>
      )}

      <Section title="IRPEF">
        <div>
          <span className="block text-sm font-medium text-gray-700">
            Totale IRPEF ({irpefRate}%)
          </span>
          <span className="mt-1 block text-sm text-gray-900">
            € {formatCurrency(irpefAmount)}
          </span>
        </div>
      </Section>

      <Section title="Contributi Previdenziali">
        <div>
          <span className="block text-sm font-medium text-gray-700">
            Totale Contributi ({pensionContributionRate}%)
          </span>
          <span className="mt-1 block text-sm text-gray-900">
            € {formatCurrency(pensionContributions)}
          </span>
        </div>
      </Section>
    </div>
  );
}
