import React, { useState, useEffect, useRef } from 'react';
import { useTaxSettings } from '../hooks/useTaxSettings';
import { useInvoices } from '../hooks/invoices/useInvoices';
import { taxCalculationService } from '../services/taxCalculationService';
import { formatCurrency } from '../utils/formatters';

export const TaxContributions: React.FC = () => {
    const { state: { settings } } = useTaxSettings();
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [previousYearContributions, setPreviousYearContributions] = useState<number>(0);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [taxableIncome, setTaxableIncome] = useState<number>(0);
    const [irpefAmount, setIrpefAmount] = useState<number>(0);
    const [contributionsAmount, setContributionsAmount] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { invoices } = useInvoices(selectedYear, settings?.taxRegime);

    // Calcola tutti i valori
    const calculateAll = (contributionsValue: number) => {
        console.log('Calculating with contributions:', contributionsValue);
        
        const income = invoices
            .filter(inv => inv.issueDate && new Date(inv.issueDate).getFullYear() === selectedYear)
            .reduce((sum, inv) => sum + inv.amount, 0);
        console.log('Total income:', income);
        
        const taxable = (income * settings.profitabilityRate / 100) - contributionsValue;
        console.log('Taxable income:', taxable);
        
        const irpef = taxable * (settings.substituteRate ?? 0) / 100;
        const contributions = taxCalculationService.calculateContributions(
            taxable,
            settings.manualContributionRate ?? 0,
            settings.manualFixedAnnualContributions ?? 0
        );

        setTotalIncome(income);
        setTaxableIncome(taxable);
        setIrpefAmount(irpef);
        setContributionsAmount(contributions);
    };

    // Carica i valori iniziali
    useEffect(() => {
        const loadInitialValues = async () => {
            try {
                const amount = await taxCalculationService.getPreviousYearContribution(selectedYear - 1);
                console.log('Initial load - Previous year contributions:', amount);
                setPreviousYearContributions(amount);
                if (inputRef.current) {
                    inputRef.current.value = amount.toString();
                }
                calculateAll(amount);
            } catch (error) {
                console.error('Error loading initial values:', error);
            }
        };
        loadInitialValues();
    }, [selectedYear, invoices, settings]);

    const handleUpdateContributions = async () => {
        if (!inputRef.current) return;
        
        const value = inputRef.current.value.replace(/\D/g, '') || '0';
        const numericValue = parseInt(value);
        console.log('Updating contributions to:', numericValue);
        
        try {
            await taxCalculationService.savePreviousYearContribution(selectedYear - 1, numericValue);
            setPreviousYearContributions(numericValue);
            calculateAll(numericValue);
            console.log('New taxable income should be:', (totalIncome * settings.profitabilityRate / 100) - numericValue);
        } catch (error) {
            console.error('Error updating contributions:', error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUpdateContributions();
        }
    };

    const mapServiceInvoiceToDomain = (invoice: import('../services/invoiceService').Invoice): import('../types/Invoice').Invoice => ({
        id: invoice._id,
        date: invoice.issueDate,
        amount: invoice.amount,
        description: invoice.title,
        year: invoice.fiscalYear
    });

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            {children}
        </div>
    );

    const DataRow = ({ label, value, important = false }: { label: string; value: string | number; important?: boolean }) => (
        <div className="flex justify-between items-center mb-4">
            <p className={`text-sm ${important ? 'font-bold' : ''}`}>{label}</p>
            <p className={`text-sm ${important ? 'font-bold' : ''}`}>{typeof value === 'number' ? formatCurrency(value) : value}</p>
        </div>
    );

    if (settings.taxRegime !== 'forfettario') {
        return (
            <div className="p-4">
                <h2 className="text-lg font-bold mb-4">Questa sezione è disponibile solo per il regime forfettario</h2>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Tasse e Contributi {selectedYear}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Section title="1. Calcolo Imponibile">
                        <DataRow label="Totale Incassato" value={totalIncome} />
                        <DataRow label="Coefficiente di Redditività" value={`${settings.profitabilityRate}%`} />
                        <div className="mb-4">
                            <label htmlFor="previousYearContributions" className="block text-sm font-medium text-gray-700 mb-1">
                                Totale contributi anno precedente
                            </label>
                            <div className="flex space-x-2">
                                <div className="relative flex-grow">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                                    <input
                                        type="text"
                                        id="previousYearContributions"
                                        ref={inputRef}
                                        defaultValue={previousYearContributions}
                                        onBlur={handleUpdateContributions}
                                        onKeyDown={handleKeyDown}
                                        className="w-full p-2 pl-8 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0"
                                    />
                                </div>
                                <button
                                    onClick={handleUpdateContributions}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Aggiorna
                                </button>
                            </div>
                        </div>
                        <hr className="my-4" />
                        <DataRow label="Imponibile" value={taxableIncome} important />
                    </Section>

                    <Section title="2. Calcolo IRPEF">
                        <DataRow label="Aliquota" value={`${settings.substituteRate}%`} />
                        <DataRow label="Totale IRPEF" value={irpefAmount} important />
                    </Section>

                    <Section title="3. Calcolo Contributi">
                        <DataRow label="Aliquota Contributiva" value={`${settings.manualContributionRate}%`} />
                        {settings.manualFixedAnnualContributions !== undefined && settings.manualFixedAnnualContributions > 0 && (
                            <DataRow label="Contributo Fisso Annuale" value={settings.manualFixedAnnualContributions} />
                        )}
                        <DataRow label="Totale Contributi" value={contributionsAmount} important />
                    </Section>
                </div>

                <div className="bg-blue-500 text-white p-4 rounded">
                    <h2 className="text-lg font-bold mb-4">Riepilogo {selectedYear}</h2>
                    <hr className="my-4 border-white" />
                    <DataRow label="Imponibile" value={taxableIncome} />
                    <DataRow label="IRPEF" value={irpefAmount} />
                    <DataRow label="Contributi" value={contributionsAmount} />
                    <hr className="my-4 border-white" />
                    <DataRow label="Totale Tasse e Contributi" value={irpefAmount + contributionsAmount} important />
                </div>
            </div>
        </div>
    );
};
