import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { FiSave, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const EnterMarks = () => {
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]); // Based on selected class

    const [selectedExam, setSelectedExam] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const [students, setStudents] = useState([]);
    const [marksData, setMarksData] = useState({}); // { studentId: { marksObtained, totalMarks } }

    const [loading, setLoading] = useState(true);
    const [fetchingStudents, setFetchingStudents] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Initial Load (Exams & Classes)
    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const [examsRes, classesRes] = await Promise.all([
                    api.get('/exams'),
                    api.get('/academic/classes') // Assuming teacher can see classes
                ]);
                setExams(examsRes.data);
                if (examsRes.data.length > 0) setSelectedExam(examsRes.data[0]._id);

                setClasses(classesRes.data);
                if (classesRes.data.length > 0) {
                    setSelectedClass(classesRes.data[0]._id);
                    // Set subjects for first class
                    // Ideally class object has subjects populated? 
                    // Or we fetch subjects separately.
                    // For now, let's assume class object returns populated subjects strictly or we fetch class detail.
                    // Let's assume class has `subjects` array populated with IDs or objects.
                    // We need full subject list.
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchInitial();
    }, []);

    // 2. Fetch Subjects when Class Changes
    useEffect(() => {
        if (!selectedClass || classes.length === 0) return;

        const cls = classes.find(c => c._id === selectedClass);
        if (cls) {
            // Check if subjects are populated (objects) or just IDs
            if (cls.subjects && cls.subjects.length > 0) {
                // Adjust based on if populated or not. 
                // Controller says: Class.find().populate('subjects') -> So it is populated objects.
                const loadedSubjects = cls.subjects;
                setSubjects(loadedSubjects);
                if (loadedSubjects.length > 0) setSelectedSubject(loadedSubjects[0]._id);
            } else {
                setSubjects([]);
                setSelectedSubject('');
            }
        }
    }, [selectedClass, classes]);

    // 3. Fetch Students & Existing Marks when criteria ready
    useEffect(() => {
        if (!selectedExam || !selectedClass || !selectedSubject) return;

        const fetchData = async () => {
            setFetchingStudents(true);
            try {
                // Fetch Students of Class
                const studentsRes = await api.get(`/students?class=${selectedClass}`);
                const classStudents = studentsRes.data;
                console.log("Fetched Students for Marks:", classStudents); // Debug log
                setStudents(classStudents);

                // Fetch Existing Results (to pre-fill)
                const resultsRes = await api.get(`/exams/results/class/${selectedClass}/${selectedExam}`);
                const existingResults = resultsRes.data;

                const initialMarks = {};

                // Initialize defaults
                classStudents.forEach(s => {
                    initialMarks[s._id] = { marksObtained: 0, totalMarks: 100 };
                });

                // Override with existing
                existingResults.forEach(r => {
                    const subResult = r.subjects.find(s => s.subject?._id === selectedSubject || s.subject === selectedSubject);
                    if (subResult) {
                        initialMarks[r.student._id || r.student] = {
                            marksObtained: subResult.marksObtained,
                            totalMarks: subResult.totalMarks
                        };
                    }
                });

                setMarksData(initialMarks);
                setFetchingStudents(false);
            } catch (error) {
                console.error(error);
                setFetchingStudents(false);
            }
        };

        fetchData();
    }, [selectedExam, selectedClass, selectedSubject]);

    const handleMarkChange = (studentId, field, value) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: Number(value)
            }
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const marksPayload = Object.keys(marksData).map(studentId => ({
                studentId,
                marksObtained: marksData[studentId].marksObtained,
                totalMarks: marksData[studentId].totalMarks
            }));

            await api.post('/exams/marks', {
                examId: selectedExam,
                classId: selectedClass,
                subjectId: selectedSubject,
                marks: marksPayload
            });

            setMessage({ type: 'success', text: 'Marks saved successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save marks.' });
        }
        setSubmitting(false);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Enter Marks</h1>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Exam Term</label>
                    <select
                        className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        value={selectedExam} onChange={e => setSelectedExam(e.target.value)}
                    >
                        {exams.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Class</label>
                    <select
                        className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                    >
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 dark:text-gray-300">Subject</label>
                    <select
                        className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                        value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
                    >
                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                    </select>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <FiCheckCircle /> {message.text}
                </div>
            )}

            {/* Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold dark:text-white">Student List</h3>
                    <span className="text-sm text-gray-500">Auto-calculated Grades</span>
                </div>

                {fetchingStudents ? (
                    <div className="p-10 flex justify-center"><LoadingSpinner size="small" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-slate-900/50 text-gray-500 text-sm">
                                <tr>
                                    <th className="p-4">Roll No</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4 w-32">Obtained</th>
                                    <th className="p-4 w-32">Total</th>
                                    <th className="p-4 w-20">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {students.map(student => {
                                    const m = marksData[student._id] || { marksObtained: 0, totalMarks: 100 };
                                    const pct = m.totalMarks > 0 ? Math.round((m.marksObtained / m.totalMarks) * 100) : 0;
                                    return (
                                        <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                                            <td className="p-4 font-mono text-sm dark:text-gray-400">{student.admissionNumber}</td>
                                            <td className="p-4 font-medium dark:text-white">{student.name}</td>
                                            <td className="p-4">
                                                <input
                                                    type="number" min="0" max={m.totalMarks}
                                                    className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white text-center font-bold text-blue-600"
                                                    value={m.marksObtained}
                                                    onChange={e => handleMarkChange(student._id, 'marksObtained', e.target.value)}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <input
                                                    type="number" min="1"
                                                    className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400 text-center text-sm"
                                                    value={m.totalMarks}
                                                    onChange={e => handleMarkChange(student._id, 'totalMarks', e.target.value)}
                                                />
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-block w-full text-center py-1 rounded text-xs font-bold ${pct >= 90 ? 'bg-green-100 text-green-700' :
                                                    pct >= 50 ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {pct}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {students.length > 0 && !fetchingStudents && (
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : <><FiSave /> Save All Marks</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnterMarks;
