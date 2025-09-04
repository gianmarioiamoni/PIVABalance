import { Invoice } from "@/models/Invoice";
import { IInvoice } from "@/types";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterInvoicesByYear,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterUnpaidInvoices,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sortInvoicesByDate,
  calculateTotalRevenue,
} from "./invoiceCalculations";

/**
 * Pure functions for invoice database queries
 * Replaces static methods with functional approach
 */

/**
 * Find invoices by user and fiscal year
 */
export const findInvoicesByUserAndYear = async (
  userId: string,
  year: number
): Promise<IInvoice[]> => {
  const invoices = await Invoice.find({ userId, fiscalYear: year })
    .sort({ issueDate: 1 })
    .lean();
  return invoices;
};

/**
 * Find unpaid invoices for a user
 */
export const findUnpaidInvoicesByUser = async (
  userId: string
): Promise<IInvoice[]> => {
  const invoices = await Invoice.find({
    userId,
    paymentDate: { $exists: false },
  })
    .sort({ issueDate: 1 })
    .lean();
  return invoices;
};

/**
 * Calculate yearly revenue for a user
 */
export const calculateYearlyRevenueForUser = async (
  userId: string,
  year: number
): Promise<number> => {
  const invoices = await findInvoicesByUserAndYear(userId, year);
  return calculateTotalRevenue(invoices);
};

/**
 * Find all invoices for a user
 */
export const findInvoicesByUser = async (
  userId: string
): Promise<IInvoice[]> => {
  const invoices = await Invoice.find({ userId })
    .sort({ issueDate: -1 })
    .lean();
  return invoices;
};

/**
 * Find overdue invoices for a user
 */
export const findOverdueInvoicesByUser = async (
  userId: string
): Promise<IInvoice[]> => {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const invoices = await Invoice.find({
    userId,
    paymentDate: { $exists: false },
    issueDate: { $lt: thirtyDaysAgo },
  })
    .sort({ issueDate: 1 })
    .lean();

  return invoices;
};

/**
 * Get invoices by year for API endpoint
 */
export const getInvoicesByYear = async (
  userId: string,
  year: number
): Promise<IInvoice[]> => {
  return await findInvoicesByUserAndYear(userId, year);
};

/**
 * Get invoice by ID for API endpoint
 */
export const getInvoiceById = async (
  invoiceId: string,
  userId: string
): Promise<IInvoice | null> => {
  const invoice = await Invoice.findOne({ _id: invoiceId, userId }).lean();
  return invoice;
};

/**
 * Create new invoice for API endpoint
 */
export const createInvoice = async (
  userId: string,
  invoiceData: Omit<IInvoice, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<IInvoice> => {
  const invoice = new Invoice({
    ...invoiceData,
    userId,
  });

  const savedInvoice = await invoice.save();
  return savedInvoice.toObject();
};

/**
 * Update invoice for API endpoint
 */
export const updateInvoice = async (
  invoiceId: string,
  userId: string,
  updateData: Partial<
    Omit<IInvoice, "id" | "userId" | "createdAt" | "updatedAt">
  >
): Promise<IInvoice | null> => {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: invoiceId, userId },
    updateData,
    { new: true }
  ).lean();

  return invoice;
};

/**
 * Delete invoice for API endpoint
 */
export const deleteInvoice = async (
  invoiceId: string,
  userId: string
): Promise<boolean> => {
  const result = await Invoice.deleteOne({ _id: invoiceId, userId });
  return result.deletedCount > 0;
};
