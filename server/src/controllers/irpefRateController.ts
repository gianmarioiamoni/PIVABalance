import { Request, Response } from 'express';
import { IrpefRateService } from '../services/irpefRateService';

export const irpefRateController = {
  // Get current year's IRPEF rates
  getCurrentRates: async (req: Request, res: Response) => {
    try {
      // Ensure default rates are initialized
      await IrpefRateService.initializeDefaultRates();
      
      const rates = await IrpefRateService.getCurrentRates();
      res.json(rates);
    } catch (error: unknown) {
      console.error('Error fetching IRPEF rates:', error);
      res.status(500).json({ message: 'Errore nel recupero delle aliquote IRPEF' });
    }
  },

  // Get IRPEF rates for a specific year
  getRatesByYear: async (req: Request, res: Response) => {
    try {
      const { year } = req.params;
      const yearNum = parseInt(year);
      
      if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
        return res.status(400).json({ message: 'Anno non valido' });
      }

      const rates = await IrpefRateService.getRatesByYear(yearNum);
      res.json(rates);
    } catch (error: unknown) {
      console.error('Error fetching IRPEF rates:', error);
      res.status(500).json({ message: 'Errore nel recupero delle aliquote IRPEF' });
    }
  },

  // Update an IRPEF rate
  updateRate: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { rate, lowerBound, upperBound } = req.body;

      // Validazione base
      if (rate !== undefined && (rate < 0 || rate > 100)) {
        return res.status(400).json({ message: 'Aliquota non valida' });
      }

      if (lowerBound !== undefined && lowerBound < 0) {
        return res.status(400).json({ message: 'Limite inferiore non valido' });
      }

      if (upperBound !== undefined && upperBound <= lowerBound) {
        return res.status(400).json({ message: 'Limite superiore deve essere maggiore del limite inferiore' });
      }

      const updatedRate = await IrpefRateService.updateRate(id, {
        rate,
        lowerBound,
        upperBound
      });

      res.json(updatedRate);
    } catch (error: unknown) {
      console.error('Error updating IRPEF rate:', error);
      if (error instanceof Error && error.message === 'Rate not found') {
        return res.status(404).json({ message: 'Aliquota non trovata' });
      }
      res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'aliquota' });
    }
  },

  // Deactivate an IRPEF rate
  deactivateRate: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deactivatedRate = await IrpefRateService.deactivateRate(id);
      res.json(deactivatedRate);
    } catch (error: unknown) {
      console.error('Error deactivating IRPEF rate:', error);
      if (error instanceof Error && error.message === 'Rate not found') {
        return res.status(404).json({ message: 'Aliquota non trovata' });
      }
      res.status(500).json({ message: 'Errore nella disattivazione dell\'aliquota' });
    }
  }
};
