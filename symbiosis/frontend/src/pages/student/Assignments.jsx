import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUpload, FiCheck, FiClock } from 'react-icons/fi';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;
            if (!token) return;

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/assignments', config);
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleSubmit = async (id) => {
        // Placeholder for submission logic
        const fileUrl = prompt("Enter file URL (Mock Upload):");
        if (!fileUrl) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;

            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`http://localhost:5000/api/assignments/${id}/submit`, { fileUrl }, config);
            alert('Assignment submitted successfully!');
            fetchAssignments(); // Refresh status
        } catch (error) {
            console.error('Error submitting:', error);
            alert(error.response?.data?.message || 'Submission failed');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Assignments</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {assignments.map(assign => (
                    <div key={assign._id} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between transition-colors">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded uppercase tracking-wider">
                                {assign.subject?.name}
                            </span>
                            <h3 className="font-bold text-lg mt-2 text-gray-800 dark:text-white">{assign.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{assign.description}</p>

                            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <FiClock className="text-orange-500" />
                                <span>Due: {new Date(assign.deadline).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleSubmit(assign._id)}
                            className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
                        >
                            <FiUpload /> Submit Work
                        </button>
                    </div>
                ))}

                {assignments.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400 dark:text-gray-500">
                        <p>No pending assignments!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Assignments;
