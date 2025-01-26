import React, { useState, useEffect } from 'react';
import { useTaxSettings } from '../hooks/useTaxSettings';
import { useInvoices } from '../hooks/invoices/useInvoices';
import { taxCalculationService } from '../services/taxCalculationService';
import { formatCurrency } from '../utils/formatters';
import { costService } from '@/services/costService';

export const TaxContributions: React.FC = () => {
    const { state: { settings } } = useTaxSettings();
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [taxableIncome, setTaxableIncome] = useState<number>(0);
    const [irpefAmount, setIrpefAmount] = useState<number>(0);
    const [contributionsAmount, setContributionsAmount] = useState<number>(0);
    const [totalCosts, setTotalCosts] = useState<number>(0);
    const { invoices } = useInvoices(selectedYear, settings?.taxRegime);

    useEffect(() => {
        const loadCostsAndCalculate = async () => {
            try {
                const costs = await costService.getCostsByYear(selectedYear);
                const totalCostsAmount = costs.reduce((sum, cost) => sum + cost.amount, 0);
                setTotalCosts(totalCostsAmount);
                
                const income = invoices
                    .filter(inv => inv.issueDate && new Date(inv.issueDate).getFullYear() === selectedYear)
                    .reduce((sum, inv) => sum + inv.amount, 0);
                
                const taxable = (income * settings.profitabilityRate / 100) - totalCostsAmount;
                
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
            } catch (error) {
                console.error('Error loading costs and calculating:', error);
            }
        };

        loadCostsAndCalculate();
    }, [selectedYear, invoices, settings]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Fatturato {selectedYear}</h3>
                    <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Costi totali {selectedYear}</h3>
                    <p className="text-2xl font-bold">{formatCurrency(totalCosts)}</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Imponibile</h3>
                    <p className="text-2xl font-bold">{formatCurrency(taxableIncome)}</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">IRPEF (sostitutiva)</h3>
                    <p className="text-2xl font-bold">{formatCurrency(irpefAmount)}</p>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Contributi</h3>
                    <p className="text-2xl font-bold">{formatCurrency(contributionsAmount)}</p>
                </div>
            </div>
        </div>
    );
};
