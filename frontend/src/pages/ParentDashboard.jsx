import React from 'react';
import { CalendarOff, Receipt, Bell, Search, UserCircle, MapPin } from 'lucide-react';
import { useAuth } from '../context/authStore';

const ActionWidget = ({ icon: Icon, title, description, badge, onClick }) => (
    <button
        onClick={onClick}
        className="w-full bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-start text-left active:scale-[0.98] transition-all"
    >
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 mr-4">
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-800 flex items-center">
                {title}
                {badge && <span className="ml-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
            </h4>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{description}</p>
        </div>
    </button>
);

const ParentDashboard = () => {
    const { user } = useAuth();

    // Mock Student Data based on linked parent
    const activeStudent = {
        name: "Aryan Sharma",
        className: "Class 10 - A",
        rollNo: "10A-04",
        avatarUrl: null
    };

    return (
        <div className="space-y-6 pb-6">

            {/* Search & Profile Header */}
            <div className="flex items-center justify-between">
                <div className="relative flex-1 mr-4">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search circulars..."
                        className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 relative shrink-0">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>
            </div>

            {/* Primary ID Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Active Student</span>
                        <h2 className="text-2xl font-bold mt-1">{activeStudent.name}</h2>
                        <p className="text-white/80 text-sm mt-0.5">{activeStudent.className} • Roll {activeStudent.rollNo}</p>
                    </div>

                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
                        {activeStudent.avatarUrl ? (
                            <img src={activeStudent.avatarUrl} alt="student" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                            <UserCircle className="w-8 h-8 text-white/50" />
                        )}
                    </div>
                </div>

                {/* Quick Action in Card */}
                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-white/60">Transport Status</p>
                        <p className="text-sm font-semibold flex items-center mt-0.5">
                            <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                            Bus 4: Near Home Stop
                        </p>
                    </div>
                    <button className="text-xs bg-white text-slate-900 px-3 py-1.5 rounded-lg font-semibold active:scale-95 transition-transform">
                        Track
                    </button>
                </div>
            </div>

            {/* Action Grid */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 px-1">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                    <ActionWidget
                        icon={Receipt}
                        title="Sessional Fee Due"
                        description="₹14,500 due by 10th May"
                        badge={true}
                    />
                    <ActionWidget
                        icon={CalendarOff}
                        title="Apply for Leave"
                        description="Request up to 3 days of medical/casual leave"
                    />
                </div>
            </div>

        </div>
    );
};

export default ParentDashboard;
