import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const invoiceSchema = z.object({
  number: z.string().min(1, 'Invoice number is required'),
  issueDate: z.string().or(z.date()),
  title: z.string().min(1, 'Title is required'),
  clientName: z.string().min(1, 'Client name is required'),
  amount: z.number().positive('Amount must be positive'),
  paymentDate: z.string().or(z.date()).optional().nullable(),
  fiscalYear: z.number().int().min(2025, 'Fiscal year must be 2025 or later')
});

const invoiceUpdateSchema = z.object({
  paymentDate: z.string().or(z.date()).optional().nullable()
});

export const validateInvoice = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = invoiceSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      res.status(400).json({ message: 'Invalid invoice data' });
    }
  }
};

export const validateInvoiceUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = invoiceUpdateSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    } else {
      res.status(400).json({ message: 'Invalid update data' });
    }
  }
};
