import BugReport from '../models/BugReport.js';
import crypto from 'crypto';

// @desc    Submit a Bug Report
// @route   POST /api/bugs
// @access  Private (Any authenticated user)
export const submitBugReport = async (req, res) => {
    try {
        const { issueCategory, description, pageUrl } = req.body;
        const ticketId = `TKT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        const report = await BugReport.create({
            ticketId,
            reportedBy: req.user._id,
            issueCategory,
            description,
            pageUrl: pageUrl || req.headers.referer,
            browserInfo: req.headers['user-agent']
        });

        res.status(201).json({ status: 'success', data: report });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Get All Bug Reports
// @route   GET /api/bugs
// @access  Private (SuperAdmin)
export const getAllBugReports = async (req, res) => {
    try {
        const reports = await BugReport.find({ isDeleted: false })
            .populate('reportedBy', 'name mobileNumber role')
            .sort({ createdAt: -1 });

        res.status(200).json({ status: 'success', data: reports });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Update Bug Report Status
// @route   PUT /api/bugs/:id
// @access  Private (SuperAdmin)
export const updateBugStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const report = await BugReport.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!report) return res.status(404).json({ status: 'error', message: 'Report not found' });
        res.status(200).json({ status: 'success', data: report });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
