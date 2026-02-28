import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, Award, Plus, MoreVertical } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/apiClient';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import InputField from '../components/ui/InputField';

const AdminAcademics = () => {
    const [activeTab, setActiveTab] = useState('classes');
    const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);

    // Live Data States
    const [classesList, setClassesList] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form States
    const [resourceType, setResourceType] = useState('Class Section'); // 'Class Section', 'Subject Course'
    const [name, setName] = useState('');
    const [section, setSection] = useState('A');
    const [code, setCode] = useState('');
    const [type, setType] = useState('Core');
    const [assignedClasses, setAssignedClasses] = useState('All');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [classesRes, subjectsRes] = await Promise.all([
                api.get('/academic/classes'),
                api.get('/academic/subjects')
            ]);

            if (classesRes.status === 'success') setClassesList(classesRes.data);
            if (subjectsRes.status === 'success') setSubjectsList(subjectsRes.data);
        } catch (error) {
            toast.error('Failed to load academic data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveResource = async (e) => {
        e.preventDefault();
        try {
            if (!name) return toast.error("Name is required");

            if (resourceType === 'Class Section') {
                const res = await api.post('/academic/classes', { className: name, section });
                if (res.status === 'success') toast.success("Class Section Created.");
            } else if (resourceType === 'Subject Course') {
                const res = await api.post('/academic/subjects', { name, code, type, classes: assignedClasses });
                if (res.status === 'success') toast.success("Subject Course Added.");
            }

            setIsNewClassModalOpen(false);
            setName('');
            setSection('A');
            setCode('');
            fetchData();
        } catch (error) {
            toast.error(error.message || "Failed to create resource");
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Academic Management</h2>
                    <p className="text-slate-500 font-medium">Manage classes, assign subjects, and configure examinations.</p>
                </div>
                <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setIsNewClassModalOpen(true)}>
                    Create New
                </Button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Classes</p>
                        <h4 className="text-2xl font-bold text-slate-800">{classesList.length}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Active Subjects</p>
                        <h4 className="text-2xl font-bold text-slate-800">{subjectsList.length}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Current Session</p>
                        <h4 className="text-2xl font-bold text-slate-800">2026-27</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mr-4">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Upcoming Exams</p>
                        <h4 className="text-2xl font-bold text-slate-800">Term 1</h4>
                    </div>
                </div>
            </div>

            {/* Tabs & Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-100 bg-slate-50/50">
                    <button
                        onClick={() => setActiveTab('classes')}
                        className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'classes' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        Classes & Sections
                    </button>
                    <button
                        onClick={() => setActiveTab('subjects')}
                        className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'subjects' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        Subject Master
                    </button>
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'exams' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        Examinations
                    </button>
                </div>

                {/* Tab Content: Classes */}
                {activeTab === 'classes' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Class ID</th>
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Class Name</th>
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Class Teacher</th>
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap text-center">Students</th>
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Status</th>
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="6" className="py-8 text-center text-slate-500">Loading classes...</td></tr>
                                ) : classesList.map((cls) => (
                                    <tr key={cls.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6 text-slate-500 text-sm font-mono">{cls.id.substring(cls.id.length - 4).toUpperCase()}</td>
                                        <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">{cls.name}</td>
                                        <td className="py-4 px-6 text-slate-600 text-sm whitespace-nowrap flex items-center">
                                            {cls.teacher !== 'Unassigned' ? (
                                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-2">
                                                    {cls.teacher.charAt(0)}
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold mr-2">
                                                    ?
                                                </div>
                                            )}
                                            {cls.teacher}
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 font-semibold text-center">{cls.students}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <Badge variant={cls.status === 'Active' ? 'success' : 'default'}>{cls.status}</Badge>
                                        </td>
                                        <td className="py-4 px-6 whitespace-nowrap text-right">
                                            <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab Content: Subjects */}
                {activeTab === 'subjects' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Subject ID</th>
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Subject Name</th>
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Type</th>
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap">Assigned Classes</th>
                                    <th className="py-4 px-6 font-semibold text-slate-500 text-sm whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="5" className="py-8 text-center text-slate-500">Loading subjects...</td></tr>
                                ) : subjectsList.map((sub) => (
                                    <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6 text-slate-500 text-sm font-mono">{sub.code}</td>
                                        <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">{sub.name}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <Badge variant={sub.type === 'Core' ? 'primary' : 'warning'}>{sub.type}</Badge>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 text-sm whitespace-nowrap">{sub.classes}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-right">
                                            <button className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-primary rounded-lg transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab Content: Exams Placeholder */}
                {activeTab === 'exams' && (
                    <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400">
                        <Award className="w-16 h-16 mb-4 text-slate-200" />
                        <h3 className="text-lg font-bold text-slate-600 mb-2">No Exams Scheduled</h3>
                        <p className="max-w-md mx-auto text-sm">Create an examination term to start generating report cards and entering marks.</p>
                        <Button variant="outline" className="mt-6" leftIcon={<Plus className="w-4 h-4" />}>Create Exam Term</Button>
                    </div>
                )}
            </div>

            {/* New Modal */}
            <Modal isOpen={isNewClassModalOpen} onClose={() => setIsNewClassModalOpen(false)} title="Create New Resource">
                <form className="space-y-4" onSubmit={handleSaveResource}>
                    <p className="text-sm text-slate-500 mb-4">Use this form to define a new Class or Subject in the academic year.</p>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Resource Type</label>
                        <select
                            value={resourceType}
                            onChange={(e) => setResourceType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            <option value="Class Section">Class Section</option>
                            <option value="Subject Course">Subject Course</option>
                            <option value="Examination" disabled>Examination (Coming Soon)</option>
                        </select>
                    </div>

                    <InputField
                        label={resourceType === 'Class Section' ? "Class Name / Grade" : "Subject Name"}
                        placeholder={resourceType === 'Class Section' ? "e.g. Class 11" : "e.g. Mathematics"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    {resourceType === 'Class Section' && (
                        <InputField
                            label="Section"
                            placeholder="e.g. A"
                            maxLength={1}
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            required
                        />
                    )}

                    {resourceType === 'Subject Course' && (
                        <>
                            <InputField
                                label="Subject Code"
                                placeholder="e.g. MATH-101"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                                        <option value="Core">Core</option>
                                        <option value="Elective">Elective</option>
                                    </select>
                                </div>
                                <InputField
                                    label="For Classes"
                                    placeholder="e.g. 1st to 10th"
                                    value={assignedClasses}
                                    onChange={(e) => setAssignedClasses(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <Button type="submit" className="w-full mt-4">
                        Save Resource
                    </Button>
                </form>
            </Modal>

        </div>
    );
};

export default AdminAcademics;
