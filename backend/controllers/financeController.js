import crypto from 'crypto';
import Razorpay from 'razorpay';
import FeeRecord from '../models/FeeRecord.js';
import GlobalSettings from '../models/GlobalSettings.js';
import Student from '../models/Student.js';

// @desc    Collect Offline Fee (Cash/Cheque)
// @route   POST /api/finance/collect-fee
// @access  Private (Clerk, SuperAdmin)
export const collectOfflineFee = async (req, res) => {
    try {
        const { studentId, feeRecordId, amountPaid, paymentMode } = req.body;

        if (paymentMode === 'Online') {
            return res.status(400).json({ status: 'error', message: 'Use Razorpay routes for online payments' });
        }

        const feeRecord = await FeeRecord.findById(feeRecordId);
        if (!feeRecord) return res.status(404).json({ status: 'error', message: 'Invoice not found' });

        if (feeRecord.status === 'Paid') {
            return res.status(400).json({ status: 'error', message: 'Invoice is already paid' });
        }

        // STRICT: ZERO PARTIAL PAYMENTS
        if (amountPaid !== feeRecord.totalAmount) {
            return res.status(400).json({ status: 'error', message: 'Partial payments are strictly prohibited. Amount must match exactly.' });
        }

        feeRecord.status = 'Paid';
        feeRecord.paymentMode = paymentMode;
        feeRecord.transactionId = `OFFLINE-${Date.now()}`;
        await feeRecord.save();

        res.status(200).json({ status: 'success', message: 'Fee collected successfully', data: feeRecord });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Create Razorpay Order
// @route   POST /api/finance/create-order
// @access  Private (Parent)
export const createOrder = async (req, res) => {
    try {
        const { feeRecordId } = req.body;
        const feeRecord = await FeeRecord.findById(feeRecordId);
        if (!feeRecord || feeRecord.status === 'Paid') {
            return res.status(400).json({ status: 'error', message: 'Invalid or already paid invoice' });
        }

        // Prepare Razorpay Keys (Mock Decryption)
        const settings = await GlobalSettings.findOne();
        const key_id = settings?.apiIntegrations?.razorpayKeyId || 'rzp_test_123';
        const key_secret = 'mock_decrypted_secret'; // In reality decrypt settings.apiIntegrations.razorpaySecretEncrypted

        const rzp = new Razorpay({
            key_id,
            key_secret
        });

        const options = {
            amount: feeRecord.totalAmount * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_${feeRecordId}`,
        };

        const order = await rzp.orders.create(options);
        if (!order) return res.status(500).json({ status: 'error', message: 'Failed to create order' });

        res.status(200).json({ status: 'success', order_id: order.id, amount: options.amount });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Razorpay Webhook Listener
// @route   POST /api/finance/webhook
// @access  Public
export const paymentWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const secret = 'webhook_secret_from_env_or_db';

        const expectedSignature = crypto.createHmac('sha256', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (expectedSignature === signature) {
            // Valid Signature
            const event = req.body.event;
            if (event === 'payment.captured') {
                const paymentEntity = req.body.payload.payment.entity;
                // Lookup via custom notes if defined, or assume we know context 
                // Mock: Mark some FeeRecord as paid
                console.log("Payment Confirmed", paymentEntity.id);
            }
            res.status(200).send('OK');
        } else {
            res.status(400).send('Invalid Signature');
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Log Expense
// @route   POST /api/finance/expenses
// @access  Private (SuperAdmin, Clerk)
export const logExpense = async (req, res) => {
    res.status(200).json({ status: 'success', message: 'Expense logged (Mock)' });
};

// @desc    Generate Payroll
// @route   POST /api/finance/payroll/generate
// @access  Private (SuperAdmin)
export const generatePayroll = async (req, res) => {
    res.status(200).json({ status: 'success', message: 'Payroll generated (Mock)' });
};

// @desc    Export Reports
// @route   GET /api/finance/export-reports
// @access  Private (SuperAdmin)
export const exportReports = async (req, res) => {
    res.status(200).json({ status: 'success', message: 'Reports exported (Mock)' });
};
