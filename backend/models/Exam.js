import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
    {
        examName: { type: String, required: true },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes', required: true },
        isPublished: { type: Boolean, default: false },
        marks: [
            {
                studentId: { type: Number, required: true },
                subject: { type: String, required: true },
                maxMarks: { type: Number, required: true },
                obtainedMarks: { type: Number, required: true },
            }
        ],
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
