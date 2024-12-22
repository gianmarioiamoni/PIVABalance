import { Request, Response } from 'express';
import { ProfessionalFund } from '../models/ProfessionalFund';
import { ProfessionalFundService } from '../services/professionalFundService';

export const professionalFundController = {
  // Get all professional funds
  getAllFunds: async (req: Request, res: Response) => {
    try {
      // Ensure default funds are initialized
      await ProfessionalFundService.initializeDefaultFunds();
      
      const funds = await ProfessionalFundService.getAllFunds();
      res.json(funds);
    } catch (error: unknown) {
      console.error('Error fetching professional funds:', error);
      res.status(500).json({ message: 'Errore nel recupero delle casse professionali' });
    }
  },

  // Get a specific fund by code
  getFundByCode: async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const userId = req.user?._id;
      
      // Ensure default funds are initialized
      await ProfessionalFundService.initializeDefaultFunds();
      
      const fund = await ProfessionalFundService.getFundByCode(code, userId?.toString());
      
      if (!fund) {
        return res.status(404).json({ message: 'Cassa professionale non trovata' });
      }

      res.json(fund);
    } catch (error: unknown) {
      console.error('Error fetching professional fund:', error);
      res.status(500).json({ message: 'Errore nel recupero della cassa professionale' });
    }
  },

  // Create a new professional fund
  createFund: async (req: Request, res: Response) => {
    try {
      const { name, code, description, parameters } = req.body;

      const fund = await ProfessionalFund.create({
        name,
        code,
        description,
        parameters: [{
          ...parameters,
          year: new Date().getFullYear()
        }],
        isActive: true
      });

      res.status(201).json(fund);
    } catch (error: unknown) {
      console.error('Error creating professional fund:', error);
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        return res.status(400).json({ message: 'Una cassa professionale con questo codice esiste già' });
      }
      res.status(500).json({ message: 'Errore nella creazione della cassa professionale' });
    }
  },

  // Update fund parameters
  updateFundParameters: async (req: Request, res: Response) => {
    try {
      const { code } = req.params;
      const { contributionRate, minimumContribution } = req.body;

      const fund = await ProfessionalFundService.updateFundParameters(code, {
        contributionRate,
        minimumContribution
      });

      res.json(fund);
    } catch (error: unknown) {
      console.error('Error updating professional fund parameters:', error);
      if (error && typeof error === 'object' && 'message' in error && error.message === 'Fund not found') {
        return res.status(404).json({ message: 'Cassa professionale non trovata' });
      }
      res.status(500).json({ message: 'Errore nell\'aggiornamento dei parametri' });
    }
  }
};
