import mongoose from 'mongoose';

const globalSettingsSchema = new mongoose.Schema(
    {
        schoolName: { type: String, default: 'ABC & School' },
        logoUrl: { type: String, default: '' },
        address: { type: String, default: '' },
        gstinNumber: { type: String, default: '' },
        termsAndConditions: { type: String, default: '' },
        apiIntegrations: {
            razorpayKeyId: { type: String, default: '' },
            razorpaySecretEncrypted: { type: String, default: '' },
            smsGatewayKeyEncrypted: { type: String, default: '' },
        },
        granularLocks: [
            {
                fieldName: { type: String },
                isLocked: { type: Boolean, default: false },
            }
        ],
    },
    { timestamps: true }
);

const GlobalSettings = mongoose.model('GlobalSettings', globalSettingsSchema);
export default GlobalSettings;
