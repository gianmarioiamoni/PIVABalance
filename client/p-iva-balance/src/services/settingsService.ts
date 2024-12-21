import api from './api';
import { PensionSystemType } from '@/data/pensionFunds';

export interface UserSettings {
  taxRegime: 'forfettario' | 'ordinario';
  substituteRate: number;
  profitabilityRate: number;
  pensionSystem: PensionSystemType;
  professionalFundId?: string;
}

class SettingsService {
  async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await api.get('/api/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const response = await api.put('/api/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();
