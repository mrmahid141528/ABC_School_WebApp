import React from 'react';
import { Receipt, CheckCircle2, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const ParentFees = () => {
    // Mock Data
    const feeRecords = [
        { id: 'INV-001', title: 'Term 1 Tuition Fee', amount: 15000, dueDate: '2026-05-10', status: 'Pending' },
        { id: 'INV-002', title: 'Transport Fee (Q1)', amount: 4500, dueDate: '2026-05-10', status: 'Pending' },
        { id: 'INV-003', title: 'Admission Fee', amount: 25000, dueDate: '2026-04-01', status: 'Paid', paymentDate: '2026-03-25' },
        { id: 'INV-004', title: 'Annual Charges', amount: 8000, dueDate: '2026-04-01', status: 'Paid', paymentDate: '2026-03-25' },
    ];

    const pendingAmount = feeRecords
        .filter(f => f.status === 'Pending')
        .reduce((sum, f) => sum + f.amount, 0);

    const handlePayMock = () => {
        alert("Razorpay implementation will open bottom sheet overlay here!");
    };

    return (
        <div className="space-y-6 pb-6">
            <div className="px-1">
                <h2 className="text-xl font-bold text-slate-800">Fee Invoices</h2>
                <p className="text-sm text-slate-500">Manage and pay your school fees securely</p>
            </div>

            {pendingAmount > 0 && (
                <div className="bg-primary text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <span className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">Total Due</span>
                        <h3 className="text-4xl font-bold mb-4">₹{pendingAmount.toLocaleString()}</h3>
                        <Button
                            onClick={handlePayMock}
                            variant="secondary"
                            className="w-full text-primary font-bold shadow-md"
                        >
                            Pay Now
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 px-1 pt-2">Invoice History</h3>

                {feeRecords.map((fee) => (
                    <div key={fee.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 shrink-0
                  ${fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                                    {fee.status === 'Paid' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm md:text-base">{fee.title}</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">{fee.id}</p>
                                </div>
                            </div>
                            <Badge variant={fee.status === 'Paid' ? 'success' : 'warning'}>
                                {fee.status}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Amount</p>
                                <p className="text-lg font-bold text-slate-800">₹{fee.amount.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-medium">{fee.status === 'Paid' ? 'Paid On' : 'Due Date'}</p>
                                <p className={`text-sm font-semibold ${fee.status === 'Pending' ? 'text-amber-600' : 'text-slate-600'}`}>
                                    {fee.status === 'Paid' ? fee.paymentDate : fee.dueDate}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ParentFees;
