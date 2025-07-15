import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "@/types";

/**
 * User Schema with enhanced validation and security features
 * Follows Single Responsibility Principle - handles only user data and authentication
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
  },
  {
    timestamps: true,
    // Ensure virtual fields are included in JSON output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Index for performance optimization
 */
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

/**
 * Pre-save middleware to hash password
 * Implements security best practices
 */
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Instance method to compare password
 * Follows Single Responsibility Principle
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    if (!candidatePassword || candidatePassword.trim() === "") {
      throw new Error("Password cannot be empty");
    }
    if (!this.password) {
      throw new Error("User has no password set");
    }
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

/**
 * Virtual property to get user's full display name
 */
userSchema.virtual("displayName").get(function (this: IUser) {
  return this.name || this.email.split("@")[0];
});

/**
 * Transform function to remove sensitive data from JSON output
 * Implements security by design
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

/**
 * Static method to find user by email
 * Follows Interface Segregation Principle
 */
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

/**
 * Static method to find user by Google ID
 */
userSchema.statics.findByGoogleId = function (googleId: string) {
  return this.findOne({ googleId });
};

/**
 * Export the User model
 * Use existing model if it exists (for hot reloading in development)
 */
export const User =
  (models.User as mongoose.Model<IUser>) || model<IUser>("User", userSchema);
