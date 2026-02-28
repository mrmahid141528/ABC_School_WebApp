import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Plus, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/apiClient';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import InputField from '../components/ui/InputField';
import Modal from '../components/ui/Modal';

const AdminAdmissions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

    // Live Data States
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form States
    const [parentName, setParentName] = useState('');
    const [phone, setPhone] = useState('');
    const [appliedClass, setAppliedClass] = useState('Class 1');

    const fetchLeads = async () => {
        try {
            const res = await api.get('/admissions/inquiry');
            if (res.status === 'success') {
                setLeads(res.data);
            }
        } catch (error) {
            toast.error('Failed to fetch inquiries');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleSaveInquiry = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admissions/inquiry', {
                parentName,
                mobileNumber: phone,
                requestedClass: appliedClass
            });
            if (res.status === 'success') {
                toast.success('Inquiry saved successfully');
                setIsNewLeadModalOpen(false);
                setParentName('');
                setPhone('');
                setAppliedClass('Class 1');
                fetchLeads(); // Refresh list
            }
        } catch (error) {
            toast.error(error.message || 'Failed to save inquiry');
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await api.put(`/admissions/inquiry/${id}`, { status: newStatus });
            if (res.status === 'success') {
                toast.success(`Inquiry marked as ${newStatus}`);
                fetchLeads();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.mobileNumber.includes(searchTerm)
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-slate-500">Loading inquiries...</td>
                                </tr>
                            ) : filteredLeads.map((lead) => (
                                <tr key={lead._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6 text-slate-500 text-sm font-medium whitespace-nowrap">
                                        LD-{lead._id.substring(lead._id.length - 4)}
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-slate-800 whitespace-nowrap">{lead.parentName}</td>
                                    <td className="py-4 px-6 text-slate-600 text-sm whitespace-nowrap">{lead.mobileNumber}</td>
                                    <td className="py-4 px-6 text-slate-600 text-sm whitespace-nowrap">{lead.requestedClass}</td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <Badge variant={
                                            lead.status === 'Approved' || lead.status === 'Form Submitted' ? 'success' :
                                                lead.status === 'Rejected' ? 'danger' :
                                                    lead.status === 'Interview Scheduled' ? 'warning' : 'primary'
                                        }>
                                            {lead.status}
                                        </Badge>
                                    </td>
                                    <td className="py-4 px-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {lead.status === 'New' && (
                                                <>
                                                    <button onClick={() => handleUpdateStatus(lead._id, 'Form Submitted')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark Form Submitted">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleUpdateStatus(lead._id, 'Rejected')} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Reject">
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
                <form className="space-y-4" onSubmit={handleSaveInquiry}>
                    <InputField
                        label="Parent Name"
                        placeholder="e.g. Rahul Kumar"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        required
                    />
                    <InputField
                        label="Parent Mobile Number"
                        placeholder="e.g. 9876543210"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Class Applying For</label>
                        <select
                            value={appliedClass}
                            onChange={(e) => setAppliedClass(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            <option>Class 1</option>
                            <option>Class 2</option>
                            <option>Class 6</option>
                            <option>Class 9</option>
                            <option>Class 11</option>
                        </select>
                    </div>

                    <Button className="w-full mt-4" type="submit">
                        Save Inquiry
                    </Button>
                </form>
            </Modal>

        </div>
    );
};

export default AdminAdmissions;
