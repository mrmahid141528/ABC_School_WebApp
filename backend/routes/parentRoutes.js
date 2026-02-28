import express from 'express';
import { getParentDashboard, getParentFees } from '../controllers/parentController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', requireAuth, checkRole(['Parent']), getParentDashboard);
router.get('/fees', requireAuth, checkRole(['Parent']), getParentFees);

export default router;
