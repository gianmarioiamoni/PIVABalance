import { UserSettings } from "@/models/UserSettings";
import { IUserSettings } from "@/types";
import { getDefaultSettings } from "./userSettingsCalculations";

/**
 * Pure functions for user settings database queries
 * Replaces static methods with functional approach
 */

/**
 * Find user settings by user ID
 */
export const findSettingsByUserId = async (
  userId: string
): Promise<IUserSettings | null> => {
  const settings = await UserSettings.findOne({ userId }).lean();
  return settings;
};

/**
 * Create default settings for a user
 */
export const createDefaultSettings = async (
  userId: string
): Promise<IUserSettings> => {
  const defaultSettings = getDefaultSettings(userId);
  const settings = await UserSettings.create(defaultSettings);
  return settings.toObject();
};

/**
 * Find or create settings for a user
 */
export const findOrCreateSettings = async (
  userId: string
): Promise<IUserSettings> => {
  let settings = await findSettingsByUserId(userId);

  if (!settings) {
    settings = await createDefaultSettings(userId);
  }

  return settings;
};

/**
 * Update user settings
 */
export const updateUserSettings = async (
  userId: string,
  updates: Partial<IUserSettings>
): Promise<IUserSettings | null> => {
  const settings = await UserSettings.findOneAndUpdate(
    { userId },
    { $set: updates },
    { new: true, upsert: false }
  ).lean();

  return settings;
};

/**
 * Delete user settings
 */
export const deleteUserSettings = async (userId: string): Promise<boolean> => {
  const result = await UserSettings.deleteOne({ userId });
  return result.deletedCount > 0;
};

/**
 * Find settings by tax regime
 */
export const findSettingsByTaxRegime = async (
  taxRegime: "forfettario" | "ordinario"
): Promise<IUserSettings[]> => {
  const settings = await UserSettings.find({ taxRegime })
    .sort({ updatedAt: -1 })
    .lean();

  return settings;
};

/**
 * Find settings by pension system
 */
export const findSettingsByPensionSystem = async (
  pensionSystem: "INPS" | "PROFESSIONAL_FUND"
): Promise<IUserSettings[]> => {
  const settings = await UserSettings.find({ pensionSystem })
    .sort({ updatedAt: -1 })
    .lean();

  return settings;
};

/**
 * Find settings using specific professional fund
 */
export const findSettingsByProfessionalFund = async (
  professionalFundId: string
): Promise<IUserSettings[]> => {
  const settings = await UserSettings.find({ professionalFundId })
    .sort({ updatedAt: -1 })
    .lean();

  return settings;
};

/**
 * Get settings statistics
 */
export const getSettingsStats = async (): Promise<{
  total: number;
  forfettario: number;
  ordinario: number;
  inpsUsers: number;
  professionalFundUsers: number;
  completeSettings: number;
}> => {
  const result = await UserSettings.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        forfettario: {
          $sum: { $cond: [{ $eq: ["$taxRegime", "forfettario"] }, 1, 0] },
        },
        ordinario: {
          $sum: { $cond: [{ $eq: ["$taxRegime", "ordinario"] }, 1, 0] },
        },
        inpsUsers: {
          $sum: { $cond: [{ $eq: ["$pensionSystem", "INPS"] }, 1, 0] },
        },
        professionalFundUsers: {
          $sum: {
            $cond: [{ $eq: ["$pensionSystem", "PROFESSIONAL_FUND"] }, 1, 0],
          },
        },
        // Note: This is a simplified check for complete settings
        // In practice, you might want to use the areSettingsComplete function
        completeSettings: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$taxRegime", null] },
                  { $ne: ["$pensionSystem", null] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  return (
    result[0] || {
      total: 0,
      forfettario: 0,
      ordinario: 0,
      inpsUsers: 0,
      professionalFundUsers: 0,
      completeSettings: 0,
    }
  );
};

/**
 * Find incomplete settings (for admin notifications)
 */
export const findIncompleteSettings = async (): Promise<IUserSettings[]> => {
  const settings = await UserSettings.find({
    $or: [
      { taxRegime: null },
      { pensionSystem: null },
      {
        $and: [
          { taxRegime: "forfettario" },
          {
            $or: [{ substituteRate: null }, { profitabilityRate: null }],
          },
        ],
      },
      {
        $and: [{ pensionSystem: "INPS" }, { inpsRateType: null }],
      },
      {
        $and: [
          { pensionSystem: "PROFESSIONAL_FUND" },
          { professionalFundId: null },
        ],
      },
    ],
  })
    .sort({ updatedAt: 1 }) // Oldest first
    .lean();

  return settings;
};
