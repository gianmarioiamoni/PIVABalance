import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { UserSettings, settingsService } from "@/services/settingsService";
import {
  ProfessionalFund,
  professionalFundService,
} from "@/services/professionalFundService";
import { ProfitabilityRate } from "@/components/tax-settings/shared/ProfitabilityRateTable";
import { useAuthContext } from "@/providers/AuthProvider";

export function useTaxSettings() {
  const { isAuthenticated } = useAuthContext();
  
  const [settings, setSettings] = useState<UserSettings>({
    taxRegime: "forfettario",
    substituteRate: 5,
    profitabilityRate: 78,
    pensionSystem: "INPS",
    professionalFundId: undefined,
    inpsRateType: undefined,
    manualContributionRate: undefined,
    manualMinimumContribution: undefined,
    manualFixedAnnualContributions: undefined,
  });
  const [originalSettings, setOriginalSettings] = useState<UserSettings | null>(
    null
  );
  const [success, setSuccess] = useState(false);
  const [showRateTable, setShowRateTable] = useState(false);
  const [selectedProfessionalFund, setSelectedProfessionalFund] =
    useState<ProfessionalFund | null>(null);

  // Use SWR for initial settings loading with optimized caching
  // Only fetch if user is authenticated (to avoid 401 errors)
  
  const {
    data: loadedSettings,
    error: loadError,
    isLoading: loading,
  } = useSWR<UserSettings>(
    isAuthenticated ? "user-settings" : null, // Only fetch if authenticated
    () => settingsService.getUserSettings(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute cache
      errorRetryCount: 3,
    }
  );

  // Initialize settings when data is loaded
  useEffect(() => {
    if (loadedSettings && !originalSettings) {
      setSettings(loadedSettings);
      setOriginalSettings(loadedSettings);
    }
    // If not authenticated, ensure we have default settings
    if (!isAuthenticated && !originalSettings) {
      setOriginalSettings(settings);
    }
  }, [loadedSettings, originalSettings, isAuthenticated, settings]);

  const error = loadError && isAuthenticated ? "Errore nel caricamento delle impostazioni" : null;

  const hasChanges = () => {
    if (!originalSettings) return false;
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  };

  const isValid = () => {
    if (
      settings.pensionSystem === "PROFESSIONAL_FUND" &&
      !settings.professionalFundId
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedSettings = await settingsService.updateSettings(settings);
      setSettings(updatedSettings);
      setSuccess(true);
      setOriginalSettings(updatedSettings);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating settings:", err);
      throw err; // Let the component handle the error
    }
  };

  // Simple, stable handleChange without professional fund logic
  const handleChange = useCallback(
    async (
      field: keyof UserSettings,
      value: string | number | boolean | undefined
    ): Promise<void> => {
      setSettings((prev) => ({
        ...prev,
        [field]: value,
        ...(field === "taxRegime" && value === "ordinario"
          ? {
              substituteRate: undefined,
              profitabilityRate: undefined,
            }
          : {}),
      }));
    },
    [] // Empty dependencies to ensure stable reference
  );

  // Batch multiple field updates to avoid multiple re-renders
  const handleBatchChange = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // Separate function for handling professional fund with parameters
  const handleProfessionalFundChange = useCallback(
    async (fundCode: string) => {
      try {
        const fund = await professionalFundService.getFundByCode(fundCode);
        const params = professionalFundService.getCurrentParameters(fund);

        if (params) {
          // Use direct setSettings to avoid any dependency issues
          setSettings((prev) => ({
            ...prev,
            professionalFundId: fundCode,
            manualContributionRate: params.contributionRate,
            manualMinimumContribution: params.minimumContribution,
            manualFixedAnnualContributions: params.fixedAnnualContributions,
          }));
        } else {
          // Just update the fund ID if no parameters
          setSettings((prev) => ({
            ...prev,
            professionalFundId: fundCode,
          }));
        }
      } catch (error) {
        console.error("Error fetching professional fund parameters:", error);
        // Fallback to just updating the fund ID
        setSettings((prev) => ({
          ...prev,
          professionalFundId: fundCode,
        }));
      }
    },
    [] // No dependencies - completely self-contained
  );

  const handleRateSelect = (rate: ProfitabilityRate) => {
    handleChange("profitabilityRate", rate.rate);
    setShowRateTable(false);
  };

  const handleProfessionalFundParametersChange = (params: {
    contributionRate: number;
    minimumContribution: number;
    fixedAnnualContributions: number;
  }) => {
    setSettings((prev) => ({
      ...prev,
      manualContributionRate: params.contributionRate,
      manualMinimumContribution: params.minimumContribution,
      manualFixedAnnualContributions: params.fixedAnnualContributions,
    }));
  };

  return {
    state: {
      settings,
      loading,
      error,
      success,
      showRateTable,
      selectedProfessionalFund,
    },
    actions: {
      handleChange,
      handleBatchChange,
      handleProfessionalFundChange,
      handleSubmit,
      handleRateSelect,
      handleProfessionalFundParametersChange,
      setShowRateTable,
      setSelectedProfessionalFund,
      hasChanges,
      isValid,
    },
  };
}
