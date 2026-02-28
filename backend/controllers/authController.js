import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Generate OTP helper
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};

// @desc    Send OTP for Login
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
    try {
        const { mobileNumber, portalType } = req.body;

        if (!mobileNumber || !portalType) {
            return res.status(400).json({ status: 'error', message: 'Mobile number and portalType are required' });
        }

        // Determine target roles
        const targetRoles = portalType === 'staff' ? ['SuperAdmin', 'Teacher', 'Clerk'] : ['Parent'];

        // Find User
        const user = await User.findOne({ mobileNumber, role: { $in: targetRoles }, isDeleted: false });

        if (!user) {
            return res.status(403).json({
                status: 'error',
                message: portalType === 'staff' ? 'Unauthorized Staff' : 'Parent account not found. Please contact administration.'
            });
        }

        // Generate plain OTP and hash
        const plainOTP = generateOTP();
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(plainOTP, salt);

        // Set expiry 5 minutes
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        // Save to user
        user.otp = hashedOTP;
        user.otpExpiry = otpExpiry;
        await user.save();

        // MOCK SMS API CALL
        console.log(`[SMS MOCK] Sending OTP ${plainOTP} to ${mobileNumber}`);

        // In development mode, we can return the OTP directly for testing purposes.
        res.status(200).json({
            status: 'success',
            message: 'OTP sent successfully',
            ...(process.env.NODE_ENV === 'development' && { _devOTP: plainOTP })
        });

    } catch (error) {
        console.error(`Send OTP Error: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Verify OTP and return JWT
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
    try {
        const { mobileNumber, otp, portalType } = req.body;

        if (!mobileNumber || !otp || !portalType) {
            return res.status(400).json({ status: 'error', message: 'Mobile number, OTP, and portalType are required' });
        }

        const targetRoles = portalType === 'staff' ? ['SuperAdmin', 'Teacher', 'Clerk'] : ['Parent'];
        const user = await User.findOne({ mobileNumber, role: { $in: targetRoles }, isDeleted: false });

        if (!user || !user.otp || !user.otpExpiry) {
            return res.status(400).json({ status: 'error', message: 'Invalid request or OTP expired' });
        }

        // Check expiry
        if (user.otpExpiry < new Date()) {
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            return res.status(400).json({ status: 'error', message: 'OTP has expired' });
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(otp.toString(), user.otp);

        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Invalid OTP' });
        }

        // Valid OTP, clear it
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generate JWT
        const payload = {
            userId: user._id,
            role: user.role,
            name: user.name,
            ...(user.role === 'Teacher' && { assignedClass: user.assignedClass })
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            status: 'success',
            message: 'Authentication successful',
            token,
            user: payload
        });

    } catch (error) {
        console.error(`Verify OTP Error: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
