import React, { useState } from 'react';
import { Search, IndianRupee, Printer, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/apiClient';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const AdminFinance = () => {
    const [studentIdInput, setStudentIdInput] = useState('');
    const [searchedStudent, setSearchedStudent] = useState(null);
    const [paymentMode, setPaymentMode] = useState('Cash Received');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!studentIdInput) return;
        setIsLoading(true);
        try {
            const res = await api.get(`/finance/dues/${studentIdInput}`);
            if (res.status === 'success' && res.data.student) {
                setSearchedStudent({
                    name: res.data.student.name,
                    id: res.data.student.id,
                    class: res.data.student.class,
                    pendingAmount: res.data.feeRecord?.pendingAmount || 0,
                    dueFor: res.data.feeRecord?.dueFor || 'Nil',
                    feeRecordId: res.data.feeRecord?.id || null
                });
            }
        } catch (error) {
            setSearchedStudent('NOT_FOUND');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCollect = async () => {
        if (!searchedStudent || !searchedStudent.feeRecordId) return;
        try {
            const res = await api.post('/finance/collect-fee', {
                studentId: searchedStudent.id,
                feeRecordId: searchedStudent.feeRecordId,
                amountPaid: searchedStudent.pendingAmount,
                paymentMode: paymentMode === 'Cash Received' ? 'Cash' : paymentMode === 'Card POS/UPI' ? 'Card/UPI' : 'Bank Transfer'
            });
            if (res.status === 'success') {
                toast.success("Offline Fee Collected! Ledger Updated.");
                setSearchedStudent({
                    ...searchedStudent,
                    pendingAmount: 0,
                    dueFor: 'Nil',
                    feeRecordId: null
                });
            }
        } catch (error) {
            toast.error(error.message || "Failed to collect fee");
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Fee Collection Desk</h2>
                <p className="text-slate-500 font-medium">Process offline payments and generate instant receipts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Search Panel */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 lg:col-span-1 h-fit">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Find Student</h3>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Enter 11-Digit ID"
                                value={studentIdInput}
                                onChange={(e) => setStudentIdInput(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Looking up...' : 'Lookup Dues'}
                        </Button>
                    </form>

                    {searchedStudent === 'NOT_FOUND' && (
                        <div className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center text-sm">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            No student found with this ID.
                        </div>
                    )}
                </div>

                {/* Action Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {searchedStudent && searchedStudent !== 'NOT_FOUND' ? (
                        <>
                            {/* Student Profile Card */}
                            <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                <div className="relative z-10">
                                    <span className="text-white/60 text-xs font-medium uppercase tracking-wider block mb-1">Student Found</span>
                                    <h2 className="text-2xl font-bold">{searchedStudent.name}</h2>
                                    <p className="text-white/80 text-sm mt-0.5">{searchedStudent.id} • {searchedStudent.class}</p>
                                </div>

                                <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl md:min-w-[200px]">
                                    <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Pending Dues</p>
                                    <h3 className="text-3xl font-bold font-mono">
                                        ₹{searchedStudent.pendingAmount.toLocaleString()}
                                    </h3>
                                </div>
                            </div>

                            {/* Collection Actions */}
                            {searchedStudent.pendingAmount > 0 ? (
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                                        <IndianRupee className="w-5 h-5 mr-2 text-primary" />
                                        Collect Payment
                                    </h3>
                                    <p className="text-slate-600 mb-6 font-medium text-sm border-l-4 border-amber-400 pl-3 py-1 bg-amber-50">
                                        <strong>Note:</strong> Partial payments are strictly prohibited by school policy.
                                        You must collect the full amount of <strong>₹{searchedStudent.pendingAmount.toLocaleString()}</strong> for <em>{searchedStudent.dueFor}</em>.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <Button onClick={() => setPaymentMode('Cash Received')} variant="outline" className={`border-2 text-slate-700 ${paymentMode === 'Cash Received' ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-primary/5 hover:border-primary/50'}`}>Cash Received</Button>
                                        <Button onClick={() => setPaymentMode('Card POS/UPI')} variant="outline" className={`border-2 text-slate-700 ${paymentMode === 'Card POS/UPI' ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-primary/5 hover:border-primary/50'}`}>Card POS/UPI</Button>
                                        <Button onClick={() => setPaymentMode('Bank Transfer / Cheque')} variant="outline" className={`col-span-2 border-2 text-slate-700 ${paymentMode === 'Bank Transfer / Cheque' ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-primary/5 hover:border-primary/50'}`}>Bank Transfer / Cheque</Button>
                                    </div>

                                    <Button onClick={handleCollect} className="w-full h-12 text-lg shadow-lg bg-emerald-600 hover:bg-emerald-700">
                                        Confirm Collection & Print Receipt
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-emerald-800 mb-2">No Dues Pending</h3>
                                    <p className="text-emerald-600/80 mb-6">This student's ledger is completely cleared for the current academic session.</p>
                                    <Button variant="outline" leftIcon={<Printer className="w-5 h-5" />} className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                                        Reprint Last Receipt
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <Search className="w-12 h-12 mb-4 text-slate-300" />
                            <p>Search for a student using their 11-digit chronological ID <br /> to view dues and process offline collections.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default AdminFinance;
