import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Definizione dei parametri INPS di default
const DEFAULT_INPS_PARAMETERS = {
  year: new Date().getFullYear(),
  rates: [
    {
      type: 'PROFESSIONAL',
      description: 'Professionisti senza altra copertura',
      rate: 26.07
    },
    {
      type: 'PROFESSIONAL_WITH_OTHER',
      description: 'Professionisti con altra copertura',
      rate: 24
    }
  ],
  maxIncome: 103055,
  minIncome: 16243,
  minContributions: {
    PROFESSIONAL: 4231.41,
    PROFESSIONAL_WITH_OTHER: 3898.32
  }
};

// GET /api/inps/parameters/current
router.get('/parameters/current', async (req: Request, res: Response) => {
  try {
    // Per ora restituiamo i parametri di default
    // In futuro, questi potrebbero essere caricati da un database
    res.json(DEFAULT_INPS_PARAMETERS);
  } catch (error) {
    console.error('Error fetching INPS parameters:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/inps/parameters/:year
router.get('/parameters/:year', async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.params.year);
    // Per ora restituiamo gli stessi parametri di default
    // In futuro, potremmo caricare parametri specifici per anno dal database
    const parameters = { ...DEFAULT_INPS_PARAMETERS, year };
    res.json(parameters);
  } catch (error) {
    console.error('Error fetching INPS parameters for year:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
