// Centralized model exports
// Follows Dependency Inversion Principle

export { User } from "./User";
export { UserSettings } from "./UserSettings";
export { Invoice } from "./Invoice";

// Cost model - simplified for time efficiency
import mongoose, { Schema, model, models } from "mongoose";
import { ICost } from "@/types";

const costSchema = new Schema<ICost>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    deductible: {
      type: Boolean,
      required: [true, "Deductible flag is required"],
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

costSchema.index({ userId: 1, date: -1 });

export const Cost =
  (models.Cost as mongoose.Model<ICost>) || model<ICost>("Cost", costSchema);

// Professional Fund model - simplified
import { IProfessionalFund } from "@/types";

const professionalFundSchema = new Schema<IProfessionalFund>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Code is required"],
      unique: true,
      trim: true,
    },
    description: String,
    parameters: [
      {
        contributionRate: { type: Number, required: true, min: 0, max: 100 },
        minimumContribution: { type: Number, required: true, min: 0 },
        fixedAnnualContributions: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        year: { type: Number, required: true, min: 2000, max: 2100 },
      },
    ],
    allowManualEdit: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

professionalFundSchema.index({ code: 1 }, { unique: true });

export const ProfessionalFund =
  (models.ProfessionalFund as mongoose.Model<IProfessionalFund>) ||
  model<IProfessionalFund>("ProfessionalFund", professionalFundSchema);
