import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Generate OTP helper
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};

// Generate JWT helper
const signToken = (user) => {
    const payload = {
        userId: user._id,
        role: user.role,
        name: user.name,
        mobileNumber: user.mobileNumber,
        ...(user.assignedClass && { assignedClass: user.assignedClass })
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Staff Login (Username + Password)
// @route   POST /api/auth/staff-login
// @access  Public
export const staffLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ status: 'error', message: 'Username and password are required' });
        }

        const user = await User.findOne({
            username: username.toLowerCase().trim(),
            role: { $in: ['SuperAdmin', 'Teacher', 'Clerk'] },
            isDeleted: false
        });

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        if (!user.password) {
            return res.status(401).json({ status: 'error', message: 'Password not set for this account. Contact Super Admin.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        const token = signToken(user);

        res.status(200).json({
            status: 'success',
            message: 'Authentication successful',
            token,
            user: {
                userId: user._id,
                role: user.role,
                name: user.name,
                username: user.username,
                ...(user.assignedClass && { assignedClass: user.assignedClass })
            }
        });

    } catch (error) {
        console.error(`Staff Login Error: ${error.message}`, error.stack);
        res.status(500).json({ status: 'error', message: error.message || 'Server Error' });
    }
};

// @desc    Send OTP — PARENTS ONLY (mobile must be in DB)
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({ status: 'error', message: 'Mobile number is required' });
        }

        // STRICTLY only look for Parent role
        const user = await User.findOne({ mobileNumber, role: 'Parent', isDeleted: false });

        if (!user) {
            return res.status(403).json({
                status: 'error',
                message: 'This mobile number is not registered. Please contact the school administration.'
            });
        }

        // Generate plain OTP and hash
        const plainOTP = generateOTP();
        const salt = await bcrypt.genSalt(10);
        const hashedOTP = await bcrypt.hash(plainOTP, salt);

        // Set expiry 5 minutes
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        user.otp = hashedOTP;
        user.otpExpiry = otpExpiry;
        await user.save();

        // MOCK SMS - replace with real SMS API call
        console.log(`[SMS] Sending OTP ${plainOTP} to ${mobileNumber}`);

        res.status(200).json({
            status: 'success',
            message: 'OTP sent to your registered mobile number',
            ...(process.env.NODE_ENV === 'development' && { _devOTP: plainOTP })
        });

    } catch (error) {
        console.error(`Send OTP Error: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};

// @desc    Verify OTP and return JWT — Parents Only
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
    try {
        const { mobileNumber, otp } = req.body;

        if (!mobileNumber || !otp) {
            return res.status(400).json({ status: 'error', message: 'Mobile number and OTP are required' });
        }

        const user = await User.findOne({ mobileNumber, role: 'Parent', isDeleted: false });

        if (!user || !user.otp || !user.otpExpiry) {
            return res.status(400).json({ status: 'error', message: 'Invalid request or OTP expired' });
        }

        // Check expiry
        if (user.otpExpiry < new Date()) {
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            return res.status(400).json({ status: 'error', message: 'OTP has expired. Please request a new one.' });
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(otp.toString(), user.otp);

        if (!isMatch) {
            return res.status(400).json({ status: 'error', message: 'Invalid OTP. Please try again.' });
        }

        // Valid OTP, clear it
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = signToken(user);

        res.status(200).json({
            status: 'success',
            message: 'Authentication successful',
            token,
            user: {
                userId: user._id,
                role: user.role,
                name: user.name,
                mobileNumber: user.mobileNumber
            }
        });

    } catch (error) {
        console.error(`Verify OTP Error: ${error.message}`);
        res.status(500).json({ status: 'error', message: 'Server Error' });
    }
};
