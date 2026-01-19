import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiEdit2, FiSearch, FiUser, FiInfo } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        admissionNumber: '',
        classId: '', // We need the ID for the backend link
        section: '',
        parentName: '',
        phone: '',
        password: 'password123',
        status: 'Active'
    });

    // Fetch Initial Data
    const fetchData = async () => {
        try {
            const [studentsRes, classesRes] = await Promise.all([
                api.get('/students'),
                api.get('/academic/classes')
            ]);
            setStudents(studentsRes.data.students || studentsRes.data); // Handle potential pagination wrapper
            setClasses(classesRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter Logic
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handlers
    const handleOpenAdd = () => {
        setIsEditMode(false);
        setFormData({
            name: '', email: '', admissionNumber: '', classId: '', section: '',
            parentName: '', phone: '', password: 'password123', status: 'Active'
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (student) => {
        setIsEditMode(true);
        setCurrentId(student._id);
        setFormData({
            name: student.name,
            email: student.email,
            admissionNumber: student.admissionNumber || '',
            classId: student.class?._id || '', // Start with ID if object populated
            section: student.section || '',
            parentName: student.parentName || '',
            phone: student.phone || '',
            password: '', // Don't show password on edit
            status: student.status || 'Active'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this student? This will also delete their user account.')) {
            try {
                await api.delete(`/students/${id}`);
                setStudents(students.filter(s => s._id !== id));
            } catch (error) {
                alert('Failed to delete student.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Backend expects 'class' as the ID field in the model likely
            const payload = { ...formData, class: formData.classId };

            if (isEditMode) {
                // For edit, we might use PUT
                const { password, ...updateData } = payload; // Exclude password if empty during edit
                await api.put(`/students/${currentId}`, updateData);
            } else {
                await api.post('/students', payload);
            }
            setIsModalOpen(false);
            fetchData(); // Refresh to get populated fields
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Operation failed. Check if email/admission number is unique.';
            alert(`Error: ${message}`);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Directory</h1>
                    <p className="text-gray-500">Manage admission details and profiles</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all hover:scale-105">
                        <FiPlus /> Add Student
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Student Info</th>
                                <th className="px-6 py-4">Class/Section</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {filteredStudents.map((student) => (
                                    <motion.tr
                                        key={student._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{student.name}</div>
                                                    <div className="text-xs text-gray-500">Adm: {student.admissionNumber || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                                                {student.class?.name || 'Unassigned'} - {student.section}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 text-xs">P: {student.parentName}</div>
                                            <div className="text-gray-500 text-xs">{student.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleOpenEdit(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                                    <FiEdit2 />
                                                </button>
                                                <button onClick={() => handleDelete(student._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {filteredStudents.length === 0 && <div className="p-8 text-center text-gray-500">No students found matching your search.</div>}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">{isEditMode ? 'Edit Student' : 'Add New Student'}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Full Name</label>
                                        <input type="text" required className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Admission No</label>
                                        <input type="text" required className="w-full border rounded-lg px-3 py-2" value={formData.admissionNumber} onChange={e => setFormData({ ...formData, admissionNumber: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Class</label>
                                        <select required className="w-full border rounded-lg px-3 py-2" value={formData.classId} onChange={e => setFormData({ ...formData, classId: e.target.value })}>
                                            <option value="">Select Class</option>
                                            {classes.map(cls => (
                                                <option key={cls._id} value={cls._id}>{cls.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Section</label>
                                        <select required className="w-full border rounded-lg px-3 py-2" value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })}>
                                            <option value="">Select Section</option>
                                            {/* Ideally this should filter based on selected class, but simple for now */}
                                            {['A', 'B', 'C', 'D'].map(sec => <option key={sec} value={sec}>{sec}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Parent Name</label>
                                        <input type="text" required className="w-full border rounded-lg px-3 py-2" value={formData.parentName} onChange={e => setFormData({ ...formData, parentName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone</label>
                                        <input type="tel" required className="w-full border rounded-lg px-3 py-2" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email (Username)</label>
                                        <input type="email" required className="w-full border rounded-lg px-3 py-2" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    {!isEditMode && (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Password</label>
                                            <input type="text" className="w-full border rounded-lg px-3 py-2" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Status</label>
                                        <select className="w-full border rounded-lg px-3 py-2" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition-all">
                                        {isEditMode ? 'Update Student' : 'Save Student'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentsList;
