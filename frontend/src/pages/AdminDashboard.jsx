import React, { useState, useEffect } from 'react';
import api from '../services/apiClient';
import { Users, CreditCard, GraduationCap, TrendingUp } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';

// Mock Data
const revenueData = [
    { name: 'Jan', amount: 400000 },
    { name: 'Feb', amount: 300000 },
    { name: 'Mar', amount: 200000 },
    { name: 'Apr', amount: 278000 },
    { name: 'May', amount: 189000 },
    { name: 'Jun', amount: 239000 },
];

const attendanceData = [
    { name: 'Mon', rate: 95 },
    { name: 'Tue', rate: 92 },
    { name: 'Wed', rate: 96 },
    { name: 'Thu', rate: 90 },
    { name: 'Fri', rate: 94 },
];

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
            <div className="flex items-center mt-2 text-sm">
                <span className={`flex items-center font-medium ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(trend)}%
                </span>
                <span className="text-slate-400 ml-2">vs last month</span>
            </div>
        </div>
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Icon className="w-7 h-7" />
        </div>
    </div>
);

const AdminDashboard = () => {
    const [metrics, setMetrics] = useState({
        totalStudents: 0,
        monthlyRevenue: 0,
        attendanceRate: 0,
        newAdmissions: 0,
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await api.get('/admin/metrics');
                if (res.status === 'success') {
                    setMetrics(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard metrics", err);
            }
        };
        fetchMetrics();
    }, []);

    return (
        <div className="space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={metrics.totalStudents.toLocaleString()} icon={Users} trend={+5.4} />
                <StatCard title="Monthly Revenue" value={`₹${(metrics.monthlyRevenue || 0).toLocaleString()}`} icon={CreditCard} trend={+12.5} />
                <StatCard title="Avg Attendance" value={`${metrics.attendanceRate}%`} icon={GraduationCap} trend={-1.2} />
                <StatCard title="New Admissions" value={metrics.newAdmissions.toLocaleString()} icon={Users} trend={+24.0} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Analytics</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <Tooltip
                                    cursor={{ fill: '#F8FAFC' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Trend */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Attendance Trend</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={attendanceData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} domain={['dataMin - 2', 'dataMax + 2']} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={4} dot={{ r: 6, fill: '#10B981', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
