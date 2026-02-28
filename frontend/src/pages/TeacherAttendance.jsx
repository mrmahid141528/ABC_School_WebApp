import React, { useState, useEffect } from 'react';
import { Users, Send, Check } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/apiClient';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const TeacherAttendance = () => {
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('classId');
    const navigate = useNavigate();

    const [className, setClassName] = useState('Loading...');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

    useEffect(() => {
        if (!classId) {
            toast.error("No class selected");
            navigate('/teacher');
            return;
        }

        const fetchRoster = async () => {
            try {
                const res = await api.get(`/academic/teacher/roster/${classId}`);
                if (res.status === 'success') {
                    setClassName(res.data.data.className);
                    setStudents(res.data.data.students);
                }
            } catch (error) {
                toast.error('Failed to load roster');
                navigate('/teacher');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoster();
    }, [classId, navigate]);

    const toggleAttendance = (id) => {
        setStudents(students.map(s => s.id === id ? { ...s, isPresent: !s.isPresent } : s));
    };

    const markAllPresent = () => {
        setStudents(students.map(s => ({ ...s, isPresent: true })));
    };

    const absentees = students.filter(s => !s.isPresent);

    const handleConfirmSubmit = async () => {
        try {
            const absenteeIds = absentees.map(a => a.id); // Send studentId
            const date = new Date().toISOString();

            // 1. Submit Attendance
            await api.post('/academic/attendance', { classId, date, absenteeIds });

            // 2. Send SMS (if any absent)
            if (absenteeIds.length > 0) {
                await api.post('/academic/attendance/send-sms', { selectedAbsenteeIds: absenteeIds });
            }

            toast.success("Attendance Submitted! SMS alerts dispatched.");
            setIsSmsModalOpen(false);
            navigate('/teacher');

        } catch (error) {
            toast.error(error.message || "Failed to submit attendance");
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{className}</h2>
                    <p className="text-slate-500 font-medium">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold text-center">
                        <span className="block text-2xl">{students.length - absentees.length}</span>
                        <span className="text-xs uppercase tracking-wider">Present</span>
                    </div>
                    <div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-bold text-center">
                        <span className="block text-2xl">{absentees.length}</span>
                        <span className="text-xs uppercase tracking-wider">Absent</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Student Roster</h3>
                    <button onClick={markAllPresent} className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                        Mark All Present
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        <div className="col-span-full py-12 text-center text-slate-500">Loading roster...</div>
                    ) : students.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500">No students found in this class.</div>
                    ) : students.map(student => (
                        <div
                            key={student.id}
                            onClick={() => toggleAttendance(student.id)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-95 flex flex-col items-center text-center
                  ${student.isPresent ? 'border-emerald-100 bg-emerald-50/50' : 'border-rose-200 bg-rose-50'}
                `}
                        >
                            <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center
                    ${student.isPresent ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-200 text-rose-600'}`}>
                                {student.isPresent ? <Check className="w-6 h-6" /> : <span className="font-bold">A</span>}
                            </div>
                            <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{student.id}</p>
                        </div>
                    ))}
                </div>

                {/* Action Bar */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <Button
                        onClick={() => setIsSmsModalOpen(true)}
                        leftIcon={<Send className="w-4 h-4" />}
                        disabled={absentees.length === 0}
                    >
                        Submit & Send SMS Alerts
                    </Button>
                </div>
            </div>

            {/* SMS Review Modal */}
            <Modal
                isOpen={isSmsModalOpen}
                onClose={() => setIsSmsModalOpen(false)}
                title="Review Absentee Alerts"
            >
                <div className="space-y-4">
                    <div className="bg-amber-50 p-4 rounded-xl text-amber-800 text-sm">
                        You are about to alert the parents of <strong>{absentees.length}</strong> students.
                    </div>

                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                        {absentees.map(a => (
                            <li key={a.id} className="flex items-center text-slate-700 bg-slate-50 p-2 rounded-lg text-sm">
                                <Users className="w-4 h-4 mr-2 text-slate-400" />
                                {a.name} ({a.id})
                            </li>
                        ))}
                    </ul>

                    <div className="pt-4 border-t border-slate-100 flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setIsSmsModalOpen(false)}>Cancel</Button>
                        <Button className="flex-1" onClick={handleConfirmSubmit}>Confirm Send</Button>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default TeacherAttendance;
