import express from 'express';
import { collectOfflineFee, createOrder, paymentWebhook, logExpense, generatePayroll, exportReports } from '../controllers/financeController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/collect-fee', requireAuth, checkRole(['SuperAdmin', 'Clerk']), collectOfflineFee);
router.post('/create-order', requireAuth, checkRole(['Parent']), createOrder);
// Webhooks must be public to receive payloads from external gateways
router.post('/webhook', express.raw({ type: 'application/json' }), paymentWebhook);

router.post('/expenses', requireAuth, checkRole(['SuperAdmin', 'Clerk']), logExpense);
router.post('/payroll/generate', requireAuth, checkRole(['SuperAdmin']), generatePayroll);
router.get('/export-reports', requireAuth, checkRole(['SuperAdmin']), exportReports);

export default router;
