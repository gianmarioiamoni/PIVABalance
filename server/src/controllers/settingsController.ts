import { Request, Response } from 'express';
import { UserSettings } from '../models/UserSettings';

export const settingsController = {
  // Get user settings
  getUserSettings: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Utente non autorizzato' });
      }

      const settings = await UserSettings.findOne({ userId });
      
      if (!settings) {
        // Return default settings if none exist
        return res.json({
          taxRegime: 'forfettario',
          substituteRate: 5,
          profitabilityRate: 78,
          pensionSystem: 'INPS'
        });
      }

      res.json(settings);
    } catch (error: Error | any) {
      console.error('Error fetching user settings:', error);
      res.status(500).json({ message: 'Errore nel recupero delle impostazioni' });
    }
  },

  // Update user settings
  updateSettings: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Utente non autorizzato' });
      }

      const { 
        taxRegime, 
        substituteRate, 
        profitabilityRate,
        pensionSystem,
        professionalFundId
      } = req.body;

      // Validate tax regime
      if (!['forfettario', 'ordinario'].includes(taxRegime)) {
        return res.status(400).json({ message: 'Regime fiscale non valido' });
      }

      // Validate pension system
      if (!['INPS', 'PROFESSIONAL_FUND'].includes(pensionSystem)) {
        return res.status(400).json({ message: 'Sistema previdenziale non valido' });
      }

      // Validate professional fund ID if pension system is PROFESSIONAL_FUND
      if (pensionSystem === 'PROFESSIONAL_FUND' && !professionalFundId) {
        return res.status(400).json({ message: 'Cassa professionale non selezionata' });
      }

      if (taxRegime === 'forfettario') {
        if (substituteRate && ![5, 25].includes(substituteRate)) {
          return res.status(400).json({ message: 'Aliquota sostitutiva non valida' });
        }

        if (profitabilityRate && (profitabilityRate < 0 || profitabilityRate > 100)) {
          return res.status(400).json({ message: 'Coefficiente di redditività non valido' });
        }
      }

      const settings = await UserSettings.findOneAndUpdate(
        { userId },
        {
          taxRegime,
          substituteRate: taxRegime === 'forfettario' ? substituteRate : undefined,
          profitabilityRate: taxRegime === 'forfettario' ? profitabilityRate : undefined,
          pensionSystem,
          professionalFundId: pensionSystem === 'PROFESSIONAL_FUND' ? professionalFundId : undefined
        },
        { 
          new: true, 
          upsert: true,
          runValidators: true 
        }
      );

      res.json(settings);
    } catch (error: Error | any) {
      console.error('Error updating user settings:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Dati non validi' });
      }
      res.status(500).json({ message: 'Errore nel salvataggio delle impostazioni' });
    }
  }
};
