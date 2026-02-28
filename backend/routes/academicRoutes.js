import express from 'express';
import { submitAttendance, leaveRequest, leaveApprove, sendSMS, enterMarks, publishResults, fetchPublicResults } from '../controllers/academicController.js';
import { requireAuth, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/attendance', requireAuth, checkRole(['SuperAdmin', 'Teacher']), submitAttendance);
router.post('/leave-request', requireAuth, checkRole(['Parent']), leaveRequest);
router.put('/leave-approve/:id', requireAuth, checkRole(['SuperAdmin']), leaveApprove);
router.post('/attendance/send-sms', requireAuth, checkRole(['SuperAdmin', 'Teacher']), sendSMS);

router.post('/marks', requireAuth, checkRole(['Teacher', 'SuperAdmin']), enterMarks);
router.put('/exams/publish/:examId', requireAuth, checkRole(['SuperAdmin']), publishResults);
router.post('/public/results', fetchPublicResults);

export default router;
