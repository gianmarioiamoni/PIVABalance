import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { UserSettings, settingsService } from "@/services/settingsService";
import {
  ProfessionalFund,
  professionalFundService,
} from "@/services/professionalFundService";
import { ProfitabilityRate } from "@/components/tax-settings/shared/ProfitabilityRateTable";

export function useTaxSettings() {
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
  const {
    data: loadedSettings,
    error: loadError,
    isLoading: loading,
  } = useSWR<UserSettings>(
    "user-settings",
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
  }, [loadedSettings, originalSettings]);

  const error = loadError ? "Errore nel caricamento delle impostazioni" : null;

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

  const handleChange = useCallback(async (
    field: keyof UserSettings,
    value: string | number | boolean | undefined
  ) => {
    if (field === "professionalFundId" && value && typeof value === "string") {
      try {
        const fund = await professionalFundService.getFundByCode(value);
        const params = professionalFundService.getCurrentParameters(fund);
        if (params) {
          setSettings((prev) => ({
            ...prev,
            [field]: value,
            manualContributionRate: params.contributionRate,
            manualMinimumContribution: params.minimumContribution,
            manualFixedAnnualContributions: params.fixedAnnualContributions,
          }));
          return;
        }
      } catch (error) {
        console.error("Error fetching professional fund parameters:", error);
      }
    }

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
  }, []);

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
