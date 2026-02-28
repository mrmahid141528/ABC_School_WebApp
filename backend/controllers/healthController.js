import BugReport from '../models/BugReport.js';

// @desc    Report a Bug (In-App Ticketing)
// @route   POST /api/health/bug-report
// @access  Private (All Users)
export const reportBug = async (req, res) => {
    try {
        const { issueCategory, description, screenshotUrl, pageUrl } = req.body;

        // Auto-Capture logic
        const reportedBy = req.user._id;
        const browserInfo = req.headers['user-agent'];
        const ticketId = `BUG-${Date.now()}`;

        const bugReport = await BugReport.create({
            ticketId,
            reportedBy,
            issueCategory,
            description,
            pageUrl,
            browserInfo,
            screenshotUrl
        });

        res.status(201).json({ status: 'success', message: 'Bug reported successfully. Our team will look into it.', data: bugReport });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
