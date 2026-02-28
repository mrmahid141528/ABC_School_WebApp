import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/apiClient';
import { useAuth } from '../context/authStore';
import { GraduationCap, Shield, ChevronLeft } from 'lucide-react';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

const Login = () => {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') === 'staff' ? 'staff' : 'parent';
    const [tab, setTab] = useState(initialTab);

    const [step, setStep] = useState('phone'); // 'phone' | 'otp'
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const parentForm = useForm();
    const staffForm = useForm();

    // Reset step when tab changes
    useEffect(() => {
        setStep('phone');
        parentForm.reset();
        staffForm.reset();
    }, [tab]);

    // --- PARENT: Send OTP ---
    const handleSendOTP = async (data) => {
        setIsLoading(true);
        try {
            const res = await api.post('/auth/send-otp', { mobileNumber: data.phone });
            setPhone(data.phone);
            setStep('otp');

            if (res._devOTP) {
                toast.success(`OTP: ${res._devOTP}`, { duration: 8000 });
            } else {
                toast.success(res.message || 'OTP sent to your registered mobile');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // --- PARENT: Verify OTP ---
    const handleVerifyOTP = async (data) => {
        setIsLoading(true);
        try {
            const res = await api.post('/auth/verify-otp', { mobileNumber: phone, otp: data.otp });
            login(res.token, res.user);
            toast.success('Welcome back!');
            navigate('/parent/dashboard');
        } catch (err) {
            toast.error(err.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    // --- STAFF: Username + Password ---
    const handleStaffLogin = async (data) => {
        setIsLoading(true);
        try {
            const res = await api.post('/auth/staff-login', { username: data.username, password: data.password });
            login(res.token, res.user);
            toast.success(`Welcome, ${res.user.name}!`);
            if (res.user.role === 'Teacher') navigate('/teacher/classes');
            else navigate('/admin/dashboard');
        } catch (err) {
            toast.error(err.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
            {/* Back to School Site */}
            <div className="p-4">
                <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 text-sm transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Back to School Website
                </Link>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-sm">

                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/40">
                            <span className="text-white text-2xl font-bold font-serif">A</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-white">ABC Public School</h2>
                        <p className="text-slate-400 text-sm mt-1">Sign in to your portal</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="bg-white/10 p-1 rounded-2xl flex gap-1 mb-6 backdrop-blur-sm border border-white/10">
                        <button
                            onClick={() => setTab('parent')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${tab === 'parent'
                                ? 'bg-primary text-white shadow-md'
                                : 'text-white/60 hover:text-white'
                                }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            Parent Login
                        </button>
                        <button
                            onClick={() => setTab('staff')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${tab === 'staff'
                                ? 'bg-slate-100 text-slate-900 shadow-md'
                                : 'text-white/60 hover:text-white'
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            Staff / Admin
                        </button>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">

                        {/* PARENT LOGIN */}
                        {tab === 'parent' && (
                            <>
                                {step === 'phone' ? (
                                    <form onSubmit={parentForm.handleSubmit(handleSendOTP)} className="space-y-5">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">Parent Portal</h3>
                                            <p className="text-sm text-slate-500">Enter your registered mobile number to receive an OTP</p>
                                        </div>
                                        <InputField
                                            label="Registered Mobile Number"
                                            type="tel"
                                            placeholder="e.g. 9876543210"
                                            {...parentForm.register('phone', {
                                                required: 'Mobile number is required',
                                                pattern: { value: /^[0-9]{10}$/, message: 'Must be a valid 10-digit number' }
                                            })}
                                            error={parentForm.formState.errors.phone?.message}
                                        />
                                        <Button type="submit" className="w-full" isLoading={isLoading}>
                                            Send OTP
                                        </Button>
                                        <p className="text-xs text-center text-slate-400">
                                            Only registered parent numbers can login. Contact school admin if your number is not registered.
                                        </p>
                                    </form>
                                ) : (
                                    <form onSubmit={parentForm.handleSubmit(handleVerifyOTP)} className="space-y-5">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-1">Verify OTP</h3>
                                            <p className="text-sm text-slate-500">Enter the 6-digit OTP sent to <strong>{phone}</strong></p>
                                        </div>
                                        <InputField
                                            label="6-Digit OTP"
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="• • • • • •"
                                            className="tracking-[0.5em] text-center text-xl placeholder:tracking-normal font-semibold"
                                            {...parentForm.register('otp', {
                                                required: 'OTP is required',
                                                minLength: { value: 6, message: 'Must be 6 digits' },
                                                maxLength: { value: 6, message: 'Must be 6 digits' }
                                            })}
                                            error={parentForm.formState.errors.otp?.message}
                                        />
                                        <div className="space-y-3">
                                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                                Verify & Enter Portal
                                            </Button>
                                            <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => setStep('phone')} disabled={isLoading}>
                                                ← Change Number
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}

                        {/* STAFF LOGIN */}
                        {tab === 'staff' && (
                            <form onSubmit={staffForm.handleSubmit(handleStaffLogin)} className="space-y-5">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">Staff Portal</h3>
                                    <p className="text-sm text-slate-500">Use your school-issued username and password</p>
                                </div>
                                <InputField
                                    label="Username / Email"
                                    type="text"
                                    placeholder="e.g. yourname@abcschool.in"
                                    {...staffForm.register('username', { required: 'Username is required' })}
                                    error={staffForm.formState.errors.username?.message}
                                />
                                <InputField
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••••"
                                    {...staffForm.register('password', { required: 'Password is required' })}
                                    error={staffForm.formState.errors.password?.message}
                                />
                                <Button type="submit" className="w-full" isLoading={isLoading}>
                                    Sign In to Admin Panel
                                </Button>
                                <p className="text-xs text-center text-slate-400">
                                    Accounts are created by the Super Admin. Contact administration if you don't have access.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
