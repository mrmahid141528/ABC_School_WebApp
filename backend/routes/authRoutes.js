import express from 'express';
import { sendOTP, verifyOTP, staffLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/staff-login', staffLogin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

export default router;
