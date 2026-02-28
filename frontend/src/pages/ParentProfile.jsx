import React from 'react';
import { User, LogOut, Award, FileText, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/authStore';
import { useNavigate } from 'react-router-dom';

const ActionRow = ({ icon: Icon, label, value, onClick }) => (
    <div
        onClick={onClick}
        className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 cursor-pointer active:bg-slate-50 transition-colors"
    >
        <div className="flex items-center text-slate-700">
            <Icon className="w-5 h-5 mr-3 text-slate-400" />
            <span className="font-medium text-sm">{label}</span>
        </div>
        {value && <span className="text-sm font-semibold text-slate-800">{value}</span>}
    </div>
);

const ParentProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="space-y-6 pb-6">

            {/* Sibling Switcher Header */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Viewing As</p>
                        <h3 className="font-bold text-slate-800">Aryan Sharma</h3>
                    </div>
                </div>
                <button className="flex items-center text-xs text-primary font-semibold bg-primary/5 px-3 py-1.5 rounded-full">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    Switch
                </button>
            </div>

            {/* Academic Documents */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 px-1 mb-3">Academic Reports</h3>
                <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
                    <ActionRow icon={Award} label="Term 1 Report Card" value="View PDF" />
                    <ActionRow icon={FileText} label="Previous Year Result" value="View PDF" />
                </div>
            </div>

            {/* App Settings */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 px-1 mb-3">Settings & Account</h3>
                <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
                    <ActionRow icon={Settings} label="Notifications" />
                    <ActionRow icon={User} label="Parent Details" />
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="w-full flex justify-center items-center py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl active:bg-rose-100 transition-colors"
            >
                <LogOut className="w-5 h-5 mr-2" />
                Secure Logout
            </button>

        </div>
    );
};

export default ParentProfile;
