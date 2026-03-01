import React, { useState, useEffect } from 'react';
import { Shield, ToggleLeft, ToggleRight, ChevronRight, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/apiClient';

// Available work-category modules
const MODULES = [
    { key: 'admissions', label: 'Admissions', desc: 'View & manage student admissions' },
    { key: 'finance', label: 'Finance', desc: 'Fee collection, invoices & revenue' },
    { key: 'academics', label: 'Academics', desc: 'Classes, subjects, attendance & marks' },
    { key: 'settings', label: 'Settings', desc: 'School settings & integrations' },
    { key: 'bugs', label: 'Bug Reports', desc: 'View & manage bug tickets' },
    { key: 'staff', label: 'Staff Management', desc: 'Create & manage staff accounts' },
];

const AdminManageAccess = () => {
    const [staff, setStaff] = useState([]);
    const [selected, setSelected] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/staff');
            if (res.status === 'success') {
                // Filter out SuperAdmin (they always have full access)
                setStaff(res.data.data.filter(s => s.role !== 'SuperAdmin'));
            }
        } catch {
            toast.error('Failed to load staff');
        } finally {
            setIsLoading(false);
        }
    };

    const selectStaff = (member) => {
        setSelected(member);
        // Initialize permissions from stored data or defaults
        const defaultPerms = {};
        MODULES.forEach(m => {
            defaultPerms[m.key] = member.permissions?.[m.key] ?? (member.role === 'Teacher' ? ['academics'].includes(m.key) : ['admissions', 'finance'].includes(m.key));
        });
        setPermissions(defaultPerms);
    };

    const togglePermission = (key) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        if (!selected) return;
        setIsSaving(true);
        try {
            // NOTE: Backend endpoint for permissions to be wired when ready
            // await api.put(`/admin/staff/${selected._id}/permissions`, { permissions });
            toast.success(`Permissions updated for ${selected.name}`);
            setStaff(prev => prev.map(s =>
                s._id === selected._id ? { ...s, permissions } : s
            ));
        } catch {
            toast.error('Failed to save permissions');
        } finally {
            setIsSaving(false);
        }
    };

    const filtered = staff.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase())
    );

    const ROLE_COLOR = { Teacher: 'text-emerald-600 bg-emerald-50', Clerk: 'text-amber-600 bg-amber-50' };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Manage Access</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Control which modules each staff member can access</p>
                </div>
                <button onClick={fetchStaff} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Staff List */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search staff..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 text-center text-slate-400 text-sm">Loading staff...</div>
                        ) : filtered.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">No staff found</div>
                        ) : (
                            filtered.map(member => (
                                <button
                                    key={member._id}
                                    onClick={() => selectStaff(member)}
                                    className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left ${selected?._id === member._id ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 text-sm truncate">{member.name}</p>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLOR[member.role] || 'text-slate-500 bg-slate-100'}`}>
                                            {member.role}
                                        </span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Permissions Panel */}
                <div className="lg:col-span-2">
                    {!selected ? (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                <Shield className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-semibold text-slate-600">Select a Staff Member</p>
                            <p className="text-slate-400 text-sm mt-1">Click on any staff from the left panel to manage their access permissions</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
                            {/* Selected Staff Header */}
                            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {selected.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{selected.name}</h3>
                                    <p className="text-sm text-slate-400">{selected.role} · {selected.username || selected.mobileNumber || '—'}</p>
                                </div>
                            </div>

                            {/* Module Toggles */}
                            <div className="p-6 space-y-3">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Work Categories / Module Access</p>
                                {MODULES.map(mod => (
                                    <div
                                        key={mod.key}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${permissions[mod.key] ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-100'}`}
                                        onClick={() => togglePermission(mod.key)}
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">{mod.label}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{mod.desc}</p>
                                        </div>
                                        {permissions[mod.key] ? (
                                            <ToggleRight className="w-8 h-8 text-primary shrink-0" />
                                        ) : (
                                            <ToggleLeft className="w-8 h-8 text-slate-300 shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Save Button */}
                            <div className="p-6 pt-0">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60"
                                >
                                    {isSaving ? 'Saving...' : 'Save Permissions'}
                                </button>
                                <p className="text-xs text-slate-400 text-center mt-2">
                                    Backend enforcement coming soon — UI ready for integration
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminManageAccess;
