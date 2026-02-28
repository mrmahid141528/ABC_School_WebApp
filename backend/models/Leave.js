import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
    {
        studentId: { type: Number, required: true },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes' },
        date: { type: Date, required: true },
        reason: { type: String, required: true },
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
