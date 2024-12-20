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

      let settings = await UserSettings.findOne({ userId });
      
      if (!settings) {
        // Create default settings if none exist
        settings = await UserSettings.create({
          userId,
          taxRegime: 'forfettario',
          substituteRate: 5,
          profitabilityRate: 78
        });
      }

      res.json(settings);
    } catch (error) {
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

      const { taxRegime, substituteRate, profitabilityRate } = req.body;

      // Validate input
      if (taxRegime && !['forfettario', 'ordinario'].includes(taxRegime)) {
        return res.status(400).json({ message: 'Regime fiscale non valido' });
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
          ...(taxRegime === 'forfettario' ? { substituteRate, profitabilityRate } : {
            $unset: { substituteRate: 1, profitabilityRate: 1 }
          })
        },
        { new: true, upsert: true }
      );

      res.json(settings);
    } catch (error) {
      console.error('Error updating user settings:', error);
      res.status(500).json({ message: 'Errore nell\'aggiornamento delle impostazioni' });
    }
  }
};
