import crypto from 'crypto';
import GlobalSettings from '../models/GlobalSettings.js';
import mongoose from 'mongoose';

const algorithm = 'aes-256-cbc';

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
