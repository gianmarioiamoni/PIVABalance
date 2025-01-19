import { useState, useEffect } from "react";
import { UserSettings, settingsService } from "@/services/settingsService";
import {
  ProfessionalFund,
  professionalFundService,
} from "@/services/professionalFundService";
import { ProfitabilityRate } from "@/components/tax-settings/ProfitabilityRateTable";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showRateTable, setShowRateTable] = useState(false);
  const [selectedProfessionalFund, setSelectedProfessionalFund] =
    useState<ProfessionalFund | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

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

  const loadSettings = async () => {
    try {
      const userSettings = await settingsService.getUserSettings();
      setSettings(userSettings);
      setOriginalSettings(userSettings);
      setError(null);
    } catch (err) {
      setError("Errore nel caricamento delle impostazioni");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await settingsService.updateSettings(settings);
      setSuccess(true);
      setError(null);
      setOriginalSettings(settings);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Errore nel salvataggio delle impostazioni");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (field: keyof UserSettings, value: any) => {
    if (field === "professionalFundId" && value) {
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
  };

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
