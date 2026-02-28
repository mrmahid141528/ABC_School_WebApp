import express from 'express';
import { createInquiry, updateInquiry, approveAdmission, submitAdmission, getAllInquiries } from '../controllers/admissionController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/inquiry', requireAuth, checkRole(['SuperAdmin', 'Clerk']), getAllInquiries);
router.post('/inquiry', createInquiry);
router.put('/inquiry/:id', requireAuth, checkRole(['SuperAdmin', 'Clerk']), updateInquiry);
router.post('/submit', submitAdmission);
router.post('/approve/:id', requireAuth, checkRole(['SuperAdmin']), approveAdmission);

export default router;
