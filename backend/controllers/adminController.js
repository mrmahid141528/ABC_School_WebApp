import crypto from 'crypto';
import mongoose from 'mongoose';
import GlobalSettings from '../models/GlobalSettings.js';
import User from '../models/User.js';
import Student from '../models/Student.js';
import FeeRecord from '../models/FeeRecord.js';
import Attendance from '../models/Attendance.js';

const algorithm = 'aes-256-cbc';

// @desc    Get Admin Dashboard Metrics
// @route   GET /api/admin/metrics
// @access  Private (SuperAdmin, Clerk)
export const getDashboardMetrics = async (req, res) => {
    try {
        const totalStudentsCount = await Student.countDocuments({ isDeleted: false });

        // Sum all completed payments
        const fees = await FeeRecord.find({ paymentStatus: 'Completed', isDeleted: false });
        const totalRevenue = fees.reduce((acc, fee) => acc + fee.amountPaid, 0);

        // Submissions this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newAdmissions = await Student.countDocuments({
            createdAt: { $gte: startOfMonth },
            isDeleted: false
        });

        // Calculate Average Attendance Rate
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysAbsentees = await Attendance.countDocuments({ date: { $gte: today }, status: 'Absent' });

        // If there are 100 students and 5 are absent, rate is 95%.
        const attendanceRate = totalStudentsCount > 0
            ? Math.max(0, 100 - ((todaysAbsentees / totalStudentsCount) * 100)).toFixed(1)
            : 0;

        res.status(200).json({
            status: 'success',
            data: {
                totalStudents: totalStudentsCount,
                monthlyRevenue: totalRevenue,
                attendanceRate: attendanceRate,
                newAdmissions: newAdmissions,
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Helper to encrypt
const encrypt = (text) => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 32) throw new Error('Invalid ENCRYPTION_KEY in env');

    // We can use a fixed IV for simplicity or random for security. 
    // Usually random IV is stored WITH the ciphertext. For this mock, random IV
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// @desc    Get Global Settings
// @route   GET /api/admin/settings
// @access  Private (SuperAdmin, restricted others)
export const getSettings = async (req, res) => {
    try {
        let settings = await GlobalSettings.findOne();
        if (!settings) {
            settings = await GlobalSettings.create({});
        }
        res.status(200).json({ status: 'success', data: settings });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update Global Settings
// @route   PUT /api/admin/settings
// @access  Private (SuperAdmin)
export const updateSettings = async (req, res) => {
    try {
        // Singleton architecture: always update the first document
        let settings = await GlobalSettings.findOne();
        if (!settings) {
            settings = new GlobalSettings();
        }

        const { schoolName, logoUrl, address, gstinNumber, termsAndConditions, granularLocks } = req.body;

        if (schoolName) settings.schoolName = schoolName;
        if (logoUrl) settings.logoUrl = logoUrl;
        if (address) settings.address = address;
        if (gstinNumber) settings.gstinNumber = gstinNumber;
        if (termsAndConditions) settings.termsAndConditions = termsAndConditions;
        if (granularLocks) settings.granularLocks = granularLocks;

        await settings.save();
        res.status(200).json({ status: 'success', data: settings });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Save API Integrations (Encrypted)
// @route   POST /api/admin/integrations
// @access  Private (SuperAdmin)
export const saveIntegrations = async (req, res) => {
    try {
        const { razorpayKeyId, razorpaySecret, smsGatewayKey } = req.body;

        let settings = await GlobalSettings.findOne();
        if (!settings) settings = new GlobalSettings();

        settings.apiIntegrations = settings.apiIntegrations || {};

        if (razorpayKeyId) settings.apiIntegrations.razorpayKeyId = razorpayKeyId;

        if (razorpaySecret) {
            settings.apiIntegrations.razorpaySecretEncrypted = encrypt(razorpaySecret);
        }
        if (smsGatewayKey) {
            settings.apiIntegrations.smsGatewayKeyEncrypted = encrypt(smsGatewayKey);
        }

        await settings.save();
        res.status(200).json({ status: 'success', message: 'API Keys encrypted and saved successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Restore Soft Deleted Data
// @route   PUT /api/admin/restore/:collection/:id
// @access  Private (SuperAdmin)
export const restoreData = async (req, res) => {
    try {
        const { collection, id } = req.params;
        // Basic mapping
        const Model = mongoose.model(collection);
        if (!Model) return res.status(400).json({ status: 'error', message: 'Invalid collection' });

        const doc = await Model.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
        res.status(200).json({ status: 'success', message: 'Data restored successfully', data: doc });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
