import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiClient';
import { useAuth } from '../context/authStore';

import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';

const Login = () => {
    const [step, setStep] = useState('phone'); // 'phone' | 'otp'
    const [phone, setPhone] = useState('');
    const [portalType, setPortalType] = useState('parent');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleDemoLogin = (role) => {
        const route = role === 'Parent' ? '/parent/dashboard' :
            role === 'Teacher' ? '/teacher/classes' : '/admin/dashboard';

        login('mock-demo-token-12345', { id: `MOCK-${Date.now()}`, name: `Mock ${role}`, role, phone: '0000000000' });
        toast.success(`Logged in as ${role} (Demo Mode)`);
        navigate(route);
    };

    const handleSendOTP = async (data) => {
        setIsLoading(true);
        try {
            const currentPortalType = data.isStaff ? 'staff' : 'parent';
            const res = await api.post('/auth/send-otp', { mobileNumber: data.phone, portalType: currentPortalType });
            setPhone(data.phone);
            setPortalType(currentPortalType);
            setStep('otp');

            // In dev mode, the backend returns the OTP
            if (res._devOTP) {
                toast.success(`OTP Sent! (Dev: ${res._devOTP})`, { duration: 6000 });
            } else {
                toast.success(res.message || 'OTP Sent successfully!');
            }

        } catch (err) {
            toast.error(err.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (data) => {
        setIsLoading(true);
        try {
            // Use the portalType saved in state during the sendOTP step
            const res = await api.post('/auth/verify-otp', { mobileNumber: phone, otp: data.otp, portalType });

            // Authenticate (Saves to Zustand and HTTP Cookie)
            login(res.token, res.user);
            toast.success('Login Successful');

            // Role-based Redirect
            const role = res.user.role;
            if (role === 'Parent') navigate('/parent/dashboard');
            else if (role === 'Teacher') navigate('/teacher/classes');
            else navigate('/admin/dashboard');

        } catch (err) {
            toast.error(err.message || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 border border-slate-100 relative overflow-hidden">

                {/* Decorative Blob */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center mb-8 isolate">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-primary/30 shadow-lg">
                        <span className="text-white text-2xl font-bold font-serif">A</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 text-sm mt-1">Enter your details to access your portal</p>
                </div>

                {step === 'phone' ? (
                    <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-5 isolate">
                        <InputField
                            label="Phone Number"
                            type="tel"
                            placeholder="e.g. 9876543210"
                            {...register('phone', {
                                required: 'Phone number is required',
                                pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' }
                            })}
                            error={errors.phone?.message}
                        />

                        <div className="flex items-center space-x-2 px-1">
                            <input
                                type="checkbox"
                                id="isStaff"
                                className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                                {...register('isStaff')}
                            />
                            <label htmlFor="isStaff" className="text-sm font-medium text-slate-600 cursor-pointer">
                                I am a Staff Member
                            </label>
                        </div>

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Send OTP
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-5 isolate">
                        <InputField
                            label="6-Digit OTP"
                            type="text"
                            inputMode="numeric"
                            placeholder="• • • • • •"
                            className="tracking-[0.5em] text-center text-xl placeholder:tracking-normal font-semibold"
                            {...register('otp', {
                                required: 'OTP is required',
                                minLength: { value: 6, message: 'Must be 6 digits' },
                                maxLength: { value: 6, message: 'Must be 6 digits' }
                            })}
                            error={errors.otp?.message}
                        />

                        <div className="space-y-3">
                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Verify & Proceed
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full text-sm"
                                onClick={() => setStep('phone')}
                                disabled={isLoading}
                            >
                                Change Phone Number
                            </Button>
                        </div>
                    </form>
                )}

                {/* DEMO BYPASS UI */}
                <div className="mt-8 pt-6 border-t border-slate-100 isolate">
                    <p className="text-xs text-center text-slate-400 mb-3 uppercase tracking-wider font-semibold">Demo Access (UI Review)</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Button type="button" variant="outline" className="text-xs py-2 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => handleDemoLogin('Parent')}>Parent</Button>
                        <Button type="button" variant="outline" className="text-xs py-2 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => handleDemoLogin('Teacher')}>Teacher</Button>
                        <Button type="button" variant="outline" className="text-xs py-2 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => handleDemoLogin('SuperAdmin')}>Super Admin</Button>
                        <Button type="button" variant="outline" className="text-xs py-2 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => handleDemoLogin('Clerk')}>Clerk</Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
