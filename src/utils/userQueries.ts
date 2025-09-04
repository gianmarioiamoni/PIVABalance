import { User } from "@/models/User";
import { IUser } from "@/types";
import { normalizeEmail } from "./userCalculations";
import { UserQuery } from "@/types";

/**
 * Pure functions for user database queries
 * Replaces static methods with functional approach
 */

/**
 * Find user by email (case-insensitive)
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).lean();
  return user;
};

/**
 * Find user by Google ID
 */
export const findUserByGoogleId = async (
  googleId: string
): Promise<IUser | null> => {
  const user = await User.findOne({ googleId }).lean();
  return user;
};

/**
 * Find user by ID
 */
export const findUserById = async (userId: string): Promise<IUser | null> => {
  const user = await User.findById(userId).lean();
  return user;
};

/**
 * Check if email already exists
 */
export const emailExists = async (
  email: string,
  excludeUserId?: string
): Promise<boolean> => {
  const normalizedEmail = normalizeEmail(email);
  const query: UserQuery = { email: normalizedEmail };

  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }

  const user = await User.findOne(query).lean();
  return !!user;
};

/**
 * Check if Google ID already exists
 */
export const googleIdExists = async (
  googleId: string,
  excludeUserId?: string
): Promise<boolean> => {
  const query: UserQuery = { googleId };

  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }

  const user = await User.findOne(query).lean();
  return !!user;
};

/**
 * Find users by name pattern (for admin purposes)
 */
export const findUsersByName = async (nameQuery: string): Promise<IUser[]> => {
  const users = await User.find({
    name: { $regex: nameQuery, $options: "i" },
  })
    .select("-password") // Exclude password field
    .sort({ name: 1 })
    .lean();

  return users;
};

/**
 * Get users count and statistics
 */
export const getUsersStats = async (): Promise<{
  total: number;
  googleUsers: number;
  passwordUsers: number;
  recentUsers: number; // Last 30 days
}> => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await User.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        googleUsers: {
          $sum: { $cond: [{ $ne: ["$googleId", null] }, 1, 0] },
        },
        passwordUsers: {
          $sum: { $cond: [{ $ne: ["$password", null] }, 1, 0] },
        },
        recentUsers: {
          $sum: {
            $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
          },
        },
      },
    },
  ]);

  return (
    result[0] || {
      total: 0,
      googleUsers: 0,
      passwordUsers: 0,
      recentUsers: 0,
    }
  );
};

/**
 * Find users created within date range
 */
export const findUsersByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<IUser[]> => {
  const users = await User.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .select("-password") // Exclude password field
    .sort({ createdAt: -1 })
    .lean();

  return users;
};
