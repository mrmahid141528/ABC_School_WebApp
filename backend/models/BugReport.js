import mongoose from 'mongoose';

const bugReportSchema = new mongoose.Schema(
    {
        ticketId: { type: String, required: true, unique: true },
        reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        issueCategory: { type: String, required: true },
        description: { type: String, required: true },
        pageUrl: { type: String },
        browserInfo: { type: String },
        screenshotUrl: { type: String },
        status: {
            type: String,
            enum: ['Open', 'InProgress', 'Resolved'],
            default: 'Open'
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const BugReport = mongoose.model('BugReport', bugReportSchema);
export default BugReport;
