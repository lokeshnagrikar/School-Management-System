import { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import AuthContext from '../../context/AuthContext';
import { FiCalendar, FiSave, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const MarkAttendance = () => {
    const { user } = useContext(AuthContext);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState({}); // { studentId: status }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // 1. Fetch Teacher's Classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // We'll use the teacher stats or specific endpoint to get classes
                // For now, let's fetch all classes and filter (or backend filters)
                // Actually, let's use the academic key but better if we had specific endpoint
                // Let's assume teacher logic exists to only see their classes in generic lists or we use /api/teacher/classes if it existed
                // Re-using common fetch for now.
                const { data } = await api.get('/academic/classes');
                setClasses(data);
                if (data.length > 0) setSelectedClass(data[0]._id);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // 2. Fetch Students & Existing Attendance when Class/Date changes
    useEffect(() => {
        if (!selectedClass) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // A. Fetch All Students in Class
                const studentsRes = await api.get(`/students?class=${selectedClass}`); // We need to ensure this filters by class param in controller or we filter client side
                // Wait, studentController getAllStudents filters by role. 
                // If I am a teacher, I only get my students. 
                // But I need students specifically for the *selected* class.
                // My getAllStudents modification returns *all* students assigned to me. 
                // I need to filter them by the specific selectedClass here.

                const allMyStudents = studentsRes.data;
                const classStudents = allMyStudents.filter(s => s.class?._id === selectedClass || s.class === selectedClass);
                setStudents(classStudents);

                // B. Fetch Existing Attendance
                const attRes = await api.get(`/attendance/class/${selectedClass}?date=${date}`);
                const existingAtt = attRes.data;

                const initialRecords = {};

                if (existingAtt) {
                    // Pre-fill from usage
                    existingAtt.records.forEach(r => {
                        initialRecords[r.student._id || r.student] = r.status;
                    });
                } else {
                    // Default to 'Present' for all
                    classStudents.forEach(s => {
                        initialRecords[s._id] = 'Present';
                    });
                }
                setAttendanceRecords(initialRecords);

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedClass, date]);


    const handleStatusChange = (studentId, status) => {
        setAttendanceRecords(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setMessage({ type: '', text: '' });
        try {
            const records = Object.keys(attendanceRecords).map(studentId => ({
                student: studentId,
                status: attendanceRecords[studentId]
            }));

            await api.post('/attendance', {
                date,
                classId: selectedClass,
                records
            });

            setMessage({ type: 'success', text: 'Attendance saved successfully!' });
            // Hide message after 3s
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save attendance.' });
        }
        setSubmitting(false);
    };

    if (loading && classes.length === 0) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mark Attendance</h1>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Select Class</label>
                    <select
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 dark:text-white"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Date</label>
                    <input
                        type="date"
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 dark:text-white"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <FiCheckCircle /> {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700 dark:text-gray-200">Student List ({students.length})</h2>
                    <div className="text-sm text-gray-500">Default: Present</div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-slate-700 text-sm text-gray-500 bg-gray-50/50 dark:bg-slate-900/50">
                                <th className="p-4">Roll No</th>
                                <th className="p-4">Name</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {students.map(student => (
                                <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4 text-gray-600 dark:text-gray-400 font-mono text-sm">{student.admissionNumber}</td>
                                    <td className="p-4 font-medium text-gray-800 dark:text-white">{student.name}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            {['Present', 'Absent', 'Late', 'Excused'].map(status => (
                                                <label key={status} className={`
                                                    cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                                                    ${attendanceRecords[student._id] === status
                                                        ? (status === 'Present' ? 'bg-green-100 border-green-200 text-green-700'
                                                            : status === 'Absent' ? 'bg-red-100 border-red-200 text-red-700'
                                                                : 'bg-blue-100 border-blue-200 text-blue-700')
                                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-500 hover:border-gray-300'
                                                    }
                                                `}>
                                                    <input
                                                        type="radio"
                                                        name={`status-${student._id}`}
                                                        value={status}
                                                        checked={attendanceRecords[student._id] === status}
                                                        onChange={() => handleStatusChange(student._id, status)}
                                                        className="hidden" // Hide valid radio, customize label
                                                    />
                                                    {status}
                                                </label>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {students.length > 0 && (
                    <div className="p-6 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100"
                        >
                            {submitting ? <LoadingSpinner size="small" /> : <FiSave />}
                            Save Attendance
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarkAttendance;
