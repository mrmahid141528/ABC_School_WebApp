import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        mobileNumber: { type: String, required: true, unique: true, index: true },
        role: {
            type: String,
            required: true,
            enum: ['SuperAdmin', 'Teacher', 'Clerk', 'Parent']
        },
        name: { type: String, required: true },
        assignedClass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classes',
            required: function () { return this.role === 'Teacher'; }
        },
        otp: { type: String },
        otpExpiry: { type: Date },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
