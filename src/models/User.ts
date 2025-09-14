import mongoose, { Schema, model, models } from "mongoose";
import { IUser } from "@/types";
import { hashPassword } from "@/utils/userCalculations";

/**
 * User Schema with enhanced validation and security features
 * Follows Single Responsibility Principle - handles only user data persistence
 */
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
      maxlength: [255, "Email cannot exceed 255 characters"],
    },
    password: {
      type: String,
      required: function (this: IUser) {
        // Password required only if not using Google auth (Open/Closed Principle)
        return !this.googleId;
      },
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (password: string) {
          if (!password) return true; // Will be caught by required validation
          // Strong password: at least one lowercase, uppercase, number
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password);
        },
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      },
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
      validate: {
        validator: function (name: string) {
          // Allow only letters, spaces, apostrophes, and hyphens
          return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name);
        },
        message:
          "Name can only contain letters, spaces, apostrophes, and hyphens",
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
      validate: {
        validator: function (googleId: string) {
          return !googleId || googleId.length > 0;
        },
        message: "Google ID cannot be empty",
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user',
      required: [true, "User role is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
      required: [true, "Active status is required"],
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: String,
      default: null,
      validate: {
        validator: function (createdBy: string) {
          return !createdBy || mongoose.Types.ObjectId.isValid(createdBy);
        },
        message: "Created by must be a valid user ID",
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Index for performance optimization
 * Note: email and googleId already have unique indexes from their field definitions
 */
// userSchema.index({ email: 1 }); // Removed: duplicate of unique: true
// userSchema.index({ googleId: 1 }); // Removed: duplicate of unique: true

/**
 * Pre-save middleware to hash password
 * Implements security best practices using functional approach
 */
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Export the User model
 * Simple data model without business logic - follows functional principles
 */
export const User =
  (models.User as mongoose.Model<IUser>) || model<IUser>("User", userSchema);
