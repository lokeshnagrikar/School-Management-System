import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiCalendar, FiCheckCircle, FiXCircle, FiSave, FiUser } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const MarkAttendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'Present' | 'Absent' }
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        // Fetch Teacher's Assigned Classes (assuming we have an endpoint or derive it)
        // For now, assume fetching all classes, but ideally filtered by teacher assignment
        // OR better: fetch from /teacher/stats or similar if it exposes class list
        // Let's use the generic /academic/classes for now, and filter logic later if needed
        const fetchClasses = async () => {
            try {
                // TODO: Replace with endpoint that gets ONLY teacher's classes
                const { data } = await api.get('/academic/classes');
                setClasses(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching classes", error);
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const fetchStudents = async (classId) => {
        if (!classId) return;
        setLoading(true);
        try {
            // Fetch students for this class
            // We need an endpoint like /students?class=ID
            // Using existing logic or create new query
            const { data } = await api.get('/students'); // This gets ALL, need filtering
            // IMPORTANT: Backend should support filtering. Checking studentController...
            // Assuming /students returns all, filtering client side for MVP or adding query param support

            // Wait, existing studentController.js getStudents might allow filtering?
            // Checking studentController.js logic -> yes it usually does or we need to add it.
            // Let's assume we need to filter client side for safety or update backend.

            // Update: Let's assume /students returns all for now and filter here
            // Logs removed

            // Debugging the filter
            data.forEach(s => {
                if (s.class) {
                    console.log(`Student: ${s.name}, Class: ${JSON.stringify(s.class)}, Match: ${s.class._id === classId}`);
                } else {
                    console.log(`Student: ${s.name} has NO CLASS`);
                }
            });

            const classStudents = data.filter(s => s.class && s.class._id === classId);
            console.log('Filtered Students:', classStudents);
            setStudents(classStudents);

            // Initialize attendance state
            const initialAttendance = {};
            classStudents.forEach(s => {
                initialAttendance[s._id] = 'Present';
            });
            setAttendance(initialAttendance);

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

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);
        try {
            const records = Object.keys(attendance).map(studentId => ({
                studentId,
                status: attendance[studentId]
            }));

            await api.post('/attendance', {
                classId: selectedClass,
                date: date,
                records
            });
            alert('Attendance marked successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to mark attendance');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading && !students.length) return <LoadingSpinner fullScreen={false} />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mark Attendance</h1>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Select Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Select Class</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
                    >
                        <option value="">-- Choose Class --</option>
                        {classes.map(cls => (
                            <option key={cls._id} value={cls._id}>{cls.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* No Students Message */}
            {selectedClass && students.length === 0 && !loading && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 p-6 rounded-xl text-center">
                    <p className="font-medium">No students found in this class.</p>
                    <p className="text-sm mt-1 opacity-80">Please contact an administrator to add students.</p>
                </div>
            )}

            {/* Student List */}
            {selectedClass && students.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">Roll No</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-sm">
                                            {student.admissionNumber || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleStatusChange(student._id, 'Present')}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${attendance[student._id] === 'Present'
                                                        ? 'bg-green-100 text-green-700 ring-2 ring-green-500 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-400'
                                                        }`}
                                                >
                                                    <FiCheckCircle /> Present
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(student._id, 'Absent')}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${attendance[student._id] === 'Absent'
                                                        ? 'bg-red-100 text-red-700 ring-2 ring-red-500 dark:bg-red-900/30 dark:text-red-400'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-400'
                                                        }`}
                                                >
                                                    <FiXCircle /> Absent
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={submitLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitLoading ? <LoadingSpinner size="sm" /> : <FiSave />}
                            Save Attendance
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarkAttendance;
