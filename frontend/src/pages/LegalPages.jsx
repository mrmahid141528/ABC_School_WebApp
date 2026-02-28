import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const policies = {
    'terms': {
        title: 'Terms and Conditions',
        icon: FileText,
        content: `
      1. Acceptance of Terms: By accessing and using ABC School's ERP system, you accept and agree to be bound by the terms and provisions of this agreement.
      2. User Accounts: You are responsible for maintaining the confidentiality of your account credentials and OTP sequences.
      3. Communication: The school utilizes SMS and Email via this platform for official communications. Standard rates may apply.
      4. Limitation of Liability: ABC School shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the portal.
    `
    },
    'privacy': {
        title: 'Privacy Policy',
        icon: ShieldCheck,
        content: `
      1. Data Collection: We collect personal information (name, phone, address, academic records) necessary for educational administration.
      2. Data Security: All sensitive interactions are encrypted. API Keys and financial data are secured via AES-256 GCM encryption.
      3. Third-Party Sharing: We do not sell your data. We only share necessary data with authorized service providers like Razorpay (for payments) and Fast2SMS (for alerts).
      4. Data Retention: Student academic records are retained as mandated by the educational board. You may request account deletion which acts as a soft-delete to preserve ledger integrity.
    `
    },
    'refund': {
        title: 'Refund & Cancellation Policy',
        icon: RefreshCw,
        content: `
      1. Fee Payments: All fee payments executed via the Razorpay gateway are for educational services and are generally non-refundable.
      2. Erroneous Deductions: If a payment is deducted twice due to a network error, please contact the Accounts department with your Payment ID for a manual ledger adjustment within 7 working days.
      3. Admission Withdrawals: Refunds on admissions withdrawals are strictly governed by the school's physical policy handbook and are not automated via this portal.
      4. Disputed Charges: Do not initiate bank chargebacks without contacting the school first, as this may lead to immediate suspension of portal access.
    `
    }
};

const LegalPages = () => {
    const { policyType } = useParams();
    const policy = policies[policyType] || policies['terms'];
    const Icon = policy.icon;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4">

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-3xl"
            >
                <Link to="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

                    <div className="bg-slate-900 px-8 py-10 text-white relative">
                        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-bl-full pointer-events-none" />
                        <Icon className="w-12 h-12 text-primary mb-4" />
                        <h1 className="text-3xl font-bold">{policy.title}</h1>
                        <p className="text-white/60 mt-2">Last updated: May 2026</p>
                    </div>

                    <div className="p-8">
                        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
                            {policy.content.split('\n').filter(Boolean).map((paragraph, idx) => (
                                <p key={idx} className="leading-relaxed">
                                    {paragraph.trim()}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-100 flex gap-4 text-sm font-medium text-slate-500 justify-center">
                        <Link to="/legal/terms" className="hover:text-primary">Terms</Link>
                        <span>•</span>
                        <Link to="/legal/privacy" className="hover:text-primary">Privacy</Link>
                        <span>•</span>
                        <Link to="/legal/refund" className="hover:text-primary">Refunds</Link>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default LegalPages;
