import express from 'express';
import { getSettings, updateSettings, saveIntegrations, restoreData } from '../controllers/adminController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/settings', requireAuth, getSettings);
router.put('/settings', requireAuth, checkRole(['SuperAdmin']), updateSettings);
router.post('/integrations', requireAuth, checkRole(['SuperAdmin']), saveIntegrations);
router.put('/restore/:collection/:id', requireAuth, checkRole(['SuperAdmin']), restoreData);

export default router;
