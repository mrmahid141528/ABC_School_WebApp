import mongoose from 'mongoose';

const feeRecordSchema = new mongoose.Schema(
    {
        studentId: { type: Number, required: true, index: true },
        feeTerm: { type: String, required: true },
        totalAmount: { type: Number, required: true },
        gstApplicable: { type: Boolean, default: false },
        gstAmount: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Cancelled'],
            default: 'Pending'
        },
        dueDate: { type: Date, required: true },
        paymentMode: {
            type: String,
            enum: ['Online', 'Cash', 'Cheque']
        },
        transactionId: { type: String },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const FeeRecord = mongoose.model('FeeRecord', feeRecordSchema);
export default FeeRecord;
