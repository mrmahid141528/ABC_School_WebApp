import express from 'express';
import { getSettings, updateSettings, saveIntegrations, restoreData, getDashboardMetrics, createStaffAccount, getAllStaff, deleteStaffAccount, updateStaffPermissions } from '../controllers/adminController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/metrics', requireAuth, checkRole(['SuperAdmin', 'Clerk']), getDashboardMetrics);
router.get('/settings', requireAuth, getSettings);
router.put('/settings', requireAuth, checkRole(['SuperAdmin']), updateSettings);
router.post('/integrations', requireAuth, checkRole(['SuperAdmin']), saveIntegrations);
router.put('/restore/:collection/:id', requireAuth, checkRole(['SuperAdmin']), restoreData);

router.get('/staff', requireAuth, checkRole(['SuperAdmin']), getAllStaff);
router.post('/staff', requireAuth, checkRole(['SuperAdmin']), createStaffAccount);
router.delete('/staff/:id', requireAuth, checkRole(['SuperAdmin']), deleteStaffAccount);
router.put('/staff/:id/permissions', requireAuth, checkRole(['SuperAdmin']), updateStaffPermissions);

export default router;
