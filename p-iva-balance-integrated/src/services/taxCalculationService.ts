import { axiosInstance } from '../config/axios';
import { Invoice } from '../types/Invoice';

export interface TaxCalculationResult {
    totalIncome: number;
    taxableIncome: number;
    irpefAmount: number;
    contributionsAmount: number;
    totalTaxes: number;
}

export const taxCalculationService = {
    async getPreviousYearContribution(year: number): Promise<number> {
        try {
            const response = await axiosInstance.get(`/api/contributions/previous-year/${year}`);
            return response.data.amount || 0;
        } catch (error) {
            console.error('Error fetching previous year contribution:', error);
            return 0;
        }
    },

    async savePreviousYearContribution(year: number, amount: number): Promise<void> {
        try {
            await axiosInstance.post('/api/contributions/previous-year', { year, amount });
        } catch (error) {
            console.error('Error saving previous year contribution:', error);
            throw error;
        }
    },

    calculateTaxableIncome(
        invoices: Invoice[],
        profitCoefficient: number,
        previousYearContributions: number,
        selectedYear: number
    ): number {
        const totalIncome = invoices
            .filter(inv => {
                const paymentDate = inv.date ? new Date(inv.date) : null;
                return paymentDate && paymentDate.getFullYear() === selectedYear;
            })
            .reduce((sum, inv) => sum + inv.amount, 0);

        return (totalIncome * profitCoefficient / 100) - previousYearContributions;
    },

    calculateIrpef(taxableIncome: number, irpefRate: number): number {
        return taxableIncome * (irpefRate / 100);
    },

    calculateContributions(
        taxableIncome: number, 
        contributionRate: number,
        fixedAnnualFee: number = 0
    ): number {
        return (taxableIncome * (contributionRate / 100)) + fixedAnnualFee;
    }
};
