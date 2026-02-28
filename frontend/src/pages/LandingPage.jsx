import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, BarChart3, Shield, Bell, ClipboardCheck, ChevronRight, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
                            <span className="text-white text-xl font-bold font-serif">A</span>
                        </div>
                        <div>
                            <h1 className="text-base font-extrabold text-slate-800 leading-tight">ABC Public School</h1>
                            <p className="text-xs text-slate-400">Est. 2001 · Excellence in Education</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
                        <a href="#about" className="hover:text-primary transition-colors">About</a>
                        <a href="#features" className="hover:text-primary transition-colors">Features</a>
                        <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
                    </nav>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/login?tab=parent')}
                            className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors px-4 py-2"
                        >
                            Parent Portal
                        </button>
                        <button
                            onClick={() => navigate('/login?tab=staff')}
                            className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                        >
                            Staff Login
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary pt-24 pb-32 px-4">
                {/* Decorative Blobs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-white/10">
                        <GraduationCap className="w-4 h-4" />
                        <span>CBSE Affiliated · Batch 2025-26</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                        Shaping Futures,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-emerald-300">One Student at a Time</span>
                    </h2>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
                        ABC Public School delivers world-class education with a modern management system keeping parents, teachers, and administration always connected.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login?tab=parent')}
                            className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-primary-hover transition-all shadow-lg shadow-primary/40 active:scale-95"
                        >
                            Parent Login <ChevronRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => navigate('/login?tab=staff')}
                            className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/20 transition-all active:scale-95 backdrop-blur-sm"
                        >
                            Staff / Admin Login
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-primary text-white py-6">
                <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { value: '1200+', label: 'Students' },
                        { value: '60+', label: 'Expert Faculty' },
                        { value: '25+', label: 'Years of Excellence' },
                        { value: '98%', label: 'Pass Rate (2025)' },
                    ].map((item) => (
                        <div key={item.label}>
                            <p className="text-3xl font-extrabold">{item.value}</p>
                            <p className="text-white/70 text-sm font-medium mt-0.5">{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-4 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-primary text-sm font-bold uppercase tracking-widest mb-2">Smart School ERP</p>
                        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800">Everything Managed, In One Place</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: BookOpen, title: 'Academic Management', desc: 'Classes, subjects, timetables, and term planning — fully organized.' },
                            { icon: ClipboardCheck, title: 'Smart Attendance', desc: 'Teachers mark attendance digitally. Parents receive instant SMS alerts for absences.' },
                            { icon: BarChart3, title: 'Finance Engine', desc: 'Fee invoices, online/offline payments, PDF receipts, and financial analytics.' },
                            { icon: Users, title: 'Parent Portal', desc: 'Parents track attendance, apply for leave, pay fees, and view report cards — from mobile.' },
                            { icon: Bell, title: 'Exam & Results', desc: 'Teachers enter marks, admin publishes results. Students view report cards securely.' },
                            { icon: Shield, title: 'Role-Based Access', desc: 'SuperAdmin, Clerk, Teacher, and Parent all get access only to what they need.' },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-1">{title}</h4>
                                <p className="text-sm text-slate-500">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="about" className="py-20 px-4 bg-slate-900 text-white text-center">
                <div className="max-w-2xl mx-auto">
                    <h3 className="text-3xl font-extrabold mb-4">Ready to Access Your Portal?</h3>
                    <p className="text-white/60 mb-8">Parents use their registered mobile number. Staff use their school-issued credentials.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => navigate('/login?tab=parent')} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-hover transition-colors">
                            Parent Login
                        </button>
                        <button onClick={() => navigate('/login?tab=staff')} className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
                            Staff Login
                        </button>
                    </div>
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="py-16 px-4 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    {[
                        { icon: Phone, label: 'Phone', value: '+91 97332 22558' },
                        { icon: Mail, label: 'Email', value: 'info@abcschool.in' },
                        { icon: MapPin, label: 'Address', value: '123, Education Lane, City - 110001' },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase">{label}</p>
                                <p className="text-slate-700 font-medium">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-100 py-6 px-4 text-center">
                <p className="text-slate-400 text-sm">© {new Date().getFullYear()} ABC Public School. All rights reserved. Built with 💙</p>
            </footer>
        </div>
    );
};

export default LandingPage;
