import express from 'express';
import { createInquiry, updateInquiry, approveAdmission, submitAdmission } from '../controllers/admissionController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/inquiry', createInquiry);
router.put('/inquiry/:id', requireAuth, checkRole(['SuperAdmin', 'Clerk']), updateInquiry);
router.post('/submit', submitAdmission);
router.post('/approve/:id', requireAuth, checkRole(['SuperAdmin']), approveAdmission);

export default router;
