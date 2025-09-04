import mongoose, { Schema, model, models } from "mongoose";
import { IProfessionalFund, ProfessionalFundParameter } from "@/types";

/**
 * Professional Fund Parameters Schema
 * Sub-schema for fund contribution parameters by year
 */
const professionalFundParametersSchema = new Schema(
  {
    contributionRate: {
      type: Number,
      required: [true, "Contribution rate is required"],
      min: [0, "Contribution rate cannot be negative"],
      max: [100, "Contribution rate cannot exceed 100%"],
      validate: {
        validator: function (rate: number) {
          // Check for max 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(rate.toString());
        },
        message: "Contribution rate must have at most 2 decimal places",
      },
    },
    minimumContribution: {
      type: Number,
      required: [true, "Minimum contribution is required"],
      min: [0, "Minimum contribution cannot be negative"],
      max: [999999.99, "Minimum contribution cannot exceed 999,999.99"],
      validate: {
        validator: function (amount: number) {
          // Check for max 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(amount.toString());
        },
        message: "Minimum contribution must have at most 2 decimal places",
      },
    },
    fixedAnnualContributions: {
      type: Number,
      required: [true, "Fixed annual contributions is required"],
      default: 0,
      min: [0, "Fixed annual contributions cannot be negative"],
      max: [999999.99, "Fixed annual contributions cannot exceed 999,999.99"],
      validate: {
        validator: function (amount: number) {
          // Check for max 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(amount.toString());
        },
        message:
          "Fixed annual contributions must have at most 2 decimal places",
      },
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [2000, "Year cannot be before 2000"],
      max: [2100, "Year cannot be after 2100"],
      validate: {
        validator: function (year: number) {
          return Number.isInteger(year);
        },
        message: "Year must be an integer",
      },
    },
  },
  { _id: false }
);

/**
 * Professional Fund Schema
 * Follows Single Responsibility Principle - handles only professional fund data persistence
 */
const professionalFundSchema = new Schema<IProfessionalFund>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
      validate: {
        validator: function (name: string) {
          // Allow letters, numbers, spaces, common punctuation
          return /^[a-zA-ZÀ-ÿ0-9\s.,;:()\-_'"!?&+/\\]+$/.test(name);
        },
        message: "Name contains invalid characters",
      },
    },
    code: {
      type: String,
      required: [true, "Code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [2, "Code must be at least 2 characters long"],
      maxlength: [20, "Code cannot exceed 20 characters"],
      validate: {
        validator: function (code: string) {
          // Allow only uppercase letters and numbers
          return /^[A-Z0-9_-]+$/.test(code);
        },
        message:
          "Code can only contain uppercase letters, numbers, underscores, and hyphens",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      validate: {
        validator: function (description: string) {
          if (!description) return true;
          // Allow letters, numbers, spaces, common punctuation
          return /^[a-zA-ZÀ-ÿ0-9\s.,;:()\-_'"!?€$%&+/\\]+$/.test(description);
        },
        message: "Description contains invalid characters",
      },
    },
    parameters: {
      type: [professionalFundParametersSchema],
      required: [true, "Parameters are required"],
      validate: {
        validator: function (parameters: ProfessionalFundParameter[]) {
          return parameters && parameters.length > 0;
        },
        message: "At least one parameter set is required",
      },
    },
    allowManualEdit: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for performance optimization
 * Note: code already has unique index from field definition
 */
// professionalFundSchema.index({ code: 1 }, { unique: true }); // Removed: duplicate of unique: true
professionalFundSchema.index({ isActive: 1 });
professionalFundSchema.index({ "parameters.year": 1 });

/**
 * Pre-save validation middleware
 * Ensures data consistency and business rules
 */
professionalFundSchema.pre("save", function (next) {
  // Ensure parameters array is never empty
  if (!this.parameters || this.parameters.length === 0) {
    return next(
      new Error("Professional fund must have at least one set of parameters")
    );
  }

  // Ensure no duplicate years in parameters
  const years = this.parameters.map((p) => p.year);
  const uniqueYears = new Set(years);
  if (years.length !== uniqueYears.size) {
    return next(new Error("Parameters cannot have duplicate years"));
  }

  next();
});

/**
 * Export the ProfessionalFund model
 * Simple data model without business logic - follows functional principles
 */
export const ProfessionalFund =
  (models.ProfessionalFund as mongoose.Model<IProfessionalFund>) ||
  model<IProfessionalFund>("ProfessionalFund", professionalFundSchema);
