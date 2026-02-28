import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true, index: true },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes', required: true },
        absentees: [{ type: Number }], // Array of studentIds
        approvedLeaves: [{ type: Number }], // Array of studentIds
        submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
