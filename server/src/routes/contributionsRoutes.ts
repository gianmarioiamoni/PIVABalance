import express from 'express';
import { auth } from '../middleware/auth';
import { contributionsController } from '../controllers/contributionsController';
import { validateRequest } from '../middleware/validateRequest';
import { body, param } from 'express-validator';

const router = express.Router();

// Validation middleware
const validateContributions = [
  body('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Anno non valido'),
  body('previousYearContributions')
    .isFloat({ min: 0 })
    .withMessage('Il valore dei contributi deve essere maggiore o uguale a 0')
];

// Routes
router.get(
  '/:year',
  auth,
  param('year').isInt({ min: 2000, max: 2100 }).withMessage('Anno non valido'),
  validateRequest,
  contributionsController.getContributionsByYear
);

router.post(
  '/',
  auth,
  validateContributions,
  validateRequest,
  contributionsController.saveContributions
);

router.put(
  '/:year',
  auth,
  param('year').isInt({ min: 2000, max: 2100 }).withMessage('Anno non valido'),
  body('previousYearContributions')
    .isFloat({ min: 0 })
    .withMessage('Il valore dei contributi deve essere maggiore o uguale a 0'),
  validateRequest,
  contributionsController.updateContributions
);

export default router;
