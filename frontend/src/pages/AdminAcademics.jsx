import React, { useState } from 'react';
import { BookOpen, Users, Calendar, Award, Plus, MoreVertical } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import InputField from '../components/ui/InputField';

const AdminAcademics = () => {
    const [activeTab, setActiveTab] = useState('classes'); // 'classes', 'subjects', 'exams'
    const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);

    // Mock Data
    const classes = [
        { id: 'CLS-01', name: 'Class 10 - Section A', teacher: 'Priya Sharma', students: 42, status: 'Active' },
        { id: 'CLS-02', name: 'Class 10 - Section B', teacher: 'Rahul Verma', students: 38, status: 'Active' },
        { id: 'CLS-03', name: 'Class 9 - Section A', teacher: 'Anita Desai', students: 45, status: 'Active' },
        { id: 'CLS-04', name: 'Class 8 - Section C', teacher: 'Vikram Singh', students: 40, status: 'Inactive' },
    ];

    const subjects = [
        { id: 'SUB-101', name: 'Mathematics', code: 'MATH', type: 'Core', classes: '6th to 10th' },
        { id: 'SUB-102', name: 'Science', code: 'SCI', type: 'Core', classes: '6th to 10th' },
        { id: 'SUB-103', name: 'English Literature', code: 'ENG', type: 'Core', classes: '1st to 12th' },
        { id: 'SUB-104', name: 'Computer Applications', code: 'COMP', type: 'Elective', classes: '9th to 12th' },
    ];

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
                        <h4 className="text-2xl font-bold text-slate-800">24</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Active Subjects</p>
                        <h4 className="text-2xl font-bold text-slate-800">18</h4>
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
                                {classes.map((cls) => (
                                    <tr key={cls.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6 text-slate-500 text-sm font-mono">{cls.id}</td>
                                        <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">{cls.name}</td>
                                        <td className="py-4 px-6 text-slate-600 text-sm whitespace-nowrap flex items-center">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-2">
                                                {cls.teacher.charAt(0)}
                                            </div>
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
                                {subjects.map((sub) => (
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
                <form className="space-y-4">
                    <p className="text-sm text-slate-500 mb-4">Use this form to define a new Class or Subject in the academic year.</p>
                    <InputField label="Name" placeholder="e.g. Class 11 - Science" />
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Resource Type</label>
                        <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                            <option>Class Section</option>
                            <option>Subject Course</option>
                            <option>Examination</option>
                        </select>
                    </div>
                    <Button className="w-full mt-4" onClick={(e) => { e.preventDefault(); setIsNewClassModalOpen(false); }}>
                        Save Resource
                    </Button>
                </form>
            </Modal>

        </div>
    );
};

export default AdminAcademics;
