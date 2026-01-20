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
            // Optimistic update or refresh
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
            <h1 className="text-3xl font-bold text-gray-800">Admission Enquiries</h1>

            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {enquiries.map(enquiry => (
                                <tr key={enquiry._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(enquiry.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{enquiry.studentName}</div>
                                        <div className="text-xs text-gray-500">Parent: {enquiry.parentName}</div>
                                        <div className="text-xs text-blue-600">{enquiry.email}</div>
                                        <div className="text-xs text-gray-500">{enquiry.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                        {enquiry.grade}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={enquiry.message}>
                                        {enquiry.message}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={enquiry.status}
                                            onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${enquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                enquiry.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}
                                        >
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {enquiries.length === 0 && <div className="p-8 text-center text-gray-500">No enquiries received yet.</div>}
            </div>
        </div>
    );
};

export default Enquiries;
