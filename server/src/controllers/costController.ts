import { Request, Response } from 'express';
import { Cost } from '../models/Cost';

export const costController = {
  // Get all costs for a user in a specific year
  getCostsByYear: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const year = parseInt(req.params.year);
      
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

      const costs = await Cost.find({
        userId,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ date: -1 });

      res.json(costs);
    } catch (error) {
      console.error('Error fetching costs:', error);
      res.status(500).json({ message: 'Errore nel recupero dei costi' });
    }
  },

  // Create a new cost
  createCost: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const { description, date, amount } = req.body;

      const cost = await Cost.create({
        userId,
        description,
        date: new Date(date),
        amount: parseFloat(amount)
      });

      res.status(201).json(cost);
    } catch (error) {
      console.error('Error creating cost:', error);
      res.status(500).json({ message: 'Errore nella creazione del costo' });
    }
  },

  // Update a cost
  updateCost: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const costId = req.params.id;
      const { description, date, amount } = req.body;

      const cost = await Cost.findOneAndUpdate(
        { _id: costId, userId },
        {
          description,
          date: new Date(date),
          amount: parseFloat(amount)
        },
        { new: true }
      );

      if (!cost) {
        return res.status(404).json({ message: 'Costo non trovato' });
      }

      res.json(cost);
    } catch (error) {
      console.error('Error updating cost:', error);
      res.status(500).json({ message: 'Errore nell\'aggiornamento del costo' });
    }
  },

  // Delete a cost
  deleteCost: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const costId = req.params.id;

      const cost = await Cost.findOneAndDelete({ _id: costId, userId });

      if (!cost) {
        return res.status(404).json({ message: 'Costo non trovato' });
      }

      res.json({ message: 'Costo eliminato con successo' });
    } catch (error) {
      console.error('Error deleting cost:', error);
      res.status(500).json({ message: 'Errore nell\'eliminazione del costo' });
    }
  }
};
