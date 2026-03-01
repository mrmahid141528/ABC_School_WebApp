import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, CreditCard, BookOpen, Settings,
    LogOut, Bug, UserCog, Shield, Menu, X
} from 'lucide-react';
import React from 'react';
import { useAuth } from '../context/authStore';

const DesktopSidebarLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navMap = {
        SuperAdmin: [
            { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Admissions', path: '/admin/admissions', icon: Users },
            { name: 'Finance', path: '/admin/finance', icon: CreditCard },
            { name: 'Academics', path: '/admin/academics', icon: BookOpen },
            { name: 'Staff Accounts', path: '/admin/staff', icon: UserCog },
            { name: 'Manage Access', path: '/admin/manage-access', icon: Shield },
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

    const SidebarContent = () => (
        <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shadow-xl">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 bg-slate-950/50 border-b border-slate-800 shrink-0">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3 shadow-primary/20 shadow-lg">
                    <span className="text-white font-bold text-lg leading-none">A</span>
                </div>
                <h2 className="text-white font-semibold tracking-wide truncate">ABC School</h2>
                {/* Close button on mobile */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="ml-auto md:hidden text-slate-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group text-sm
                ${isActive
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'hover:bg-slate-800 hover:text-white text-slate-400'}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    className={`mr-3 h-4.5 w-4.5 shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-white'}`}
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
                    <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold mr-3 shrink-0 text-sm">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.role}</p>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Logout">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar Drawer */}
            <div className={`fixed inset-y-0 left-0 z-40 md:hidden transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </div>

            {/* Desktop Fixed Sidebar */}
            <div className="hidden md:flex shrink-0">
                <SidebarContent />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto min-w-0">
                {/* Top Navbar */}
                <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 shadow-sm justify-between sticky top-0 z-10">
                    {/* Mobile hamburger */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 md:hidden">
                            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                                <span className="text-white text-xs font-bold">A</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-800">ABC School</span>
                        </div>
                        <h1 className="hidden md:block text-lg font-semibold text-slate-800">Admin Panel</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 hidden sm:block">AY 2026-27</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DesktopSidebarLayout;
