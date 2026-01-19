import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import { FiPlus, FiCalendar, FiTrash2, FiClock, FiTag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Notices = () => {
    const { user } = useContext(AuthContext); // Get user for RBAC
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        category: 'General'
    });

    const categories = ['General', 'Academic', 'Sports', 'Events', 'Holiday'];

    const fetchNotices = async () => {
        try {
            const { data } = await api.get('/cms/notices');
            setNotices(data);
            setLoading(false);
        } catch (error) {
            console.error("Error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/cms/notices', formData);
            setShowModal(false);
            setFormData({ title: '', content: '', date: new Date().toISOString().split('T')[0], category: 'General' });
            fetchNotices();
        } catch (error) {
            alert('Failed to post notice.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this notice?')) {
            try {
                await api.delete(`/cms/notices/${id}`);
                setNotices(notices.filter(n => n._id !== id));
            } catch (error) {
                alert('Failed to delete.');
            }
        }
    }

    // Pseudo-Masonry Grid Logic (simple alternate columns for now, or just grid)
    // Using standard grid with flex heights.

    if (loading) return <div>Loading...</div>;

    const canEdit = user?.role === 'ADMIN' || user?.role === 'TEACHER';

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
                    <p className="text-gray-500 mt-1">Keep the school updated with latest news</p>
                </div>
                {canEdit && (
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105">
                        <FiPlus size={20} />
                        Create Notice
                    </button>
                )}
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {notices.map((notice, index) => (
                        <motion.div
                            layout
                            key={notice._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col group relative"
                        >
                            {/* Decorative Top Bar */}
                            <div className={`h-2 w-full ${index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-purple-500' : 'bg-pink-500'
                                }`}></div>

                            {canEdit && (
                                <button
                                    onClick={() => handleDelete(notice._id)}
                                    className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                                >
                                    <FiTrash2 />
                                </button>
                            )}

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                        <FiTag className="text-[10px]" /> {formData.category || 'General'}
                                    </span>
                                    <span className="text-gray-400 text-xs flex items-center gap-1">
                                        <FiCalendar /> {new Date(notice.date).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                                    {notice.title}
                                </h3>

                                <div className="prose prose-sm text-gray-600 mb-6 flex-1">
                                    <p className="line-clamp-4">{notice.content}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200" title="Posted by Admin"></div>
                                        <span className="text-xs text-gray-500 font-medium">Admin</span>
                                    </div>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <FiClock /> Posted recently
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {notices.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg">No notices published yet.</p>
                    {canEdit && <button onClick={() => setShowModal(true)} className="text-blue-600 font-medium mt-2 hover:underline">Create your first notice</button>}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-xl font-bold text-gray-800">Compose Notice</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                    <input type="text" required placeholder="Enter notice title..." className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                        <select className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                        <input type="date" required className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                                    <textarea required rows="5" placeholder="Write your announcement here..." className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none resize-none" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Discard</button>
                                    <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium shadow-lg shadow-purple-500/30 transition-all hover:scale-105">
                                        Publish Notice
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

export default Notices;
