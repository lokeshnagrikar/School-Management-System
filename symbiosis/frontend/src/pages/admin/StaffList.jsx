import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiEdit2, FiMail, FiBriefcase, FiPhone, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner';

const StaffList = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        password: 'password123'
    });

    const fetchStaff = async () => {
        try {
            const { data } = await api.get('/staff');
            setStaff(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleOpenAdd = () => {
        setIsEditMode(false);
        setFormData({ name: '', email: '', position: '', password: 'password123' });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (member) => {
        setIsEditMode(true);
        setCurrentId(member._id);
        setFormData({
            name: member.name,
            email: member.email,
            position: member.position,
            password: '' // Don't wipe password if empty
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                const payload = { ...formData };
                if (!payload.password) delete payload.password;
                await api.put(`/staff/${currentId}`, payload);
            } else {
                await api.post('/staff', formData);
            }
            setIsModalOpen(false);
            fetchStaff();
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || error.message || 'Operation failed';
            alert(`Error: ${message}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this staff member?')) {
            try {
                await api.delete(`/staff/${id}`);
                setStaff(staff.filter(s => s._id !== id));
            } catch (error) {
                alert('Failed to delete.');
            }
        }
    };

    if (loading) return <LoadingSpinner fullScreen={false} />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 p-8 rounded-2xl shadow-lg text-white transition-colors">
                <div>
                    <h1 className="text-3xl font-bold">Staff Directory</h1>
                    <p className="text-blue-100 dark:text-gray-300 mt-2">Manage your teaching and support team</p>
                </div>
                <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                    <FiPlus size={20} />
                    Add Staff
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {staff.map((member, index) => (
                        <motion.div
                            key={member._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 p-6 flex flex-col hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                {member.photoPath ? (
                                    <img
                                        src={member.photoPath}
                                        alt={member.name}
                                        className="w-14 h-14 rounded-2xl object-cover shadow-md"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/30">
                                        {member.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenEdit(member)} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                        <FiEdit2 />
                                    </button>
                                    <button onClick={() => handleDelete(member._id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{member.name}</h3>
                            <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full w-fit mb-4 border border-blue-100 dark:border-blue-900/50">
                                <FiBriefcase className="mr-2" /> {member.position}
                            </div>

                            <div className="mt-auto space-y-2">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                                    <FiMail className="mr-3 text-gray-400" />
                                    {member.email}
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 p-2 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                                    <FiPhone className="mr-3 text-gray-400" />
                                    +91 98765 43210
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-colors"
                        >
                            <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{isEditMode ? 'Edit Staff Profile' : 'New Staff Member'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input type="text" required className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                    <input type="email" required className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Position / Role</label>
                                    <input type="text" required className="w-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Mathematics Teacher" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                                </div>
                                {!isEditMode && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg flex gap-3 items-start border border-yellow-100 dark:border-yellow-900/30">
                                        <FiCheck className="text-yellow-600 dark:text-yellow-500 mt-1 flex-shrink-0" />
                                        <p className="text-xs text-yellow-700 dark:text-yellow-400">Account will be created with default password: <strong>password123</strong>. User can change it later.</p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 mt-8">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors">Cancel</button>
                                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
                                        {isEditMode ? 'Save Changes' : 'Create Account'}
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

export default StaffList;
