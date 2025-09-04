import mongoose, { Schema, model, models } from "mongoose";
import { IUserSettings, TaxRegime, PensionSystem, InpsRateType } from "@/types";

/**
 * User Settings Schema
 * Handles user-specific tax and pension configuration
 * Follows Single Responsibility Principle - handles only settings data persistence
 */
const userSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      ref: "User",
    },
    taxRegime: {
      type: String,
      enum: {
        values: ["forfettario", "ordinario"] as TaxRegime[],
        message: "Tax regime must be either forfettario or ordinario",
      },
      required: [true, "Tax regime is required"],
      default: "forfettario",
    },
    substituteRate: {
      type: Number,
      validate: {
        validator: function (this: IUserSettings, v: number | undefined) {
          if (this.taxRegime === "ordinario") return true;
          return v === undefined || [5, 25].includes(v);
        },
        message:
          "Substitute rate must be either 5 or 25 for forfettario regime",
      },
    },
    profitabilityRate: {
      type: Number,
      min: [0, "Profitability rate cannot be negative"],
      max: [100, "Profitability rate cannot exceed 100"],
      validate: {
        validator: function (this: IUserSettings, v: number | undefined) {
          if (this.taxRegime === "ordinario") return true;
          return v !== undefined && v >= 0 && v <= 100;
        },
        message: "Profitability rate is required for forfettario regime",
      },
    },
    pensionSystem: {
      type: String,
      enum: {
        values: ["INPS", "PROFESSIONAL_FUND"] as PensionSystem[],
        message: "Pension system must be either INPS or PROFESSIONAL_FUND",
      },
      required: [true, "Pension system is required"],
    },
    professionalFundId: {
      type: String,
      validate: {
        validator: function (this: IUserSettings, v: string | undefined) {
          if (this.pensionSystem === "PROFESSIONAL_FUND") {
            return typeof v === "string" && v.length > 0;
          }
          return true;
        },
        message:
          "Professional fund ID is required when pension system is PROFESSIONAL_FUND",
      },
    },
    inpsRateType: {
      type: String,
      enum: {
        values: [
          "COLLABORATOR_WITH_DISCOLL",
          "COLLABORATOR_WITHOUT_DISCOLL",
          "PROFESSIONAL",
          "PENSIONER",
        ] as InpsRateType[],
        message: "Invalid INPS rate type",
      },
      validate: {
        validator: function (this: IUserSettings, v: InpsRateType | undefined) {
          return this.pensionSystem !== "INPS" || v !== undefined;
        },
        message: "INPS rate type is required when pension system is INPS",
      },
    },
    manualContributionRate: {
      type: Number,
      min: [0, "Manual contribution rate cannot be negative"],
      max: [100, "Manual contribution rate cannot exceed 100"],
      validate: {
        validator: function (v: number | undefined) {
          return !v || (v >= 0 && v <= 100);
        },
        message: "Manual contribution rate must be between 0 and 100",
      },
    },
    manualMinimumContribution: {
      type: Number,
      min: [0, "Manual minimum contribution cannot be negative"],
      validate: {
        validator: function (v: number | undefined) {
          return !v || v >= 0;
        },
        message:
          "Manual minimum contribution must be greater than or equal to 0",
      },
    },
    manualFixedAnnualContributions: {
      type: Number,
      min: [0, "Manual fixed annual contributions cannot be negative"],
      validate: {
        validator: function (v: number | undefined) {
          return !v || v >= 0;
        },
        message:
          "Manual fixed annual contributions must be greater than or equal to 0",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes for performance
 * Note: userId already has unique index from field definition
 */
// userSettingsSchema.index({ userId: 1 }); // Removed: duplicate of unique: true

/**
 * Pre-save validation middleware
 * Ensures data consistency across related fields
 */
userSettingsSchema.pre("save", function (next) {
  // Reset pension-specific fields when pension system changes
  if (this.isModified("pensionSystem")) {
    if (this.pensionSystem === "INPS") {
      this.professionalFundId = undefined;
    } else {
      this.inpsRateType = undefined;
    }
  }

  // Reset regime-specific fields when tax regime changes or on new documents
  if (this.isModified("taxRegime") || this.isNew) {
    if (this.taxRegime === "ordinario") {
      this.substituteRate = undefined;
      this.profitabilityRate = undefined;
    }
  }

  next();
});

/**
 * Export the UserSettings model
 * Simple data model without business logic - follows functional principles
 */
export const UserSettings =
  (models.UserSettings as mongoose.Model<IUserSettings>) ||
  model<IUserSettings>("UserSettings", userSettingsSchema);
