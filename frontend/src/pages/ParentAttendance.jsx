import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, FilePlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/apiClient';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import InputField from '../components/ui/InputField';

const ParentAttendance = () => {
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [attendanceStats, setAttendanceStats] = useState({
        totalDays: 0, presentDays: 0, absentDays: 0, percentage: 100
    });
    const [recentLeaves, setRecentLeaves] = useState([]);

    const [leaveForm, setLeaveForm] = useState({ date: '', reason: '', note: '' });

    const fetchLeaveData = async () => {
        try {
            const res = await api.get('/parents/leaves');
            if (res.status === 'success') {
                setRecentLeaves(res.data.data.leaves);
                setAttendanceStats(res.data.data.stats);
            }
        } catch (error) {
            toast.error('Failed to load attendance data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveData();
    }, []);

    const handleLeaveSubmit = async (e) => {
        e.preventDefault();
        if (!leaveForm.date || !leaveForm.reason) {
            return toast.error('Date and Reason are required');
        }

        setIsSubmitting(true);
        try {
            const res = await api.post('/academic/leave-request', leaveForm);
            if (res.status === 'success') {
                toast.success('Leave application submitted!');
                setIsLeaveModalOpen(false);
                setLeaveForm({ date: '', reason: '', note: '' });
                fetchLeaveData(); // refresh list
            }
        } catch (error) {
            toast.error(error.message || 'Failed to submit leave');
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-slate-800">Attendance Overview</h2>
            </div>

            {/* Stats Card */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-100 flex items-center justify-center relative">
                        <span className="font-bold text-lg text-emerald-600">{attendanceStats.percentage}%</span>
                        <svg className="absolute inset-0 w-full h-full -rotate-90 text-emerald-500" viewBox="0 0 36 36">
                            <path
                                className="stroke-current"
                                strokeWidth="3"
                                strokeDasharray={`${attendanceStats.percentage}, 100`}
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-slate-500 text-sm">Overall Attendance</p>
                        <p className="text-slate-800 font-bold">{attendanceStats.presentDays} / {attendanceStats.totalDays} Days</p>
                    </div>
                </div>
            </div>

            {/* Leave Application CTA */}
            <Button
                className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
                leftIcon={<FilePlus className="w-5 h-5" />}
                onClick={() => setIsLeaveModalOpen(true)}
            >
                Apply for Leave
            </Button>

            {/* Recent Leaves History */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 px-1 mb-4">Leave History</h3>

                {isLoading ? (
                    <div className="text-center py-6 text-slate-500">Loading...</div>
                ) : recentLeaves.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 bg-white rounded-2xl border border-slate-100">No leaves applied yet.</div>
                ) : (
                    <div className="space-y-3">
                        {recentLeaves.map((leave) => (
                            <div key={leave._id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3
                     ${leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-500' : leave.status === 'Rejected' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                                        <CalendarIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm">{new Date(leave.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</h4>
                                        <p className="text-xs text-slate-500 truncate max-w-[150px]">{leave.reason}</p>
                                    </div>
                                </div>
                                <Badge variant={leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'}>
                                    {leave.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Leave Application Modal */}
            <Modal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                title="Apply for Leave"
                isBottomSheetOnMobile={true}
            >
                <form className="space-y-4" onSubmit={handleLeaveSubmit}>
                    <InputField
                        label="Select Date"
                        type="date"
                        value={leaveForm.date}
                        onChange={(e) => setLeaveForm({ ...leaveForm, date: e.target.value })}
                        required
                    />
                    <InputField
                        label="Reason / Type"
                        placeholder="e.g. Fever, Family Function"
                        value={leaveForm.reason}
                        onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-1.5">Additional Note</label>
                        <textarea
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400"
                            rows={3}
                            placeholder="Provide more details..."
                            value={leaveForm.note}
                            onChange={(e) => setLeaveForm({ ...leaveForm, note: e.target.value })}
                        ></textarea>
                    </div>
                    <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>Submit Request</Button>
                </form>
            </Modal>

        </div>
    );
};

export default ParentAttendance;
