import React, { useState, useEffect } from 'react';
import { Bug, CheckCircle, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/apiClient';
import Badge from '../components/ui/Badge';

const STATUS_COLORS = {
    Open: 'danger',
    InProgress: 'warning',
    Resolved: 'success',
};

const AdminBugs = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/bugs');
            if (res.status === 'success') setReports(res.data.data);
        } catch {
            toast.error('Failed to load bug reports');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchReports(); }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/bugs/${id}`, { status });
            setReports(prev => prev.map(r => r._id === id ? { ...r, status } : r));
            toast.success(`Ticket marked as ${status}`);
        } catch {
            toast.error('Failed to update status');
        }
    };

    const filtered = filter === 'All' ? reports : reports.filter(r => r.status === filter);
    const counts = {
        All: reports.length,
        Open: reports.filter(r => r.status === 'Open').length,
        InProgress: reports.filter(r => r.status === 'InProgress').length,
        Resolved: reports.filter(r => r.status === 'Resolved').length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Bug Reports</h2>
                    <p className="text-slate-500 font-medium">In-app issue tickets from all users</p>
                </div>
                <button
                    onClick={fetchReports}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {/* Summary Pills */}
            <div className="flex gap-2 flex-wrap">
                {['All', 'Open', 'InProgress', 'Resolved'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filter === tab
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {tab} <span className="ml-1 opacity-70">({counts[tab]})</span>
                    </button>
                ))}
            </div>

            {/* Report Cards */}
            {isLoading ? (
                <div className="text-center py-12 text-slate-500">Loading tickets...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-slate-600 font-medium">No {filter !== 'All' ? filter : ''} tickets found 🎉</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(report => (
                        <div key={report._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${report.status === 'Resolved' ? 'bg-emerald-50 text-emerald-500'
                                            : report.status === 'InProgress' ? 'bg-amber-50 text-amber-500'
                                                : 'bg-rose-50 text-rose-500'
                                        }`}>
                                        {report.status === 'Resolved' ? <CheckCircle className="w-5 h-5" />
                                            : report.status === 'InProgress' ? <Clock className="w-5 h-5" />
                                                : <AlertTriangle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <span className="font-bold text-slate-800">{report.ticketId}</span>
                                            <Badge variant={STATUS_COLORS[report.status]}>{report.status}</Badge>
                                            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{report.issueCategory}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-1">{report.description}</p>
                                        <p className="text-xs text-slate-400 truncate max-w-xs">
                                            {report.reportedBy?.name} ({report.reportedBy?.role}) &bull; {report.pageUrl || 'N/A'} &bull; {new Date(report.createdAt).toLocaleDateString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Actions */}
                                {report.status !== 'Resolved' && (
                                    <div className="flex gap-2 shrink-0">
                                        {report.status === 'Open' && (
                                            <button
                                                onClick={() => handleStatusChange(report._id, 'InProgress')}
                                                className="px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                                            >
                                                Mark In Progress
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleStatusChange(report._id, 'Resolved')}
                                            className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                                        >
                                            Resolve
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBugs;
