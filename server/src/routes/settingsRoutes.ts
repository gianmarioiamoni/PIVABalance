import express from 'express';
import { settingsController } from '../controllers/settingsController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, settingsController.getUserSettings);
router.put('/', auth, settingsController.updateSettings);

export default router;
