import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/apiClient';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/academic/teacher/dashboard');
                if (res.status === 'success') {
                    setClasses(res.data);
                }
            } catch (error) {
                toast.error('Failed to load schedule');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    return (
        <div className="space-y-8">

            {/* Welcome Banner */}
            <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Good Morning, Sir!</h2>
                    <p className="text-white/80 max-w-md">You have 2 pending attendance registers to mark today. First period starts in 15 minutes.</p>
                </div>
                {/* Abstract Pattern */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            </div>

            {/* Classes Grid */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-6">Today's Schedule</h3>
                {isLoading ? (
                    <div className="text-slate-500 flex justify-center py-12">Loading schedule...</div>
                ) : classes.length === 0 ? (
                    <div className="text-slate-500 bg-white p-6 rounded-2xl border border-slate-100 text-center">No classes assigned yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classes.map((cls) => (
                            <div key={cls.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800">{cls.name}</h4>
                                        <p className="text-sm font-medium text-primary mt-1">{cls.subject}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Users className="w-6 h-6" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">{cls.students} Students</span>
                                    {cls.attendanceDone ? (
                                        <span className="flex items-center text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 mr-1" /> Done
                                        </span>
                                    ) : (
                                        <button onClick={() => navigate(`/teacher/attendance?classId=${cls.id}`)} className="text-primary font-semibold hover:text-primary-hover active:scale-95 transition-all bg-primary/5 px-4 py-1.5 rounded-full">
                                            Mark Register
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div>
                <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Tools</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => classes.length > 0 ? navigate(`/teacher/marks?classId=${classes[0].id}`) : null}
                        disabled={classes.length === 0}
                        className="flex items-center px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-700 font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FileText className="w-5 h-5 mr-3 text-primary" />
                        Enter Exam Marks
                    </button>
                </div>
            </div>

        </div>
    );
};

export default TeacherDashboard;
