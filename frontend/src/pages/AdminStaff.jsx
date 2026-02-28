import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Users, RefreshCw, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/apiClient';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const ROLE_ICON = { SuperAdmin: ShieldCheck, Teacher: GraduationCap, Clerk: Briefcase };
const ROLE_COLOR = { SuperAdmin: 'danger', Teacher: 'success', Clerk: 'warning' };

const AdminStaff = () => {
    const [staff, setStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', role: 'Teacher', username: '', password: '', mobileNumber: '' });

    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/staff');
            if (res.status === 'success') setStaff(res.data.data);
        } catch {
            toast.error('Failed to load staff accounts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchStaff(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.name || !form.username || !form.password) {
            return toast.error('Name, username, and password are required');
        }
        setIsSubmitting(true);
        try {
            const res = await api.post('/admin/staff', form);
            if (res.status === 'success') {
                toast.success(`Account created for ${form.name}`);
                setIsModalOpen(false);
                setForm({ name: '', role: 'Teacher', username: '', password: '', mobileNumber: '' });
                fetchStaff();
            }
        } catch (err) {
            toast.error(err.message || 'Failed to create account');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Disable account for ${name}?`)) return;
        try {
            await api.delete(`/admin/staff/${id}`);
            toast.success('Staff account disabled');
            setStaff(prev => prev.filter(s => s._id !== id));
        } catch {
            toast.error('Failed to disable account');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Staff Accounts</h2>
                    <p className="text-slate-500 font-medium">Manage login access for all school staff</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchStaff}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" /> Refresh
                    </button>
                    <Button leftIcon={<UserPlus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
                        Add Staff
                    </Button>
                </div>
            </div>

            {/* Staff Table */}
            {isLoading ? (
                <div className="text-center py-12 text-slate-500">Loading staff...</div>
            ) : staff.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 font-medium">No staff accounts yet. Add one to get started.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Name</th>
                                    <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Role</th>
                                    <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Username</th>
                                    <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Mobile</th>
                                    <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map((s) => {
                                    const Icon = ROLE_ICON[s.role] || Briefcase;
                                    return (
                                        <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                                        <Icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{s.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <Badge variant={ROLE_COLOR[s.role] || 'default'}>{s.role}</Badge>
                                            </td>
                                            <td className="py-3 px-6 text-slate-600 text-sm font-mono">{s.username || '—'}</td>
                                            <td className="py-3 px-6 text-slate-500 text-sm">{s.mobileNumber || '—'}</td>
                                            <td className="py-3 px-6">
                                                {s.role !== 'SuperAdmin' && (
                                                    <button
                                                        onClick={() => handleDelete(s._id, s.name)}
                                                        className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Disable Account"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Staff Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Staff Account">
                <form className="space-y-4" onSubmit={handleCreate}>
                    <InputField label="Full Name" placeholder="e.g. Rahul Kumar" required
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            value={form.role}
                            onChange={e => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="Teacher">Teacher</option>
                            <option value="Clerk">Clerk</option>
                            <option value="SuperAdmin">SuperAdmin</option>
                        </select>
                    </div>

                    <InputField label="Username / Email" placeholder="e.g. teacher.rahul@abcschool.in" required
                        value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />

                    <InputField label="Password" type="password" placeholder="Create a strong password" required
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

                    <InputField label="Mobile Number (optional)" type="tel" placeholder="10-digit mobile"
                        value={form.mobileNumber} onChange={e => setForm({ ...form, mobileNumber: e.target.value })} />

                    <p className="text-xs text-slate-400">The staff member can login at <strong>/login</strong> → Staff tab using these credentials.</p>

                    <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>Create Account</Button>
                </form>
            </Modal>
        </div>
    );
};

export default AdminStaff;
