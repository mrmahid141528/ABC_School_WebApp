import React, { useState } from 'react';
import { Lock, Server, Shield, Database, Save, EyeOff, Eye } from 'lucide-react';
import Button from '../components/ui/Button';

const SectionHeader = ({ icon: Icon, title, description }) => (
    <div className="mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center text-slate-800 mb-1">
            <Icon className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <p className="text-sm text-slate-500">{description}</p>
    </div>
);

const AdminSettings = () => {
    const [showRzKey, setShowRzKey] = useState(false);
    const [showSmsKey, setShowSmsKey] = useState(false);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800">System Settings & Vault</h2>
                <p className="text-slate-500 font-medium">Configure global school parameters and manage encrypted API integrations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* API Credentials Vault */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <SectionHeader
                        icon={Shield}
                        title="API Credential Vault"
                        description="These keys are encrypted in the database using AES-256 GCM."
                    />

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                                Razorpay Secret Key
                                <button onClick={() => setShowRzKey(!showRzKey)} className="text-slate-400 hover:text-primary transition-colors">
                                    {showRzKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type={showRzKey ? "text" : "password"}
                                    defaultValue="rzp_test_1234567890abcdef"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                                Fast2SMS API Key
                                <button onClick={() => setShowSmsKey(!showSmsKey)} className="text-slate-400 hover:text-primary transition-colors">
                                    {showSmsKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type={showSmsKey ? "text" : "password"}
                                    defaultValue="f2s_prod_9876543210zyxwvuts"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                                />
                            </div>
                        </div>

                        <Button className="w-full mt-2" leftIcon={<Save className="w-4 h-4" />}>
                            Save Encrypted Keys
                        </Button>
                    </div>
                </div>

                {/* Global Flags */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <SectionHeader
                        icon={Server}
                        title="Global Infrastructure Settings"
                        description="Toggle core behaviors of the ERP instance."
                    />

                    <div className="space-y-4">

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Allow Admissions</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Accept new inquiry submissions from the public website.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">Force Maintenance Mode</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Locks out Parents & Teachers. Only SuperAdmins can login.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                            </label>
                        </div>

                    </div>
                </div>

                {/* Disaster Recovery Box */}
                <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-lg overflow-hidden relative">
                    <Database className="w-64 h-64 absolute -right-10 opacity-5 pointer-events-none" />
                    <div className="relative z-10 mb-6 md:mb-0 md:mr-8 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-2 flex items-center justify-center md:justify-start">
                            <Database className="w-6 h-6 mr-2 text-primary" />
                            Disaster Recovery & Backups
                        </h3>
                        <p className="text-slate-400 text-sm max-w-xl">
                            The cron service automatically dumps a full `mongodump` BSON backup of the entire ERP every night at 2:00 AM server time. You can also trigger a manual backup snapshot right now.
                        </p>
                    </div>

                    <Button variant="outline" className="relative z-10 bg-white/10 hover:bg-white text-white hover:text-slate-900 border-white/20 whitespace-nowrap shadow-xl backdrop-blur-md">
                        Trigger Manual Backup
                    </Button>
                </div>

            </div>

        </div>
    );
};

export default AdminSettings;
