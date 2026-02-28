import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
    {
        className: { type: String, required: true },
        section: { type: String, required: true },
        classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isRollingAdmission: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Classes = mongoose.model('Classes', classSchema);
export default Classes;
