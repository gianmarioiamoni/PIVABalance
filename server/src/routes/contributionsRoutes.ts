import express from 'express';
import { auth } from '../middleware/auth';
import PreviousYearContribution from '../models/PreviousYearContribution';

const router = express.Router();

// TODO: Add your contribution-related routes here
// Example:
// router.get('/', auth, contributionsController.getContributions);
// router.post('/', auth, contributionsController.createContribution);

// Get previous year contribution for a specific year
router.get('/previous-year/:year', auth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const contribution = await PreviousYearContribution.findOne({
            userId: req.user.id,
            year: parseInt(req.params.year)
        });
        res.json(contribution || { amount: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching previous year contribution' });
    }
});

// Save or update previous year contribution
router.post('/previous-year', auth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { year, amount } = req.body;
        
        const contribution = await PreviousYearContribution.findOneAndUpdate(
            { userId: req.user.id, year },
            { amount },
            { new: true, upsert: true }
        );
        
        res.json(contribution);
    } catch (error) {
        res.status(500).json({ message: 'Error saving previous year contribution' });
    }
});

export default router;
