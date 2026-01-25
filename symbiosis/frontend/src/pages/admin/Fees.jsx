import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiDollarSign, FiPlus, FiCheck, FiDownload, FiX } from 'react-icons/fi';

const Fees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        type: 'Tuition',
        amount: '',
        dueDate: '',
        academicYear: '2025-2026'
    });

    const fetchFees = async () => {
        try {
            const { data } = await api.get('/fees');
            setFees(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch fees', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
        // Fetch students for dropdown
        const fetchStudents = async () => {
            try {
                const { data } = await api.get('/students');
                setStudents(data);
            } catch (error) {
                console.error('Failed to fetch students', error);
            }
        };
        fetchStudents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/fees', formData);
            setShowModal(false);
            setFormData({
                studentId: '',
                type: 'Tuition',
                amount: '',
                dueDate: '',
                academicYear: '2025-2026'
            });
            fetchFees();
        } catch (error) {
            alert('Error creating invoice');
        }
    };

    const handlePay = async (id) => {
        if (window.confirm('Mark this fee as Paid?')) {
            try {
                await api.put(`/fees/${id}/pay`, { transactionId: 'MANUAL-' + Date.now() });
                fetchFees();
            } catch (error) {
                alert('Error updating fee status');
            }
        }
    };

    const handleDownload = async (id, studentName) => {
        try {
            const response = await api.get(`/fees/${id}/invoice`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${studentName}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
            alert('Failed to download invoice');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Fees...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fee Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track and manage student payments</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <FiPlus className="mr-2" />
                    Create Invoice
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {fees.map((fee) => (
                            <tr key={fee._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-slate-900 dark:text-white">{fee.student?.name || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500">{fee.student?.admissionNumber}</div>
                                </td>
                                <td className="p-4 text-slate-600 dark:text-slate-300">{fee.type}</td>
                                <td className="p-4 font-semibold text-slate-900 dark:text-white">₹{fee.amount.toLocaleString()}</td>
                                <td className="p-4 text-slate-500 dark:text-slate-400">
                                    {new Date(fee.dueDate).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fee.status === 'Paid'
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                        {fee.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {fee.status !== 'Paid' ? (
                                        <button
                                            onClick={() => handlePay(fee._id)}
                                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm"
                                        >
                                            Mark Paid
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDownload(fee._id, fee.student?.name)}
                                            className="flex items-center text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium text-sm"
                                        >
                                            <FiDownload className="mr-1" /> Receipt
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Invoice Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Invoice</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white">
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Student</label>
                                <select
                                    required
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                >
                                    <option value="">Select Student</option>
                                    {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.admissionNumber})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Fee Type</label>
                                <select
                                    required
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Tuition">Tuition</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Library">Library</option>
                                    <option value="Hostel">Hostel</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Amount</label>
                                <input
                                    type="number" required
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Due Date</label>
                                <input
                                    type="date" required
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>

                            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mt-4">
                                Generate Invoice
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fees;
