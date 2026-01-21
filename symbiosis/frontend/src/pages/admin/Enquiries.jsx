import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEnquiries = async () => {
        try {
            const { data } = await api.get('/enquiries');
            setEnquiries(data);
            setLoading(false);
        } catch (error) {
            console.error("Error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/enquiries/${id}`, { status: newStatus });
            setEnquiries(enquiries.map(enq =>
                enq._id === id ? { ...enq, status: newStatus } : enq
            ));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <LoadingSpinner fullScreen={false} />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Admission Enquiries</h1>

            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700 transition-colors">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700/50">
                            {enquiries.map(enquiry => (
                                <tr key={enquiry._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(enquiry.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900 dark:text-white">{enquiry.studentName}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Parent: {enquiry.parentName}</div>
                                        <div className="text-xs text-blue-600 dark:text-blue-400">{enquiry.email}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{enquiry.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {enquiry.grade}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={enquiry.message}>
                                        {enquiry.message}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={enquiry.status}
                                            onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer outline-none transition-colors dark:bg-opacity-20 ${enquiry.status === 'New' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                                                enquiry.status === 'Contacted' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                                                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                }`}
                                        >
                                            <option className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white" value="New">New</option>
                                            <option className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white" value="Contacted">Contacted</option>
                                            <option className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white" value="Resolved">Resolved</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {enquiries.length === 0 && <div className="p-8 text-center text-gray-500 dark:text-gray-400">No enquiries received yet.</div>}
            </div>
        </div>
    );
};

export default Enquiries;
