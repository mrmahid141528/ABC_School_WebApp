import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
    {
        parentName: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        requestedClass: { type: String, required: true },
        status: {
            type: String,
            enum: ['New', 'Follow-up', 'Interview Scheduled', 'Form Submitted'],
            default: 'New'
        },
        notes: { type: String },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
