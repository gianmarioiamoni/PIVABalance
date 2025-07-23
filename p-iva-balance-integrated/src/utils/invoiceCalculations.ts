import { IInvoice } from "@/types";

// Generic invoice interface for calculations (works with both IInvoice and PlainInvoice)
type InvoiceForCalculation = {
  amount: number;
  issueDate: Date;
  vat?: {
    vatType: string;
    vatRate: number;
  };
  paymentDate?: Date;
  fiscalYear: number;
};

/**
 * Pure functions for invoice calculations
 * Follows functional programming principles
 */

/**
 * Calculate VAT amount for an invoice
 */
export const calculateVatAmount = (invoice: InvoiceForCalculation): number => {
  if (!invoice.vat) return 0;
  return (invoice.amount * invoice.vat.vatRate) / 100;
};

/**
 * Calculate total amount including VAT
 */
export const calculateTotalAmount = (
  invoice: InvoiceForCalculation
): number => {
  return invoice.amount + calculateVatAmount(invoice);
};

/**
 * Check if invoice is paid
 */
export const isInvoicePaid = (invoice: IInvoice): boolean => {
  return !!invoice.paymentDate;
};

/**
 * Get payment status of an invoice
 */
export const getPaymentStatus = (
  invoice: InvoiceForCalculation
): "paid" | "pending" | "overdue" => {
  if (invoice.paymentDate) return "paid";

  const now = new Date();
  const dueDate = new Date(invoice.issueDate);
  dueDate.setDate(dueDate.getDate() + 30); // Assume 30 days payment terms

  return now > dueDate ? "overdue" : "pending";
};

/**
 * Calculate total revenue from a list of invoices
 */
export const calculateTotalRevenue = (
  invoices: InvoiceForCalculation[]
): number => {
  return invoices.reduce((total, invoice) => total + invoice.amount, 0);
};

/**
 * Filter invoices by fiscal year
 */
export const filterInvoicesByYear = (
  invoices: InvoiceForCalculation[],
  year: number
): InvoiceForCalculation[] => {
  return invoices.filter((invoice) => invoice.fiscalYear === year);
};

/**
 * Filter unpaid invoices
 */
export const filterUnpaidInvoices = (invoices: IInvoice[]): IInvoice[] => {
  return invoices.filter((invoice) => !isInvoicePaid(invoice));
};

/**
 * Sort invoices by issue date
 */
export const sortInvoicesByDate = (
  invoices: IInvoice[],
  ascending = true
): IInvoice[] => {
  return [...invoices].sort((a, b) => {
    const dateA = new Date(a.issueDate).getTime();
    const dateB = new Date(b.issueDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

/**
 * Filter invoices by month and year
 */
export const filterInvoicesByMonth = (
  invoices: InvoiceForCalculation[],
  month: number,
  year: number
): InvoiceForCalculation[] => {
  return invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.issueDate);
    return (
      invoiceDate.getMonth() === month - 1 && // JavaScript months are 0-indexed
      invoiceDate.getFullYear() === year
    );
  });
};

/**
 * Calculate monthly statistics from invoices
 */
export const calculateMonthlyStats = (
  invoices: InvoiceForCalculation[],
  month: number,
  year: number
): {
  count: number;
  revenue: number;
  formattedRevenue: string;
} => {
  const monthlyInvoices = filterInvoicesByMonth(invoices, month, year);
  const revenue = calculateTotalRevenue(monthlyInvoices);

  return {
    count: monthlyInvoices.length,
    revenue,
    formattedRevenue: `€${revenue.toLocaleString("it-IT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
  };
};

/**
 * Get current month statistics from invoices
 */
export const getCurrentMonthStats = (
  invoices: InvoiceForCalculation[]
): {
  count: number;
  revenue: number;
  formattedRevenue: string;
} => {
  const now = new Date();
  return calculateMonthlyStats(invoices, now.getMonth() + 1, now.getFullYear());
};
