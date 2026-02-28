import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/apiClient';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { Save, ArrowLeft } from 'lucide-react';

const TeacherMarks = () => {
    const [searchParams] = useSearchParams();
    const classId = searchParams.get('classId');
    const navigate = useNavigate();

    const [marks, setMarks] = useState({});
    const [students, setStudents] = useState([]);
    const [className, setClassName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Exam name config (can be made dynamic later)
    const examName = 'Mid-Term Examinations';

    useEffect(() => {
        if (!classId) {
            toast.error('No class selected');
            navigate('/teacher/classes');
            return;
        }

        const fetchRoster = async () => {
            try {
                const res = await api.get(`/academic/teacher/roster/${classId}`);
                if (res.status === 'success') {
                    setStudents(res.data.data.students);
                    setClassName(res.data.data.className);

                    // Initialize marks state
                    const initialMarks = {};
                    res.data.data.students.forEach(s => {
                        initialMarks[s.id] = { math: '', science: '' };
                    });
                    setMarks(initialMarks);
                }
            } catch (error) {
                toast.error('Failed to load class roster');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRoster();
    }, [classId, navigate]);

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

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await api.post('/academic/marks', {
                classId,
                examName,
                marks
            });
            if (res.status === 'success') {
                toast.success(res.message || 'Marks saved successfully!');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to save marks');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Loading student roster...</div>;
    }

    return (
        <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/teacher/classes')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{examName}</h2>
                        <p className="text-slate-500 font-medium">{className}</p>
                    </div>
                </div>
                <Button leftIcon={<Save className="w-5 h-5" />} onClick={handleSave} isLoading={isSaving}>
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
