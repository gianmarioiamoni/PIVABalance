import express from 'express';
import { professionalFundController } from '../controllers/professionalFundController';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateFundParameters = [
  body('contributionRate')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Il tasso di contribuzione deve essere compreso tra 0 e 100'),
  body('minimumContribution')
    .isFloat({ min: 0 })
    .withMessage('Il contributo minimo deve essere maggiore di 0'),
  body('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Anno non valido')
];

const validateFundCreation = [
  body('name').notEmpty().withMessage('Il nome è obbligatorio'),
  body('code').notEmpty().withMessage('Il codice è obbligatorio'),
  ...validateFundParameters
];

// Routes
router.get('/', professionalFundController.getAllFunds);
router.get('/:code', professionalFundController.getFundByCode);
router.post('/', validateFundCreation, validateRequest, professionalFundController.createFund);
router.put('/:code/parameters', validateFundParameters, validateRequest, professionalFundController.updateFundParameters);

export default router;
