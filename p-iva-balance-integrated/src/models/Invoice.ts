import mongoose, { Schema, model, models } from "mongoose";
import { IInvoice, VatType, VatInfo } from "@/types";

/**
 * VAT Info Schema
 * Handles VAT-related information for invoices
 */
const vatSchema = new Schema<VatInfo>(
  {
    vatType: {
      type: String,
      enum: {
        values: [
          "standard",
          "reduced10",
          "reduced5",
          "reduced4",
          "custom",
        ] as VatType[],
        message: "Invalid VAT type",
      },
      required: [true, "VAT type is required"],
    },
    vatRate: {
      type: Number,
      required: [true, "VAT rate is required"],
      min: [0, "VAT rate cannot be negative"],
      max: [100, "VAT rate cannot exceed 100"],
      validate: {
        validator: function (this: VatInfo, rate: number) {
          // Validate predefined rates
          switch (this.vatType) {
            case "standard":
              return rate === 22;
            case "reduced10":
              return rate === 10;
            case "reduced5":
              return rate === 5;
            case "reduced4":
              return rate === 4;
            case "custom":
              return rate >= 0 && rate <= 100;
            default:
              return false;
          }
        },
        message: "VAT rate does not match the selected VAT type",
      },
    },
  },
  { _id: false }
);

/**
 * Invoice Schema
 * Handles invoice data and validation
 * Follows Single Responsibility Principle - only data persistence
 */
const invoiceSchema = new Schema<IInvoice>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
    },
    number: {
      type: String,
      required: [true, "Invoice number is required"],
      trim: true,
      maxlength: [50, "Invoice number cannot exceed 50 characters"],
      validate: {
        validator: function (number: string) {
          // Allow alphanumeric characters, hyphens, and slashes
          return /^[A-Za-z0-9\-\/]+$/.test(number);
        },
        message:
          "Invoice number can only contain letters, numbers, hyphens, and slashes",
      },
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
      validate: {
        validator: function (date: Date) {
          const now = new Date();
          const minDate = new Date("2000-01-01");
          return date >= minDate && date <= now;
        },
        message: "Issue date must be between 2000-01-01 and today",
      },
    },
    title: {
      type: String,
      required: [true, "Invoice title is required"],
      trim: true,
      minlength: [1, "Invoice title cannot be empty"],
      maxlength: [500, "Invoice title cannot exceed 500 characters"],
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: [1, "Client name cannot be empty"],
      maxlength: [200, "Client name cannot exceed 200 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
      max: [999999999.99, "Amount is too large"],
      validate: {
        validator: function (amount: number) {
          // Ensure amount has at most 2 decimal places
          return (
            Number.isFinite(amount) &&
            /^\d+(\.\d{1,2})?$/.test(amount.toFixed(2))
          );
        },
        message: "Amount must have at most 2 decimal places",
      },
    },
    paymentDate: {
      type: Date,
      validate: {
        validator: function (this: IInvoice, date: Date | undefined) {
          if (!date) return true;
          return date >= this.issueDate;
        },
        message: "Payment date cannot be before issue date",
      },
    },
    fiscalYear: {
      type: Number,
      required: [true, "Fiscal year is required"],
      min: [2000, "Fiscal year must be 2000 or later"],
      max: [2100, "Fiscal year must be 2100 or earlier"],
      validate: {
        validator: function (this: IInvoice, year: number) {
          const issueYear = this.issueDate
            ? this.issueDate.getFullYear()
            : new Date().getFullYear();
          // Allow current year and next year for fiscal year flexibility
          return year >= issueYear - 1 && year <= issueYear + 1;
        },
        message: "Fiscal year must be within one year of the issue date",
      },
    },
    vat: {
      type: vatSchema,
      validate: {
        validator: function (vat: VatInfo | undefined) {
          // VAT is optional, but if provided must be valid
          return !vat || (vat.vatType && typeof vat.vatRate === "number");
        },
        message: "VAT information must be complete if provided",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Compound index for unique invoice numbers per user
 */
invoiceSchema.index({ userId: 1, number: 1 }, { unique: true });

/**
 * Indexes for performance
 */
invoiceSchema.index({ userId: 1, fiscalYear: 1 });
invoiceSchema.index({ userId: 1, issueDate: 1 });
invoiceSchema.index({ userId: 1, paymentDate: 1 });

/**
 * Export the Invoice model
 * Simple data model without business logic - follows functional principles
 */
export const Invoice =
  (models.Invoice as mongoose.Model<IInvoice>) ||
  model<IInvoice>("Invoice", invoiceSchema);
