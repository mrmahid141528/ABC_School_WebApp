import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, BookOpen, Settings, LogOut, Bug } from 'lucide-react';
import React from 'react';

import { useAuth } from '../context/authStore';

const DesktopSidebarLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Role-based Navigation Map
    const navMap = {
        SuperAdmin: [
            { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Admissions', path: '/admin/admissions', icon: Users },
            { name: 'Finance', path: '/admin/finance', icon: CreditCard },
            { name: 'Academics', path: '/admin/academics', icon: BookOpen },
            { name: 'Settings', path: '/admin/settings', icon: Settings },
            { name: 'Bug Reports', path: '/admin/bugs', icon: Bug },
        ],
        Clerk: [
            { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
            { name: 'Fee Collection', path: '/staff/fees', icon: CreditCard },
            { name: 'Admissions (View)', path: '/staff/admissions', icon: Users },
        ],
        Teacher: [
            { name: 'My Classes', path: '/teacher/classes', icon: BookOpen },
            { name: 'Attendance', path: '/teacher/attendance', icon: Users },
        ]
    };

    const navItems = navMap[user?.role] || [];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">

            {/* Fixed Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 shadow-xl z-20">

                {/* Brand */}
                <div className="h-16 flex items-center px-6 bg-slate-950/50 border-b border-slate-800 shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-primary/20 shadow-lg">
                        <span className="text-white font-bold text-lg leading-none">A</span>
                    </div>
                    <h2 className="text-white font-semibold tracking-wide truncate">ABC School</h2>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'hover:bg-slate-800 hover:text-white'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-white'}`}
                                    />
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Card & Logout */}
                <div className="p-4 bg-slate-950/30 border-t border-slate-800 shrink-0">
                    <div className="flex items-center w-full">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-medium mr-3 shrink-0">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
                        </div>
                        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

            </aside>

            {/* Main Desktop Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm justify-between sticky top-0 z-10">
                    <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
                    {/* Search or Actions */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">Academic Year 2026-27</span>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default DesktopSidebarLayout;
