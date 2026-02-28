import express from 'express';
import { submitBugReport, getAllBugReports, updateBugStatus } from '../controllers/bugController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', requireAuth, submitBugReport);
router.get('/', requireAuth, checkRole(['SuperAdmin']), getAllBugReports);
router.put('/:id', requireAuth, checkRole(['SuperAdmin']), updateBugStatus);

export default router;
