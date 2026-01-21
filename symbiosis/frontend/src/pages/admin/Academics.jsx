import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiClock, FiBook, FiLayers, FiSave } from 'react-icons/fi';

const Academics = () => {
    const [activeTab, setActiveTab] = useState('classes');
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]); // Need teachers for timetable
    const [loading, setLoading] = useState(true);

    // Timetable State
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSection, setSelectedSection] = useState(''); // New state for section
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [timetablePeriods, setTimetablePeriods] = useState([]);
    const [timetableLoading, setTimetableLoading] = useState(false);

    // Modal States
    const [showClassModal, setShowClassModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);

    // Form States
    const [classData, setClassData] = useState({ name: '', sections: '' });
    const [subjectData, setSubjectData] = useState({ name: '', code: '', description: '' });

    const fetchData = async () => {
        try {
            const [classesRes, subjectsRes, staffRes] = await Promise.all([
                api.get('/academic/classes'),
                api.get('/academic/subjects'),
                api.get('/staff') // Assuming /staff returns all staff, might filter for teachers
            ]);
            setClasses(classesRes.data);
            setSubjects(subjectsRes.data);
            // Filter only teachers from staff
            const teacherList = staffRes.data.filter(s => s.position === 'Teacher');
            setTeachers(teacherList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching academic data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Set default section when class changes
    useEffect(() => {
        if (selectedClassId) {
            const cls = classes.find(c => c._id === selectedClassId);
            if (cls && cls.sections.length > 0) {
                setSelectedSection(cls.sections[0]);
            }
        } else {
            setSelectedSection('');
        }
    }, [selectedClassId, classes]);

    // Fetch Timetable when Class, Section or Day changes
    useEffect(() => {
        const fetchTimetable = async () => {
            if (!selectedClassId || !selectedSection) return;
            setTimetableLoading(true);
            try {
                // Determine Day Index or simply use Day String if backend supports it
                // Endpoint: GET /api/timetable/class/:classId?section=A
                const { data } = await api.get(`/timetable/class/${selectedClassId}?section=${selectedSection}`);

                // Find for selected day
                const daySchedule = data.find(t => t.day === selectedDay);

                if (daySchedule && daySchedule.periods) {
                    // Map to form format
                    setTimetablePeriods(daySchedule.periods.map(p => ({
                        startTime: p.startTime,
                        endTime: p.endTime,
                        subjectId: p.subject?._id || p.subject, // Handle populated vs unpopulated
                        teacherId: p.teacher?._id || p.teacher
                    })));
                } else {
                    // Default empty periods
                    setTimetablePeriods([
                        { startTime: '09:00', endTime: '10:00', subjectId: '', teacherId: '' },
                        { startTime: '10:00', endTime: '11:00', subjectId: '', teacherId: '' },
                        { startTime: '11:30', endTime: '12:30', subjectId: '', teacherId: '' },
                        { startTime: '12:30', endTime: '13:30', subjectId: '', teacherId: '' },
                    ]);
                }
            } catch (error) {
                console.error("Error fetching timetable", error);
            } finally {
                setTimetableLoading(false);
            }
        };

        if (activeTab === 'timetable') {
            fetchTimetable();
        }
    }, [selectedClassId, selectedSection, selectedDay, activeTab]);


    const handleClassSubmit = async (e) => {
        e.preventDefault();
        try {
            const sectionsArray = classData.sections.split(',').map(s => s.trim());
            await api.post('/academic/classes', { ...classData, sections: sectionsArray });
            setShowClassModal(false);
            setClassData({ name: '', sections: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to add class');
        }
    };

    const handleSubjectSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/academic/subjects', subjectData);
            setShowSubjectModal(false);
            setSubjectData({ name: '', code: '', description: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to add subject');
        }
    };

    const handleTimetableSubmit = async () => {
        if (!selectedClassId || !selectedSection) return alert("Select a class and section first");

        try {
            await api.post('/timetable', {
                classId: selectedClassId,
                section: selectedSection, // Include section
                day: selectedDay,
                periods: timetablePeriods.filter(p => p.subjectId && p.teacherId) // Only save complete periods
            });
            alert('Timetable saved successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to save timetable');
        }
    };

    const updatePeriod = (index, field, value) => {
        const newPeriods = [...timetablePeriods];
        newPeriods[index][field] = value;
        setTimetablePeriods(newPeriods);
    };

    const addPeriod = () => {
        setTimetablePeriods([...timetablePeriods, { startTime: '', endTime: '', subjectId: '', teacherId: '' }]);
    };

    const removePeriod = (index) => {
        const newPeriods = timetablePeriods.filter((_, i) => i !== index);
        setTimetablePeriods(newPeriods);
    };

    if (loading) return <LoadingSpinner fullScreen={false} />;

    return (
        <div className="space-y-8">
            {/* Headers */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm transition-colors cursor-default">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Academic Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage school classes, subjects and timetables</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl w-fit border border-gray-100 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('classes')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'classes' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    <FiLayers /> Classes & Subjects
                </button>
                <button
                    onClick={() => setActiveTab('timetable')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'timetable' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                >
                    <FiClock /> Timetable
                </button>
            </div>

            {activeTab === 'classes' ? (
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Classes Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Classes</h3>
                            <button onClick={() => setShowClassModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                                + Add Class
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Sections</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {classes.map(cls => (
                                        <tr key={cls._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cls.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2 flex-wrap">
                                                    {cls.sections.map(sec => (
                                                        <span key={sec} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium border border-indigo-100 dark:border-indigo-800/50">
                                                            {sec}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {classes.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                No classes found. Add one to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Subjects Section */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Subjects</h3>
                            <button onClick={() => setShowSubjectModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                                + Add Subject
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-3">Code</th>
                                        <th className="px-6 py-3">Name</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {subjects.map(sub => (
                                        <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">{sub.code}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{sub.name}</td>
                                        </tr>
                                    ))}
                                    {subjects.length === 0 && (
                                        <tr>
                                            <td colSpan="2" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                No subjects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                /* TIMETABLE TAB */
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Select Class</label>
                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className="w-64 border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">-- Choose Class --</option>
                                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Select Section</label>
                            <select
                                value={selectedSection}
                                onChange={(e) => setSelectedSection(e.target.value)}
                                className="w-32 border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={!selectedClassId}
                            >
                                <option value="">-- Sec --</option>
                                {selectedClassId && classes.find(c => c._id === selectedClassId)?.sections.map(sec => (
                                    <option key={sec} value={sec}>{sec}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Select Day</label>
                            <div className="flex bg-gray-100 dark:bg-slate-900 rounded-lg p-1 overflow-x-auto">
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all ${selectedDay === day ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {selectedClassId ? (
                        timetableLoading ? <LoadingSpinner size="md" /> : (
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                                    Schedule for {selectedDay}
                                </h3>
                                <div className="space-y-3">
                                    {timetablePeriods.map((period, index) => (
                                        <div key={index} className="flex flex-col md:flex-row gap-3 items-end p-4 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700">
                                            <div className="w-full md:w-32">
                                                <label className="text-xs text-gray-400 uppercase font-bold">Start Time</label>
                                                <input
                                                    type="time"
                                                    value={period.startTime}
                                                    onChange={e => updatePeriod(index, 'startTime', e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-800 border dark:border-slate-600 rounded p-2 text-sm text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div className="w-full md:w-32">
                                                <label className="text-xs text-gray-400 uppercase font-bold">End Time</label>
                                                <input
                                                    type="time"
                                                    value={period.endTime}
                                                    onChange={e => updatePeriod(index, 'endTime', e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-800 border dark:border-slate-600 rounded p-2 text-sm text-gray-900 dark:text-white"
                                                />
                                            </div>
                                            <div className="flex-1 w-full">
                                                <label className="text-xs text-gray-400 uppercase font-bold">Subject</label>
                                                <select
                                                    value={period.subjectId}
                                                    onChange={e => updatePeriod(index, 'subjectId', e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-800 border dark:border-slate-600 rounded p-2 text-sm text-gray-900 dark:text-white"
                                                >
                                                    <option value="">-- No Subject --</option>
                                                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                                                </select>
                                            </div>
                                            <div className="flex-1 w-full">
                                                <label className="text-xs text-gray-400 uppercase font-bold">Teacher</label>
                                                <select
                                                    value={period.teacherId}
                                                    onChange={e => updatePeriod(index, 'teacherId', e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-800 border dark:border-slate-600 rounded p-2 text-sm text-gray-900 dark:text-white"
                                                >
                                                    <option value="">-- No Teacher --</option>
                                                    {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.position})</option>)}
                                                </select>
                                            </div>
                                            <button
                                                onClick={() => removePeriod(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between mt-6">
                                    <button
                                        onClick={addPeriod}
                                        className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-sm"
                                    >
                                        + Add Another Period
                                    </button>
                                    <button
                                        onClick={handleTimetableSubmit}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg flex items-center gap-2 transition-all"
                                    >
                                        <FiSave /> Save Schedule
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                            Select a class above to view and edit its timetable.
                        </div>
                    )}
                </div>
            )}

            {/* Class Modal */}
            {showClassModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 transition-colors">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Class</h3>
                        <form onSubmit={handleClassSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Class Name</label>
                                <input type="text" required placeholder="e.g. Grade 10" className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                    value={classData.name} onChange={e => setClassData({ ...classData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Sections (comma separated)</label>
                                <input type="text" required placeholder="e.g. A, B, C" className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                                    value={classData.sections} onChange={e => setClassData({ ...classData, sections: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowClassModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Add Class</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Subject Modal */}
            {showSubjectModal && (
                <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 transition-colors">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Subject</h3>
                        <form onSubmit={handleSubjectSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Subject Name</label>
                                <input type="text" required placeholder="e.g. Mathematics" className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
                                    value={subjectData.name} onChange={e => setSubjectData({ ...subjectData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Subject Code</label>
                                <input type="text" required placeholder="e.g. MATH101" className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
                                    value={subjectData.code} onChange={e => setSubjectData({ ...subjectData, code: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
                                <textarea className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-colors"
                                    value={subjectData.description} onChange={e => setSubjectData({ ...subjectData, description: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowSubjectModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Add Subject</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Academics;
