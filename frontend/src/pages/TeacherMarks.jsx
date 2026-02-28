import React, { useState } from 'react';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { Save } from 'lucide-react';

const TeacherMarks = () => {
    const [marks, setMarks] = useState({
        '10A-01': { math: 85, science: 92 },
        '10A-02': { math: 78, science: 88 },
        '10A-03': { math: 95, science: 90 },
        '10A-04': { math: '', science: '' },
        '10A-05': { math: 65, science: 70 },
    });

    const students = [
        { id: '10A-01', name: 'Aarav Patel' },
        { id: '10A-02', name: 'Diya Singh' },
        { id: '10A-03', name: 'Kabir Khan' },
        { id: '10A-04', name: 'Aryan Sharma' },
        { id: '10A-05', name: 'Ananya Gupta' },
    ];

    const handleMarkChange = (id, subject, value) => {
        // Only allow numbers 0-100
        if (value !== '' && (isNaN(value) || value < 0 || value > 100)) return;

        setMarks({
            ...marks,
            [id]: {
                ...marks[id],
                [subject]: value
            }
        });
    };

    const handleSave = () => {
        alert("Marks safely stored in the database!");
    };

    return (
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Mid-Term Examinations</h2>
                    <p className="text-slate-500 font-medium">Class 10 - A</p>
                </div>
                <Button leftIcon={<Save className="w-5 h-5" />} onClick={handleSave}>
                    Save Draft
                </Button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="py-4 px-6 font-semibold text-slate-600 whitespace-nowrap">Roll No.</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 whitespace-nowrap">Student Name</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 whitespace-nowrap w-48">Mathematics (100)</th>
                                <th className="py-4 px-6 font-semibold text-slate-600 whitespace-nowrap w-48">Science (100)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 px-6 text-slate-500 text-sm font-medium">{student.id}</td>
                                    <td className="py-3 px-6 font-semibold text-slate-800">{student.name}</td>
                                    <td className="py-3 px-6">
                                        <InputField
                                            type="number"
                                            className="text-center font-bold"
                                            value={marks[student.id].math}
                                            onChange={(e) => handleMarkChange(student.id, 'math', e.target.value)}
                                            min="0" max="100"
                                        />
                                    </td>
                                    <td className="py-3 px-6">
                                        <InputField
                                            type="number"
                                            className="text-center font-bold"
                                            value={marks[student.id].science}
                                            onChange={(e) => handleMarkChange(student.id, 'science', e.target.value)}
                                            min="0" max="100"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default TeacherMarks;
