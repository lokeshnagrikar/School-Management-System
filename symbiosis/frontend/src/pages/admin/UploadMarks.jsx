import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiSave, FiAward, FiBook } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const UploadMarks = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    // Selection State
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [examType, setExamType] = useState('Midterm');
    const [maxMarks, setMaxMarks] = useState(100);

    // Data State
    const [marksData, setMarksData] = useState({}); // { studentId: { marks: 0, remarks: '' } }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const [classRes, subjectRes] = await Promise.all([
                    api.get('/academic/classes'),
                    api.get('/academic/subjects')
                ]);
                setClasses(classRes.data);
                setSubjects(subjectRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching academic data", error);
                setLoading(false);
            }
        };
        fetchInitial();
    }, []);

    const fetchStudents = async (classId) => {
        if (!classId) return;
        setLoading(true);
        try {
            const { data } = await api.get('/students');
            // Logs removed

            const classStudents = data.filter(s => s.class && s.class._id === classId);
            console.log('UploadMarks - Filtered:', classStudents);
            setStudents(classStudents);

            // Initialize empty marks
            const initialMarks = {};
            classStudents.forEach(s => {
                initialMarks[s._id] = { marks: '', remarks: '' };
            });
            setMarksData(initialMarks);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClass) {
            fetchStudents(selectedClass);
        }
    }, [selectedClass]);

    const handleMarkChange = (studentId, field, value) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const records = Object.keys(marksData).map(studentId => ({
                studentId,
                marksObtained: Number(marksData[studentId].marks),
                remarks: marksData[studentId].remarks
            })).filter(r => r.marksObtained !== '' && !isNaN(r.marksObtained)); // Only submit valid entries

            if (records.length === 0) {
                alert("Please enter marks for at least one student.");
                setSubmitting(false);
                return;
            }

            await api.post('/marks', {
                classId: selectedClass,
                subjectId: selectedSubject,
                examType,
                maxMarks: Number(maxMarks),
                records
            });
            alert('Marks uploaded successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to upload marks');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !students.length) return <LoadingSpinner fullScreen={false} />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Upload Marks</h1>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 grid md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Class</label>
                    <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-2 rounded-lg outline-none">
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Subject</label>
                    <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-2 rounded-lg outline-none">
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Exam Type</label>
                    <select value={examType} onChange={e => setExamType(e.target.value)} className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-2 rounded-lg outline-none">
                        <option value="Midterm">Midterm</option>
                        <option value="Final">Final</option>
                        <option value="Unit Test 1">Unit Test 1</option>
                        <option value="Unit Test 2">Unit Test 2</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Max Marks</label>
                    <input type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-2 rounded-lg outline-none" />
                </div>
            </div>

            {/* No Students Message */}
            {selectedClass && students.length === 0 && !loading && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 p-6 rounded-xl text-center">
                    <p className="font-medium">No students found in this class.</p>
                    <p className="text-sm mt-1 opacity-80">Please contact an administrator to add students.</p>
                </div>
            )}

            {selectedClass && students.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Marks Obtained</th>
                                    <th className="px-6 py-4">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {students.map((student) => (
                                    <tr key={student._id}>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {student.name} <span className="text-gray-500 text-xs">({student.admissionNumber})</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                max={maxMarks}
                                                className="border dark:border-slate-600 bg-white dark:bg-slate-900 p-2 rounded w-24 focus:ring-2 focus:ring-purple-500 outline-none"
                                                value={marksData[student._id]?.marks || ''}
                                                onChange={e => handleMarkChange(student._id, 'marks', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                placeholder="Excellent, Needs improvement..."
                                                className="border dark:border-slate-600 bg-white dark:bg-slate-900 p-2 rounded w-full focus:ring-2 focus:ring-purple-500 outline-none"
                                                value={marksData[student._id]?.remarks || ''}
                                                onChange={e => handleMarkChange(student._id, 'remarks', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center gap-2"
                        >
                            {submitting ? <LoadingSpinner size="sm" /> : <FiSave />}
                            Upload Marks
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadMarks;
