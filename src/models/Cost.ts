import mongoose, { Schema, model, models } from "mongoose";
import { ICost } from "@/types";

/**
 * Cost Schema for expense tracking
 * Follows Single Responsibility Principle - handles only cost data persistence
 */
const costSchema = new Schema<ICost>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
      validate: {
        validator: function (userId: string) {
          return mongoose.Types.ObjectId.isValid(userId);
        },
        message: "Invalid user ID format",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [3, "Description must be at least 3 characters long"],
      maxlength: [200, "Description cannot exceed 200 characters"],
      validate: {
        validator: function (description: string) {
          // Allow letters, numbers, spaces, common punctuation
          return /^[a-zA-ZÀ-ÿ0-9\s.,;:()\-_'"!?€$%&+/\\]+$/.test(description);
        },
        message: "Description contains invalid characters",
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: function (date: Date) {
          const minDate = new Date("2000-01-01");
          const maxDate = new Date();
          maxDate.setDate(maxDate.getDate() + 1); // Allow tomorrow
          return date >= minDate && date <= maxDate;
        },
        message: "Date must be between 2000-01-01 and today",
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
      max: [999999.99, "Amount cannot exceed 999,999.99"],
      validate: {
        validator: function (amount: number) {
          // Check for max 2 decimal places
          return (
            Number.isFinite(amount) &&
            /^\d+(\.\d{1,2})?$/.test(amount.toString())
          );
        },
        message: "Amount must have at most 2 decimal places",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for performance optimization
 */
costSchema.index({ userId: 1, date: -1 });
costSchema.index({ userId: 1, createdAt: -1 });

/**
 * Export the Cost model
 * Simple data model without business logic - follows functional principles
 */
export const Cost =
  (models.Cost as mongoose.Model<ICost>) || model<ICost>("Cost", costSchema);
