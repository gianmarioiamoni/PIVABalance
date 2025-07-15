import { IInvoice } from "@/types";

/**
 * Pure functions for invoice calculations
 * Follows functional programming principles
 */

/**
 * Calculate VAT amount for an invoice
 */
export const calculateVatAmount = (invoice: IInvoice): number => {
  if (!invoice.vat) return 0;
  return (invoice.amount * invoice.vat.vatRate) / 100;
};

/**
 * Calculate total amount including VAT
 */
export const calculateTotalAmount = (invoice: IInvoice): number => {
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
  invoice: IInvoice
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
export const calculateTotalRevenue = (invoices: IInvoice[]): number => {
  return invoices.reduce((total, invoice) => total + invoice.amount, 0);
};

/**
 * Filter invoices by fiscal year
 */
export const filterInvoicesByYear = (
  invoices: IInvoice[],
  year: number
): IInvoice[] => {
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
