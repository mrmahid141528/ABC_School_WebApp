import { Outlet, NavLink } from 'react-router-dom';
import { Home, CalendarOff, Receipt, User } from 'lucide-react';

const MobileBottomNavLayout = () => {
    const navItems = [
        { name: 'Home', path: '/parent/dashboard', icon: Home },
        { name: 'Attendance', path: '/parent/attendance', icon: CalendarOff },
        { name: 'Fees', path: '/parent/fees', icon: Receipt },
        { name: 'Profile', path: '/parent/profile', icon: User },
    ];

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">

            {/* Main Content Area: Scrollable */}
            <main className="flex-1 overflow-y-auto pb-20">
                {/* Top Header Placeholder (Can be dynamic based on route/context) */}
                <header className="bg-primary text-white p-4 sticky top-0 z-40 shadow-sm flex items-center justify-between">
                    <h1 className="font-semibold text-lg">ABC School App</h1>
                </header>

                <div className="p-4">
                    <Outlet />
                </div>
            </main>

            {/* Fixed Bottom Navigation */}
            <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 z-50 md:hidden pb-safe">
                <ul className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <li key={item.name} className="flex-1">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex flex-col items-center justify-center h-full w-full space-y-1 transition-colors
                  ${isActive ? 'text-primary' : 'text-slate-500 hover:text-slate-800'}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={`h-6 w-6 transition-transform ${isActive ? 'fill-primary/20 scale-110' : ''}`}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                        <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                                            {item.name}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

        </div>
    );
};

export default MobileBottomNavLayout;
