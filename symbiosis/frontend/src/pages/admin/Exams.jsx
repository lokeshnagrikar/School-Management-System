import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPlus, FiCalendar, FiCheck } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [classes, setClasses] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        academicYear: '2023-2024',
        term: 'Term 1',
        startDate: '',
        endDate: '',
        classes: [] // IDs
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [examsRes, classesRes] = await Promise.all([
                    api.get('/exams'),
                    api.get('/academic/classes')
                ]);
                setExams(examsRes.data);
                setClasses(classesRes.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // If no classes selected, select all by default? 
            // Or let user select. For now, strict.
            await api.post('/exams', formData);
            setShowModal(false);
            // Refresh
            const { data } = await api.get('/exams');
            setExams(data);
            setFormData({ name: '', academicYear: '2023-2024', term: 'Term 1', startDate: '', endDate: '', classes: [] });
        } catch (error) {
            alert('Failed to create exam');
        }
    };

    const toggleClassSelection = (classId) => {
        setFormData(prev => {
            const isSelected = prev.classes.includes(classId);
            if (isSelected) {
                return { ...prev, classes: prev.classes.filter(id => id !== classId) };
            } else {
                return { ...prev, classes: [...prev.classes, classId] };
            }
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Exam Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
                >
                    <FiPlus /> New Exam Term
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map(exam => (
                    <div key={exam._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{exam.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{exam.term} • {exam.academicYear}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${exam.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {exam.isActive ? 'Active' : 'Archived'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                            <FiCalendar />
                            {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
                        </div>
                        <div className="border-t border-gray-100 dark:border-slate-700 pt-4 mt-2">
                            <p className="text-xs text-gray-500 mb-2">Participating Classes:</p>
                            <div className="flexflex-wrap gap-1">
                                {exam.classes.slice(0, 5).map(c => <span key={c} className="text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded mr-1">Class ID {c.substr(-4)}</span>)}
                                {exam.classes.length > 5 && <span className="text-xs text-gray-400">+{exam.classes.length - 5} more</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Create New Exam</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text" placeholder="Exam Name (e.g. Final Exam 2024)" required
                                className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                    value={formData.term} onChange={e => setFormData({ ...formData, term: e.target.value })}
                                >
                                    <option>Term 1</option>
                                    <option>Term 2</option>
                                    <option>Final</option>
                                </select>
                                <input
                                    type="text" placeholder="Academic Year" required
                                    className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                    value={formData.academicYear} onChange={e => setFormData({ ...formData, academicYear: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="date" required
                                    className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                    value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                />
                                <input
                                    type="date" required
                                    className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                                    value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-2 dark:text-gray-300">Select Classes</label>
                                <div className="max-h-32 overflow-y-auto border p-2 rounded dark:border-slate-700">
                                    {classes.map(c => (
                                        <div key={c._id} className="flex items-center gap-2 mb-1">
                                            <input
                                                type="checkbox"
                                                checked={formData.classes.includes(c._id)}
                                                onChange={() => toggleClassSelection(c._id)}
                                            />
                                            <span className="dark:text-gray-300">{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded font-medium">Create Exam</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;
