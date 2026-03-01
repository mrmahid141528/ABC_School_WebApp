import React, { useState, useEffect } from 'react';
import {
    Shield, ToggleLeft, ToggleRight, ChevronRight,
    RefreshCw, Search, GraduationCap, BookOpen,
    CreditCard, Users, Settings, ChevronDown, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/apiClient';

// ─── MASTER PERMISSIONS LIST ─────────────────────────────────────────────────
const PERMISSION_CATEGORIES = [
    {
        key: 'admissions',
        label: 'Admissions & Student CRM',
        icon: GraduationCap,
        color: 'blue',
        perms: [
            { key: 'adm_view_inquiries', label: 'View Inquiries', desc: 'Website se aayi nayi admission inquiries dekhna' },
            { key: 'adm_update_leads', label: 'Update Leads', desc: 'Inquiries ka status change karna (Follow-up, Interview etc.)' },
            { key: 'adm_process_admission', label: 'Process Admission (Approve)', desc: 'Naye student ka admission approve karna & ID generate karna' },
            { key: 'adm_edit_student', label: 'Edit Student Profile', desc: 'Student ka naam, address, blood group update karna' },
            { key: 'adm_manage_tc', label: 'Manage Migrations / TC', desc: 'Transfer Certificate upload aur manage karna' },
            { key: 'adm_class_upgradation', label: 'Class Upgradation', desc: 'Saare students ko promote karke next class mein bhejana' },
        ]
    },
    {
        key: 'academics',
        label: 'Academic Operations',
        icon: BookOpen,
        color: 'emerald',
        perms: [
            { key: 'aca_mark_attendance', label: 'Mark Student Attendance', desc: 'Class ki rozana attendance lagana' },
            { key: 'aca_view_attendance', label: 'View Attendance History', desc: 'Purani attendance reports dekhna' },
            { key: 'aca_approve_leaves', label: 'Approve Student Leaves', desc: 'Parents ki chhutti applications accept/reject karna' },
            { key: 'aca_enter_marks', label: 'Enter Exam Marks', desc: 'Students ke marks/grades system mein feed karna' },
            { key: 'aca_send_sms', label: 'Send SMS Alerts', desc: 'Absent students ke parents ko bulk SMS bhejna' },
        ]
    },
    {
        key: 'finance',
        label: 'Finance & Accounting',
        icon: CreditCard,
        color: 'violet',
        perms: [
            { key: 'fin_view_records', label: 'View Fee Records', desc: 'Students ki pending aur paid fees ki list dekhna' },
            { key: 'fin_collect_offline', label: 'Collect Offline Fees', desc: 'Cash/Cheque lekar fee Paid mark karna & receipt generate karna' },
            { key: 'fin_send_payment_links', label: 'Send Payment Links', desc: 'Parents ko Razorpay online payment link bhejna' },
            { key: 'fin_daily_expenses', label: 'Enter Daily Expenses', desc: 'School ke roz ke kharche add karna aur bill upload karna' },
            { key: 'fin_generate_payroll', label: 'Generate Payroll', desc: 'Staff attendance ke hisaab se salary calculate karna' },
            { key: 'fin_export_reports', label: 'Export Financial Reports', desc: 'Income, Expense aur GST ka data Excel mein download karna' },
        ]
    },
    {
        key: 'hr',
        label: 'HR & Staff Management',
        icon: Users,
        color: 'amber',
        perms: [
            { key: 'hr_add_staff', label: 'Add New Staff', desc: 'Naye teachers ya clerks ka account banana' },
            { key: 'hr_manage_access', label: 'Manage Staff Access', desc: '⚠️ Kisi bhi staff ki permissions control karna (SuperAdmin only)' },
            { key: 'hr_view_attendance', label: 'View Staff Attendance', desc: 'Teachers/Clerks ki attendance track karna' },
        ]
    },
    {
        key: 'admin',
        label: 'Master Administration & Security',
        icon: Settings,
        color: 'rose',
        perms: [
            { key: 'adm_manage_classes', label: 'Manage Classes & Sections', desc: 'Nayi classes ya sections (A, B, C) create karna' },
            { key: 'adm_global_settings', label: 'Edit Global Settings', desc: 'School ka naam, logo aur T&C/Privacy Policy update karna' },
            { key: 'adm_api_vault', label: 'Manage API Vault', desc: '⚠️ Razorpay aur SMS Gateway ki secret keys update karna' },
            { key: 'adm_publish_results', label: 'Publish Exam Results', desc: 'Marks ke baad results ko public portal par live karna (ON/OFF)' },
        ]
    },
];

// Build flat default permissions object
const buildDefaultPermissions = (role) => {
    const perms = {};
    PERMISSION_CATEGORIES.forEach(cat => {
        cat.perms.forEach(p => {
            // Teachers: only academics by default
            // Clerks: admissions + finance view by default
            if (role === 'Teacher') {
                perms[p.key] = cat.key === 'academics';
            } else if (role === 'Clerk') {
                perms[p.key] = ['adm_view_inquiries', 'fin_view_records', 'fin_collect_offline'].includes(p.key);
            } else {
                perms[p.key] = false;
            }
        });
    });
    return perms;
};

const COLOR_CLASSES = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: 'text-blue-500', active: 'bg-blue-50 border-blue-200' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: 'text-emerald-500', active: 'bg-emerald-50 border-emerald-200' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', icon: 'text-violet-500', active: 'bg-violet-50 border-violet-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: 'text-amber-500', active: 'bg-amber-50 border-amber-200' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200', icon: 'text-rose-500', active: 'bg-rose-50 border-rose-200' },
};

const AdminManageAccess = () => {
    const [staff, setStaff] = useState([]);
    const [selected, setSelected] = useState(null);
    const [permissions, setPermissions] = useState({});
    const [openCats, setOpenCats] = useState({});
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { fetchStaff(); }, []);

    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/staff');
            if (res.status === 'success') {
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
        // Restore saved permissions or use role defaults
        const saved = member.permissions ? Object.fromEntries(Object.entries(member.permissions)) : {};
        const defaults = buildDefaultPermissions(member.role);
        setPermissions({ ...defaults, ...saved });
        // Open all categories by default
        const open = {};
        PERMISSION_CATEGORIES.forEach(c => { open[c.key] = true; });
        setOpenCats(open);
    };

    const togglePerm = (key) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleCategory = (catKey, value) => {
        const cat = PERMISSION_CATEGORIES.find(c => c.key === catKey);
        const updates = {};
        cat.perms.forEach(p => { updates[p.key] = value; });
        setPermissions(prev => ({ ...prev, ...updates }));
    };

    const toggleCatPanel = (catKey) => {
        setOpenCats(prev => ({ ...prev, [catKey]: !prev[catKey] }));
    };

    const getCatEnabled = (cat) => cat.perms.filter(p => permissions[p.key]).length;

    const handleSave = async () => {
        if (!selected) return;
        setIsSaving(true);
        try {
            const res = await api.put(`/admin/staff/${selected._id}/permissions`, { permissions });
            if (res.status === 'success') {
                toast.success(`✅ Permissions updated for ${selected.name}`);
                setStaff(prev => prev.map(s => s._id === selected._id ? { ...s, permissions } : s));
            }
        } catch (err) {
            toast.error(err.message || 'Failed to save permissions');
        } finally {
            setIsSaving(false);
        }
    };

    const filtered = staff.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase())
    );

    const ROLE_COLOR = { Teacher: 'text-emerald-600 bg-emerald-50', Clerk: 'text-amber-600 bg-amber-50' };

    const totalEnabled = Object.values(permissions).filter(Boolean).length;
    const totalPerms = PERMISSION_CATEGORIES.reduce((sum, c) => sum + c.perms.length, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Manage Access</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Control granular module permissions for each staff member</p>
                </div>
                <button onClick={fetchStaff} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Staff List Panel */}
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
                    <div className="divide-y divide-slate-50 max-h-[65vh] overflow-y-auto">
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
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col items-center justify-center p-12 text-center min-h-64">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                <Shield className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-semibold text-slate-600">Select a Staff Member</p>
                            <p className="text-slate-400 text-sm mt-1">Select any staff from the left to manage their granular permissions</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Staff Header */}
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                                        {selected.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{selected.name}</h3>
                                        <p className="text-xs text-slate-400">{selected.role}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-2xl font-bold text-primary">{totalEnabled}</p>
                                    <p className="text-xs text-slate-400">of {totalPerms} permissions</p>
                                </div>
                            </div>

                            {/* Category Sections */}
                            <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-50">
                                {PERMISSION_CATEGORIES.map(cat => {
                                    const c = COLOR_CLASSES[cat.color];
                                    const enabled = getCatEnabled(cat);
                                    const isOpen = openCats[cat.key];
                                    const allOn = enabled === cat.perms.length;

                                    return (
                                        <div key={cat.key}>
                                            {/* Category Header */}
                                            <div className="flex items-center gap-3 px-5 py-3 bg-slate-50/50">
                                                <div className={`w-8 h-8 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                                                    <cat.icon className={`w-4 h-4 ${c.icon}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-bold ${c.text}`}>{cat.label}</p>
                                                    <p className="text-xs text-slate-400">{enabled}/{cat.perms.length} enabled</p>
                                                </div>
                                                {/* Toggle all in category */}
                                                <button
                                                    onClick={() => toggleCategory(cat.key, !allOn)}
                                                    className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all ${allOn ? `${c.bg} ${c.text} ${c.border}` : 'bg-slate-100 text-slate-400 border-slate-200'}`}
                                                >
                                                    {allOn ? 'All ON' : 'All OFF'}
                                                </button>
                                                <button onClick={() => toggleCatPanel(cat.key)} className="text-slate-400 hover:text-slate-600">
                                                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            {/* Permission Toggles */}
                                            {isOpen && (
                                                <div className="px-5 py-2 space-y-1.5">
                                                    {cat.perms.map(perm => (
                                                        <div
                                                            key={perm.key}
                                                            onClick={() => togglePerm(perm.key)}
                                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${permissions[perm.key] ? c.active : 'bg-white border-slate-100'}`}
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-slate-800">{perm.label}</p>
                                                                <p className="text-xs text-slate-400 truncate mt-0.5">{perm.desc}</p>
                                                            </div>
                                                            {permissions[perm.key] ? (
                                                                <ToggleRight className={`w-7 h-7 ${c.text} shrink-0`} />
                                                            ) : (
                                                                <ToggleLeft className="w-7 h-7 text-slate-300 shrink-0" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Save Button */}
                            <div className="p-5 border-t border-slate-100">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full bg-primary text-white py-3 rounded-2xl font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60 text-sm"
                                >
                                    {isSaving ? 'Saving...' : `Save Permissions for ${selected.name}`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminManageAccess;
