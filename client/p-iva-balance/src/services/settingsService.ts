import { api } from "./api";
import { PensionSystemType } from "@/data/pensionFunds";

/**
 * User Settings interface
 * Matches the backend UserSettings model
 */
export interface UserSettings {
  taxRegime: "forfettario" | "ordinario";
  substituteRate?: number;
  profitabilityRate?: number;
  pensionSystem: PensionSystemType;
  professionalFundId?: string;
  inpsRateType?:
    | "COLLABORATOR_WITH_DISCOLL"
    | "COLLABORATOR_WITHOUT_DISCOLL"
    | "PROFESSIONAL"
    | "PENSIONER";
  manualContributionRate?: number;
  manualMinimumContribution?: number;
  manualFixedAnnualContributions?: number;
}

/**
 * Enhanced Settings Service for Next.js API Routes
 *
 * Replaces the old Express backend settings management with Next.js API Routes.
 * Uses JWT authentication and follows the new ApiResponse format.
 *
 * Features:
 * - TypeScript strict typing (zero 'any')
 * - JWT authentication integration
 * - Error handling and validation
 * - Integration with new API client
 * - SOLID principles adherence
 */
class SettingsService {
  /**
   * Get user settings
   * Uses GET /api/settings endpoint
   * Returns default settings if none exist
   */
  async getUserSettings(): Promise<UserSettings> {
    try {
      const settings = await api.get<UserSettings>("/settings");
      return settings;
    } catch (error) {
      console.error("Error fetching user settings:", error);
      throw error;
    }
  }

  /**
   * Update user settings
   * Uses PUT /api/settings endpoint
   * Supports partial updates
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const updatedSettings = await api.put<UserSettings>(
        "/settings",
        settings
      );
      return updatedSettings;
    } catch (error) {
      console.error("Error updating user settings:", error);
      throw error;
    }
  }

  /**
   * Validate settings completeness
   * Client-side validation helper
   */
  isComplete(settings: UserSettings): boolean {
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
  }

  /**
   * Get default settings
   * Provides default configuration for new users
   */
  getDefaultSettings(): UserSettings {
    return {
      taxRegime: "forfettario",
      substituteRate: 5,
      profitabilityRate: 78,
      pensionSystem: "INPS",
      professionalFundId: undefined,
      inpsRateType: undefined,
      manualContributionRate: undefined,
      manualMinimumContribution: undefined,
      manualFixedAnnualContributions: undefined,
    };
  }

  /**
   * Validate settings for specific tax regime
   * Client-side validation helper
   */
  validateForRegime(settings: Partial<UserSettings>): string[] {
    const errors: string[] = [];

    if (!settings.taxRegime) {
      errors.push("Regime fiscale richiesto");
    }

    if (!settings.pensionSystem) {
      errors.push("Sistema previdenziale richiesto");
    }

    if (settings.taxRegime === "forfettario") {
      if (settings.substituteRate === undefined) {
        errors.push("Aliquota sostitutiva richiesta per regime forfettario");
      }
      if (settings.profitabilityRate === undefined) {
        errors.push(
          "Coefficiente di redditività richiesto per regime forfettario"
        );
      }
    }

    if (settings.pensionSystem === "INPS" && !settings.inpsRateType) {
      errors.push("Tipo di contribuente INPS richiesto");
    }

    if (
      settings.pensionSystem === "PROFESSIONAL_FUND" &&
      !settings.professionalFundId
    ) {
      errors.push("Cassa professionale richiesta");
    }

    return errors;
  }
}

/**
 * Global settings service instance
 * Singleton pattern for consistent state management
 */
export const settingsService = new SettingsService();
