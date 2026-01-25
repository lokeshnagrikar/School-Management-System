import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiDownload, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentFees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const { data } = await api.get('/fees');
                setFees(data);
            } catch (error) {
                console.error('Failed to fetch fees', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, []);

    const handleDownload = async (id) => {
        try {
            const response = await api.get(`/fees/${id}/invoice`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Invoice.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Download failed', error);
            alert('Failed to download invoice');
        }
    };

    if (loading) return <LoadingSpinner fullScreen={false} />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Fees & Invoices</h1>

            <div className="grid gap-6">
                {fees.map((fee) => (
                    <div key={fee._id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${fee.status === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                                    : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                                }`}>
                                {fee.status === 'Paid' ? <FiCheckCircle size={20} /> : <FiClock size={20} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{fee.type} Fee</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                                <p className="font-medium text-slate-700 dark:text-slate-300 mt-1">₹{fee.amount.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${fee.status === 'Paid'
                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                    : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                }`}>
                                {fee.status}
                            </span>

                            {fee.status === 'Paid' ? (
                                <button
                                    onClick={() => handleDownload(fee._id)}
                                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                                >
                                    <FiDownload className="mr-2" /> Download Receipt
                                </button>
                            ) : (
                                <button className="flex items-center text-sm font-medium text-slate-400 cursor-not-allowed" disabled>
                                    <FiAlertCircle className="mr-2" /> Payment Pending
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {fees.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No fee records found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentFees;
