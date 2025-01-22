'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSettings, settingsService } from '@/services/settingsService';
import { ProfessionalFund, professionalFundService } from '@/services/professionalFundService';

interface TaxSettingsContextType {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  showRateTable: boolean;
  selectedProfessionalFund: ProfessionalFund | null;
  updateSettings: (newSettings: UserSettings) => Promise<void>;
  setShowRateTable: (show: boolean) => void;
  setSelectedProfessionalFund: (fund: ProfessionalFund | null) => void;
  refreshSettings: () => Promise<void>;
  isOrdinaryRegime: boolean;
}

const TaxSettingsContext = createContext<TaxSettingsContextType | undefined>(undefined);

export function TaxSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showRateTable, setShowRateTable] = useState(false);
  const [selectedProfessionalFund, setSelectedProfessionalFund] = useState<ProfessionalFund | null>(null);

  const refreshSettings = async () => {
    setLoading(true);
    try {
      const userSettings = await settingsService.getUserSettings();
      setSettings(userSettings);
      setError(null);
    } catch (err) {
      setError("Errore nel caricamento delle impostazioni");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: UserSettings) => {
    setLoading(true);
    try {
      const updatedSettings = await settingsService.updateSettings(newSettings);
      setSettings(updatedSettings);
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Errore nel salvataggio delle impostazioni");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const isOrdinaryRegime = settings?.taxRegime === 'ordinario';

  const value = {
    settings,
    loading,
    error,
    success,
    showRateTable,
    selectedProfessionalFund,
    updateSettings,
    setShowRateTable,
    setSelectedProfessionalFund,
    refreshSettings,
    isOrdinaryRegime
  };

  return (
    <TaxSettingsContext.Provider value={value}>
      {children}
    </TaxSettingsContext.Provider>
  );
}

export function useTaxSettingsContext() {
  const context = useContext(TaxSettingsContext);
  if (context === undefined) {
    throw new Error('useTaxSettingsContext must be used within a TaxSettingsProvider');
  }
  return context;
}
