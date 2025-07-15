import mongoose, { Schema, model, models } from "mongoose";
import { ICost } from "@/types";

/**
 * Cost Schema for expense tracking
 * Follows Single Responsibility Principle - handles only cost data
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Indexes for performance optimization
 */
costSchema.index({ userId: 1, date: -1 });
costSchema.index({ userId: 1, createdAt: -1 });

/**
 * Virtual property for formatted amount
 */
costSchema.virtual("formattedAmount").get(function (this: ICost) {
  return `€${this.amount.toFixed(2)}`;
});

/**
 * Virtual property for formatted date
 */
costSchema.virtual("formattedDate").get(function (this: ICost) {
  return this.date.toLocaleDateString("it-IT");
});

/**
 * Transform function to clean JSON output
 */
costSchema.methods.toJSON = function () {
  const costObject = this.toObject();
  delete costObject.__v;
  return costObject;
};

/**
 * Static method to find costs by user ID and year
 */
costSchema.statics.findByUserAndYear = function (userId: string, year: number) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).sort({ date: -1 });
};

/**
 * Static method to find costs by user ID
 */
costSchema.statics.findByUserId = function (userId: string) {
  return this.find({ userId }).sort({ date: -1 });
};

/**
 * Static method to calculate total costs for user and year
 */
costSchema.statics.getTotalByUserAndYear = function (
  userId: string,
  year: number
) {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  return this.aggregate([
    {
      $match: {
        userId,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);
};

/**
 * Export the Cost model
 */
export const Cost =
  (models.Cost as mongoose.Model<ICost>) || model<ICost>("Cost", costSchema);
