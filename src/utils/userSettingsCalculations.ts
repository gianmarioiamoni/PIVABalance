import { IUserSettings, TaxRegime, PensionSystem } from "@/types";

/**
 * Pure functions for user settings calculations and validation
 * Follows functional programming principles
 */

/**
 * Check if user settings are complete
 */
export const areSettingsComplete = (settings: IUserSettings): boolean => {
  const hasBasicSettings = !!(settings.taxRegime && settings.pensionSystem);

  const hasPensionSettings =
    settings.pensionSystem === "INPS"
      ? !!settings.inpsRateType
      : !!settings.professionalFundId;

  const hasTaxSettings =
    settings.taxRegime === "ordinario"
      ? true
      : !!(settings.substituteRate && settings.profitabilityRate);

  return hasBasicSettings && hasPensionSettings && hasTaxSettings;
};

/**
 * Validate tax regime settings
 */
export const validateTaxRegimeSettings = (
  settings: IUserSettings
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!settings.taxRegime) {
    errors.push("Tax regime is required");
    return { isValid: false, errors };
  }

  if (settings.taxRegime === "forfettario") {
    if (!settings.substituteRate) {
      errors.push("Substitute rate is required for forfettario regime");
    } else if (![5, 25].includes(settings.substituteRate)) {
      errors.push(
        "Substitute rate must be either 5 or 25 for forfettario regime"
      );
    }

    if (!settings.profitabilityRate) {
      errors.push("Profitability rate is required for forfettario regime");
    } else if (
      settings.profitabilityRate < 0 ||
      settings.profitabilityRate > 100
    ) {
      errors.push("Profitability rate must be between 0 and 100");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate pension system settings
 */
export const validatePensionSystemSettings = (
  settings: IUserSettings
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!settings.pensionSystem) {
    errors.push("Pension system is required");
    return { isValid: false, errors };
  }

  if (settings.pensionSystem === "INPS") {
    if (!settings.inpsRateType) {
      errors.push("INPS rate type is required when pension system is INPS");
    }
  } else if (settings.pensionSystem === "PROFESSIONAL_FUND") {
    if (!settings.professionalFundId) {
      errors.push(
        "Professional fund ID is required when pension system is PROFESSIONAL_FUND"
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate manual contribution settings
 */
export const validateManualContributionSettings = (
  settings: IUserSettings
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (settings.manualContributionRate !== undefined) {
    if (
      settings.manualContributionRate < 0 ||
      settings.manualContributionRate > 100
    ) {
      errors.push("Manual contribution rate must be between 0 and 100");
    }
  }

  if (settings.manualMinimumContribution !== undefined) {
    if (settings.manualMinimumContribution < 0) {
      errors.push("Manual minimum contribution cannot be negative");
    }
  }

  if (settings.manualFixedAnnualContributions !== undefined) {
    if (settings.manualFixedAnnualContributions < 0) {
      errors.push("Manual fixed annual contributions cannot be negative");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check if settings use INPS pension system
 */
export const usesInpsPension = (settings: IUserSettings): boolean => {
  return settings.pensionSystem === "INPS";
};

/**
 * Check if settings use professional fund pension system
 */
export const usesProfessionalFundPension = (
  settings: IUserSettings
): boolean => {
  return settings.pensionSystem === "PROFESSIONAL_FUND";
};

/**
 * Check if settings use forfettario tax regime
 */
export const usesForfettarioRegime = (settings: IUserSettings): boolean => {
  return settings.taxRegime === "forfettario";
};

/**
 * Check if settings use ordinario tax regime
 */
export const usesOrdinarioRegime = (settings: IUserSettings): boolean => {
  return settings.taxRegime === "ordinario";
};

/**
 * Get default settings for a new user
 */
export const getDefaultSettings = (userId: string): Partial<IUserSettings> => {
  return {
    userId,
    taxRegime: "forfettario",
    substituteRate: 5,
    profitabilityRate: 78,
    pensionSystem: "INPS",
    inpsRateType: "PROFESSIONAL",
  };
};

/**
 * Reset regime-specific fields when tax regime changes
 */
export const resetTaxRegimeFields = (
  settings: IUserSettings,
  newTaxRegime: TaxRegime
): Partial<IUserSettings> => {
  const updatedSettings = { ...settings, taxRegime: newTaxRegime };

  if (newTaxRegime === "ordinario") {
    delete updatedSettings.substituteRate;
    delete updatedSettings.profitabilityRate;
  }

  return updatedSettings;
};

/**
 * Reset pension-specific fields when pension system changes
 */
export const resetPensionSystemFields = (
  settings: IUserSettings,
  newPensionSystem: PensionSystem
): Partial<IUserSettings> => {
  const updatedSettings = { ...settings, pensionSystem: newPensionSystem };

  if (newPensionSystem === "INPS") {
    delete updatedSettings.professionalFundId;
  } else {
    delete updatedSettings.inpsRateType;
  }

  return updatedSettings;
};

/**
 * Calculate completion percentage for settings
 */
export const getSettingsCompletionPercentage = (
  settings: IUserSettings
): number => {
  const totalFields = 4; // taxRegime, pensionSystem, and 2 conditional fields
  let completedFields = 0;

  // Always required fields
  if (settings.taxRegime) completedFields++;
  if (settings.pensionSystem) completedFields++;

  // Tax regime specific fields
  if (settings.taxRegime === "forfettario") {
    if (settings.substituteRate) completedFields++;
    if (settings.profitabilityRate) completedFields++;
  } else if (settings.taxRegime === "ordinario") {
    completedFields += 2; // Both conditions satisfied for ordinario
  }

  // Pension system specific fields
  if (settings.pensionSystem === "INPS" && settings.inpsRateType) {
    // Already counted in pension system
  } else if (
    settings.pensionSystem === "PROFESSIONAL_FUND" &&
    settings.professionalFundId
  ) {
    // Already counted in pension system
  }

  return Math.round((completedFields / totalFields) * 100);
};

/**
 * Clean settings object for JSON output
 */
export const cleanSettingsForJSON = (
  settings: IUserSettings
): Omit<IUserSettings, "__v"> => {
  const settingsObj = settings.toJSON?.() || settings;
  const { __v: _v, ...cleanSettings } = settingsObj as typeof settingsObj & {
    __v?: unknown;
  };
  return cleanSettings as Omit<IUserSettings, "__v">;
};
