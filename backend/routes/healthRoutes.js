import express from 'express';
import { reportBug } from '../controllers/healthController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/bug-report', requireAuth, reportBug);

export default router;
