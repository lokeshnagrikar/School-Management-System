import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiZap, FiLayers } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const FeeStructures = () => {
    const [structures, setStructures] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(null); // ID of structure being processed
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        classId: '',
        type: 'Tuition',
        amount: '',
        description: '',
        academicYear: '2025-2026',
        dueDate: ''
    });

    const fetchData = async () => {
        try {
            const [structRes, classRes] = await Promise.all([
                api.get('/fee-structures'),
                api.get('/academic/classes')
            ]);
            setStructures(structRes.data);
            setClasses(classRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch data', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fee-structures', formData);
            setShowForm(false);
            setFormData({
                classId: '',
                type: 'Tuition',
                amount: '',
                description: '',
                academicYear: '2025-2026',
                dueDate: ''
            });
            fetchData();
        } catch (error) {
            alert('Error creating fee structure');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this Fee Structure?')) {
            try {
                await api.delete(`/fee-structures/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting fee structure');
            }
        }
    };

    const handleGenerate = async (id) => {
        if (window.confirm('Generate invoices for all students in this class?')) {
            setGenerating(id);
            try {
                const { data } = await api.post(`/fee-structures/${id}/generate`);
                alert(data.message);
            } catch (error) {
                alert('Error generating invoices: ' + (error.response?.data?.message || error.message));
            } finally {
                setGenerating(null);
            }
        }
    };

    if (loading) return <LoadingSpinner fullScreen={false} />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fee Structures</h1>
                    <p className="text-slate-500 dark:text-slate-400">Define standard class fees and auto-generate invoices</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <FiPlus className="mr-2" />
                    Add Structure
                </button>
            </div>

            {showForm && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900/30 mb-6">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">New Fee Structure</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Class</label>
                            <select
                                required
                                value={formData.classId}
                                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                            >
                                <option value="">Select Class</option>
                                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                required
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                            >
                                <option value="Tuition">Tuition</option>
                                <option value="Transport">Transport</option>
                                <option value="Library">Library</option>
                                <option value="Exam">Exam</option>
                                <option value="Lab">Lab</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <input
                                type="number"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Academic Year</label>
                            <input
                                type="text"
                                required
                                value={formData.academicYear}
                                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                                className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Due Date</label>
                            <input
                                type="date"
                                required
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full p-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600"
                            />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="w-full p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {structures.map((struct) => (
                    <div key={struct._id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between group hover:border-indigo-300 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <FiLayers className="text-xl" />
                                </div>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {struct.academicYear}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Class {struct.class?.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{struct.type} Fee</p>

                            <div className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">
                                ₹{struct.amount.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Due: {new Date(struct.dueDate).toLocaleDateString()}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <button
                                onClick={() => handleDelete(struct._id)}
                                className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <FiTrash2 />
                            </button>

                            <button
                                onClick={() => handleGenerate(struct._id)}
                                disabled={generating === struct._id}
                                className={`flex items-center px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all ${generating === struct._id
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none'
                                    }`}
                            >
                                {generating === struct._id ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        <FiZap className="mr-1.5" /> Generate Invoices
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeeStructures;
