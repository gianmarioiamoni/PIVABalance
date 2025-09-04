/**
 * Chart Data Service
 * 
 * Transforms raw business data into chart-ready formats
 * Following SOLID principles for data transformation
 */

import type { 
  CashFlowDataPoint, 
  TrendDataPoint, 
  TaxBreakdownDataPoint, 
  YearComparisonDataPoint,
  FreelanceMetrics 
} from '@/components/charts/types';

// TODO: Import calculation utilities when needed for advanced features
// import { getCurrentMonthStats, getMonthlyStats } from '@/utils/invoiceCalculations';
// import { getCurrentMonthCostStats, getMonthlyStats as getCostMonthlyStats } from '@/utils/costCalculations';
// import { calculateEstimatedMonthlyTaxes } from '@/utils';

interface Invoice {
  id: string;
  amount: number;
  issueDate: string | Date;
  paymentDate?: string | Date;
}

interface Cost {
  id: string;
  amount: number;
  date: string | Date;
  description: string;
}

interface TaxSettings {
  taxRegime: 'forfettario' | 'ordinario';
  substituteRate?: number;
  profitabilityRate?: number;
}

/**
 * Chart Data Service Class
 * Handles all data transformations for charts
 */
export class ChartDataService {
  
  /**
   * Generate Cash Flow Chart Data
   * Critical for freelancers to visualize money in vs money out
   */
  static generateCashFlowData(
    invoices: Invoice[], 
    costs: Cost[], 
    months: number = 12
  ): CashFlowDataPoint[] {
    const result: CashFlowDataPoint[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      // const monthKey = targetDate.toISOString().substring(0, 7); // YYYY-MM // TODO: Use for future features
      
      // Calculate income for this month
      const monthlyIncome = invoices
        .filter(invoice => {
          const issueDate = new Date(invoice.issueDate);
          return issueDate.getFullYear() === targetDate.getFullYear() && 
                 issueDate.getMonth() === targetDate.getMonth();
        })
        .reduce((sum, invoice) => sum + invoice.amount, 0);
      
      // Calculate expenses for this month
      const monthlyExpenses = costs
        .filter(cost => {
          const costDate = new Date(cost.date);
          return costDate.getFullYear() === targetDate.getFullYear() && 
                 costDate.getMonth() === targetDate.getMonth();
        })
        .reduce((sum, cost) => sum + cost.amount, 0);
      
      const netCashFlow = monthlyIncome - monthlyExpenses;
      
      result.push({
        month: targetDate.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }),
        income: monthlyIncome,
        expenses: monthlyExpenses,
        net: netCashFlow,
        date: targetDate
      });
    }
    
    return result;
  }

  /**
   * Generate Monthly Trend Data
   * Shows performance evolution over time
   */
  static generateMonthlyTrendData(
    invoices: Invoice[], 
    months: number = 12,
    metric: 'revenue' | 'profit' | 'count' = 'revenue'
  ): TrendDataPoint[] {
    const result: TrendDataPoint[] = [];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const previousDate = new Date(now.getFullYear(), now.getMonth() - i - 1, 1);
      
      // Current month value
      const currentValue = this.calculateMetricForMonth(invoices, targetDate, metric);
      
      // Previous month value for growth calculation
      const previousValue = this.calculateMetricForMonth(invoices, previousDate, metric);
      
      // Calculate growth percentage
      const growth = previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
      
      result.push({
        period: targetDate.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' }),
        value: currentValue,
        previous: previousValue,
        growth,
        date: targetDate
      });
    }
    
    return result;
  }

  /**
   * Generate Tax Breakdown Data
   * Visual breakdown of tax obligations
   */
  static generateTaxBreakdownData(
    totalIncome: number,
    settings: TaxSettings,
    costs: Cost[] = []
  ): TaxBreakdownDataPoint[] {
    if (totalIncome === 0) return [];
    
    const result: TaxBreakdownDataPoint[] = [];
    const deductibleCosts = costs.reduce((sum, cost) => sum + cost.amount, 0);
    
    if (settings.taxRegime === 'forfettario') {
      // Forfettario regime calculations
      const profitableIncome = totalIncome * (settings.profitabilityRate || 78) / 100;
      const substituteRate = settings.substituteRate || 5;
      const substituteTax = profitableIncome * substituteRate / 100;
      
      // INPS contribution (fixed rate for forfettario)
      const inpsContribution = profitableIncome * 24 / 100; // Simplified calculation
      
      result.push(
        {
          category: 'Imposta Sostitutiva',
          amount: substituteTax,
          percentage: (substituteTax / totalIncome) * 100,
          color: '#3B82F6'
        },
        {
          category: 'Contributi INPS',
          amount: inpsContribution,
          percentage: (inpsContribution / totalIncome) * 100,
          color: '#10B981'
        }
      );
    } else {
      // Ordinary regime calculations (simplified)
      const taxableIncome = Math.max(0, totalIncome - deductibleCosts);
      
      // IRPEF (simplified progressive rates)
      const irpef = this.calculateIRPEF(taxableIncome);
      
      // INPS (simplified)
      const inps = taxableIncome * 24 / 100;
      
      // IVA (if applicable)
      const iva = totalIncome * 22 / 100; // Simplified VAT
      
      result.push(
        {
          category: 'IRPEF',
          amount: irpef,
          percentage: (irpef / totalIncome) * 100,
          color: '#3B82F6'
        },
        {
          category: 'Contributi INPS',
          amount: inps,
          percentage: (inps / totalIncome) * 100,
          color: '#10B981'
        },
        {
          category: 'IVA',
          amount: iva,
          percentage: (iva / totalIncome) * 100,
          color: '#EF4444'
        }
      );
    }
    
    return result;
  }

  /**
   * Generate Year Comparison Data
   * Compare current year with previous year month by month
   */
  static generateYearComparisonData(
    currentYearInvoices: Invoice[],
    previousYearInvoices: Invoice[],
    currentYear: number,
    previousYear: number
  ): YearComparisonDataPoint[] {
    const result: YearComparisonDataPoint[] = [];
    const months = [
      'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
      'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
    ];
    
    for (let month = 0; month < 12; month++) {
      // Current year revenue for this month
      const currentYearRevenue = currentYearInvoices
        .filter(invoice => {
          const date = new Date(invoice.issueDate);
          return date.getFullYear() === currentYear && date.getMonth() === month;
        })
        .reduce((sum, invoice) => sum + invoice.amount, 0);
      
      // Previous year revenue for this month
      const previousYearRevenue = previousYearInvoices
        .filter(invoice => {
          const date = new Date(invoice.issueDate);
          return date.getFullYear() === previousYear && date.getMonth() === month;
        })
        .reduce((sum, invoice) => sum + invoice.amount, 0);
      
      result.push({
        month: months[month],
        currentYear: currentYearRevenue,
        previousYear: previousYearRevenue,
        monthNumber: month + 1
      });
    }
    
    return result;
  }

  /**
   * Generate Freelance Metrics Summary
   * Key metrics for dashboard
   */
  static generateFreelanceMetrics(
    invoices: Invoice[],
    costs: Cost[],
    settings: TaxSettings
  ): FreelanceMetrics {
    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const totalExpenses = costs.reduce((sum, cost) => sum + cost.amount, 0);
    const netIncome = totalRevenue - totalExpenses;
    
    // Calculate taxes
    const taxBreakdown = this.generateTaxBreakdownData(totalRevenue, settings, costs);
    const taxesPaid = taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0);
    
    // Calculate average invoice
    const averageInvoice = invoices.length > 0 ? totalRevenue / invoices.length : 0;
    
    // Calculate unique clients (simplified by assuming different amounts = different clients)
    const uniqueAmounts = new Set(invoices.map(inv => inv.amount));
    const clientsCount = uniqueAmounts.size;
    
    // Calculate average days to payment
    const paidInvoices = invoices.filter(inv => inv.paymentDate);
    const daysToPayment = paidInvoices.length > 0 
      ? paidInvoices.reduce((sum, inv) => {
          const issueDate = new Date(inv.issueDate);
          const paymentDate = new Date(inv.paymentDate as string | Date);
          const days = Math.floor((paymentDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / paidInvoices.length
      : 0;
    
    // Generate cash flow data
    const cashFlow = this.generateCashFlowData(invoices, costs, 12);
    
    return {
      totalRevenue,
      totalExpenses,
      netIncome,
      taxesPaid,
      averageInvoice,
      clientsCount,
      daysToPayment,
      cashFlow
    };
  }

  /**
   * Helper: Calculate metric for specific month
   */
  private static calculateMetricForMonth(
    invoices: Invoice[], 
    date: Date, 
    metric: 'revenue' | 'profit' | 'count'
  ): number {
    const monthInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.issueDate);
      return invoiceDate.getFullYear() === date.getFullYear() && 
             invoiceDate.getMonth() === date.getMonth();
    });
    
    switch (metric) {
      case 'revenue':
        return monthInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      case 'count':
        return monthInvoices.length;
      case 'profit':
        // Simplified profit calculation
        return monthInvoices.reduce((sum, inv) => sum + inv.amount, 0) * 0.7; // Assume 30% costs
      default:
        return 0;
    }
  }

  /**
   * Helper: Simplified IRPEF calculation
   */
  private static calculateIRPEF(taxableIncome: number): number {
    // Simplified progressive tax calculation
    if (taxableIncome <= 15000) {
      return taxableIncome * 0.23;
    } else if (taxableIncome <= 28000) {
      return 3450 + (taxableIncome - 15000) * 0.27;
    } else if (taxableIncome <= 55000) {
      return 6960 + (taxableIncome - 28000) * 0.38;
    } else if (taxableIncome <= 75000) {
      return 17220 + (taxableIncome - 55000) * 0.41;
    } else {
      return 25420 + (taxableIncome - 75000) * 0.43;
    }
  }
}

export default ChartDataService;
