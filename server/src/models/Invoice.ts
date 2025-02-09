import mongoose from 'mongoose';

const vatSchema = new mongoose.Schema({
  vatType: {
    type: String,
    enum: ['standard', 'reduced10', 'reduced5', 'reduced4', 'custom'],
  },
  vatRate: {
    type: Number,
    min: 0,
    max: 100,
  }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  number: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: false
  },
  fiscalYear: {
    type: Number,
    required: true
  },
  vat: {
    type: vatSchema,
  }
}, {
  timestamps: true
});

// Add compound unique index for userId and number to ensure unique invoice numbers per user
invoiceSchema.index({ userId: 1, number: 1 }, { unique: true });

// Add index for faster queries by fiscal year
invoiceSchema.index({ userId: 1, fiscalYear: 1 });

export const Invoice = mongoose.model('Invoice', invoiceSchema);
