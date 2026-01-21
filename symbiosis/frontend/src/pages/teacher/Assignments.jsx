import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiFileText, FiDownload, FiCheckCircle } from 'react-icons/fi';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        classId: '', // You'll need to fetch classes to populate this
        subjectId: '', // You'll need to fetch subjects
        deadline: '',
        maxMarks: 100,
        fileUrl: ''
    });

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;

            if (!token) {
                console.error('No token found');
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/assignments', config);
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo ? userInfo.token : null;

            if (!token) {
                alert('You are not authenticated');
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/assignments', newAssignment, config);
            setShowCreateModal(false);
            fetchAssignments();
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert('Failed to create assignment');
        }
    };

    // Placeholder for class/subject selection options - in real app, fetch these
    // For now, assuming teacher knows IDs or we'd add fetches for Classes/Subjects here.

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Assignments</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <FiPlus /> Create Assignment
                </button>
            </div>

            <div className="grid gap-4">
                {assignments.map(assign => (
                    <div key={assign._id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border border-gray-100 dark:border-slate-700 flex justify-between items-center transition-colors">
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{assign.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Class: {assign.class?.name || 'N/A'} | Subject: {assign.subject?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-400 mt-1">Deadline: {new Date(assign.deadline).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-3">
                            {/* Link to view submissions would go here */}
                            <button className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">View Submissions</button>
                            <span className={`px-2 py-1 rounded text-xs ${assign.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {assign.isActive ? 'Active' : 'Closed'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl transition-colors">
                        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Create New Assignment</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Assignment Title"
                                className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 p-2 rounded text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                value={newAssignment.title}
                                onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 p-2 rounded text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                value={newAssignment.description}
                                onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                            ></textarea>
                            {/* Inputs for ClassId, SubjectId would go here. For demo purposes, text inputs */}
                            <input
                                type="text"
                                placeholder="Class ID"
                                className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 p-2 rounded text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                value={newAssignment.classId}
                                onChange={e => setNewAssignment({ ...newAssignment, classId: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Subject ID"
                                className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 p-2 rounded text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                value={newAssignment.subjectId}
                                onChange={e => setNewAssignment({ ...newAssignment, subjectId: e.target.value })}
                                required
                            />
                            <input
                                type="datetime-local"
                                className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 p-2 rounded text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                value={newAssignment.deadline}
                                onChange={e => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Max Marks"
                                className="w-full border dark:border-slate-600 bg-white dark:bg-slate-900 p-2 rounded text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                                value={newAssignment.maxMarks}
                                onChange={e => setNewAssignment({ ...newAssignment, maxMarks: e.target.value })}
                                required
                            />
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                                >Cancel</button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                                >Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignments;
