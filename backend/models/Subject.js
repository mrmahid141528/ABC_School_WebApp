import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        type: { type: String, enum: ['Core', 'Elective'], default: 'Core' },
        classes: { type: String }, // Informational e.g., "1st to 10th"
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
