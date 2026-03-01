import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        mobileNumber: { type: String, unique: true, sparse: true, index: true },
        username: { type: String, unique: true, sparse: true, index: true },
        password: { type: String },
        role: {
            type: String,
            required: true,
            enum: ['SuperAdmin', 'Teacher', 'Clerk', 'Parent']
        },
        name: { type: String, required: true },
        assignedClass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classes',
            required: false
        },
        linkedStudent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        },
        otp: { type: String },
        otpExpiry: { type: Date },
        isDeleted: { type: Boolean, default: false },
        permissions: {
            type: Map,
            of: Boolean,
            default: {}
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
