import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - Verify JWT
export const requireAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token payload
            req.user = await User.findById(decoded.userId).select('-otp -otpExpiry');

            if (!req.user || req.user.isDeleted) {
                return res.status(401).json({ status: 'error', message: 'Not authorized, user not found or inactive' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ status: 'error', message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Not authorized, no token' });
    }
};

// Role Based Access Control middleware
export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Forbidden: Insufficient Permissions. Requires one of: ${roles.join(', ')}`
            });
        }
        next();
    };
};
