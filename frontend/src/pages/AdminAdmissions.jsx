import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Plus, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import InputField from '../components/ui/InputField';
import Modal from '../components/ui/Modal';

const AdminAdmissions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

    // Mock Data
    const leads = [
        { id: 'LD-1001', name: 'Ravi Kumar', phone: '9876543210', class: 'Class 1', status: 'Pending Approval', date: '21 May 2026' },
        { id: 'LD-1002', name: 'Sneha Verma', phone: '8765432109', class: 'Class 6', status: 'Approved', date: '20 May 2026' },
        { id: 'LD-1003', name: 'Amit Shah', phone: '7654321098', class: 'Class 9', status: 'Document Missing', date: '19 May 2026' },
        { id: 'LD-1004', name: 'Karan Singh', phone: '6543210987', class: 'Class 11', status: 'Rejected', date: '18 May 2026' },
    ];

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Admissions CRM</h2>
                    <p className="text-slate-500 font-medium">Manage student leads and enrollment workflows.</p>
                </div>
                <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsNewLeadModalOpen(true)}>
                    New Inquiry
                </Button>
            </div>

            {/* Advanced Data Table Container */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                    <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />} className="w-full md:w-auto">
                        Filters
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Lead ID</th>
                                <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Student Name</th>
                                <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Contact</th>
                                <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Class Applying</th>
                                <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Status</th>
                                <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6 text-slate-500 text-sm font-medium whitespace-nowrap">{lead.id}</td>
                                    <td className="py-4 px-6 font-semibold text-slate-800 whitespace-nowrap">{lead.name}</td>
                                    <td className="py-4 px-6 text-slate-600 text-sm whitespace-nowrap">{lead.phone}</td>
                                    <td className="py-4 px-6 text-slate-600 text-sm whitespace-nowrap">{lead.class}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <Badge variant={
                                            lead.status === 'Approved' ? 'success' :
                                                lead.status === 'Rejected' ? 'danger' :
                                                    lead.status === 'Document Missing' ? 'warning' : 'primary'
                                        }>
                                            {lead.status}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {lead.status === 'Pending Approval' && (
                                                <>
                                                    <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Reject">
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors ml-auto">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredLeads.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No leads found matching your search.
                        </div>
                    )}
                </div>

                {/* Pagination Mock */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
                    <span>Showing 1 to {filteredLeads.length} of {leads.length} entries</span>
                    <div className="flex gap-1">
                        <button disabled className="px-3 py-1 border border-slate-200 rounded-lg opacity-50 cursor-not-allowed bg-white">Prev</button>
                        <button className="px-3 py-1 bg-primary text-white rounded-lg">1</button>
                        <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-100 bg-white">Next</button>
                    </div>
                </div>
            </div>

            {/* New Lead Modal */}
            <Modal isOpen={isNewLeadModalOpen} onClose={() => setIsNewLeadModalOpen(false)} title="New Admission Inquiry">
                <form className="space-y-4">
                    <InputField label="Student Name" placeholder="e.g. Rahul Kumar" />
                    <InputField label="Parent Mobile Number" placeholder="e.g. 9876543210" type="tel" />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Class Applying For</label>
                        <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            <option>Class 1</option>
                            <option>Class 2</option>
                            <option>Class 6</option>
                            <option>Class 9</option>
                            <option>Class 11</option>
                        </select>
                    </div>

                    <Button className="w-full mt-4" onClick={(e) => { e.preventDefault(); setIsNewLeadModalOpen(false); }}>
                        Save Inquiry
                    </Button>
                </form>
            </Modal>

        </div>
    );
};

export default AdminAdmissions;
