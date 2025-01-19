import express from 'express';
import { costController } from '../controllers/costController';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateCost = [
  body('description')
    .notEmpty()
    .withMessage('La descrizione è obbligatoria')
    .trim(),
  body('date')
    .notEmpty()
    .withMessage('La data è obbligatoria')
    .isISO8601()
    .withMessage('Data non valida'),
  body('amount')
    .notEmpty()
    .withMessage('L\'importo è obbligatorio')
    .isFloat({ min: 0 })
    .withMessage('L\'importo deve essere maggiore di 0')
];

// Routes
router.get('/year/:year', param('year').isInt({ min: 2000, max: 2100 }), validateRequest, costController.getCostsByYear);
router.post('/', validateCost, validateRequest, costController.createCost);
router.put('/:id', validateCost, validateRequest, costController.updateCost);
router.delete('/:id', costController.deleteCost);

export default router;
