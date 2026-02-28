import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    {
        studentId: { type: Number, required: true, unique: true, index: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dob: { type: Date, required: true },
        gender: { type: String },
        bloodGroup: { type: String },
        parentAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        currentClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Classes' },
        rollNumber: { type: Number },
        admissionStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Alumni'],
            default: 'Pending'
        },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
