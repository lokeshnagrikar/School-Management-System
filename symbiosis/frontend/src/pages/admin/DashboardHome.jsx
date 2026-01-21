import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiMail, FiCalendar, FiArrowRight, FiEdit2, FiTrash2 } from 'react-icons/fi';

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        newEnquiries: 0
    });
    const [events, setEvents] = useState([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', category: 'Other', description: '' });
    const [editingEventId, setEditingEventId] = useState(null);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events/upcoming');
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events", error);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/cms/stats');
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();
        fetchEvents();
    }, []);

    const handleOpenCreateModal = () => {
        setEditingEventId(null);
        setNewEvent({ title: '', date: '', category: 'Other', description: '' });
        setIsEventModalOpen(true);
    };

    const handleOpenEditModal = (event) => {
        setEditingEventId(event._id);
        const formattedDate = new Date(event.date).toISOString().split('T')[0];
        setNewEvent({ ...event, date: formattedDate });
        setIsEventModalOpen(true);
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        try {
            if (editingEventId) {
                await api.put(`/events/${editingEventId}`, newEvent);
            } else {
                await api.post('/events', newEvent);
            }
            setIsEventModalOpen(false);
            setNewEvent({ title: '', date: '', category: 'Other', description: '' });
            setEditingEventId(null);
            fetchEvents();
        } catch (error) {
            alert('Failed to save event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
            } catch (error) {
                alert('Failed to delete event');
            }
        }
    };

    // ... variants ...
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const statsData = [
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: FiUsers,
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            border: 'border-blue-200 dark:border-blue-800',
            link: '/dashboard/students'
        },
        {
            title: 'Total Teachers',
            value: stats.totalTeachers,
            icon: FiUserCheck,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-100 dark:bg-green-900/30',
            border: 'border-green-200 dark:border-green-800',
            link: '/dashboard/staff'
        },
        {
            title: 'New Enquiries',
            value: stats.newEnquiries,
            icon: FiMail,
            color: 'text-pink-600 dark:text-pink-400',
            bg: 'bg-pink-100 dark:bg-pink-900/30',
            border: 'border-pink-200 dark:border-pink-800',
            link: '/dashboard/enquiries'
        }
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back, get a quick update on your school.</p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800 px-4 py-2 rounded-lg border border-indigo-100 dark:border-slate-700">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsData.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        onClick={() => navigate(stat.link)}
                        className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border ${stat.border} flex items-center justify-between group cursor-pointer transition-all hover:shadow-md`}
                    >
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{stat.title}</p>
                            <h4 className="text-3xl font-bold text-gray-800 dark:text-white mt-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</h4>
                        </div>
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-inner`}>
                            <stat.icon />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Content Section */}
            <div className="grid md:grid-cols-3 gap-8">
                <motion.div variants={itemVariants} className="md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <FiCalendar className="text-indigo-500" /> Upcoming Events
                        </h4>
                        <button onClick={handleOpenCreateModal} className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 shadow-sm">
                            + Add Event
                        </button>
                    </div>

                    <div className="p-0 flex-1">
                        {events.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-slate-700">
                                {events.map((event) => (
                                    <div key={event._id} className="p-5 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition flex items-center gap-4 group cursor-default">
                                        <div className="flex-shrink-0 w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                                            <span className="text-xs font-bold uppercase tracking-wider">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-xl font-bold leading-none">{new Date(event.date).getDate()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h5 className="font-semibold text-gray-900 dark:text-white truncate pr-4">{event.title}</h5>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${event.category === 'Academic' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' :
                                                    event.category === 'Sports' ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30' :
                                                        event.category === 'Holiday' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' :
                                                            'bg-gray-50 text-gray-600 border-gray-100 dark:bg-slate-700 dark:text-gray-400 dark:border-slate-600'
                                                    }`}>
                                                    {event.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{event.description || 'No description provided.'}</p>
                                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-2">
                                                <span>📍 {event.location || 'Campus'}</span>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <button onClick={() => handleOpenEditModal(event)} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit">
                                                <FiEdit2 />
                                            </button>
                                            <button onClick={() => handleDeleteEvent(event._id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 dark:text-gray-500 py-12 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                                    <FiCalendar className="text-3xl text-gray-300 dark:text-slate-500" />
                                </div>
                                <p>No upcoming events scheduled.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-900 dark:to-violet-950 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-pink-500 opacity-20 rounded-full blur-2xl"></div>

                    <h4 className="font-bold text-lg relative z-10">Quick Actions</h4>
                    <p className="text-indigo-100 text-sm mt-1 relative z-10 mb-6">Manage your school efficiently</p>

                    <div className="space-y-3 relative z-10">
                        <button
                            onClick={() => navigate('/dashboard/students')}
                            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition flex items-center gap-3 border border-white/10"
                        >
                            <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-xs">+</div>
                            <span className="font-medium text-sm">Add New Student</span>
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/notices')}
                            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition flex items-center gap-3 border border-white/10"
                        >
                            <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold text-xs">+</div>
                            <span className="font-medium text-sm">Create Notice</span>
                        </button>
                    </div>
                </motion.div>
            </div>
            {/* Event Modal */}
            {isEventModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-slate-700">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{editingEventId ? 'Edit Event' : 'Add New Event'}</h3>
                        <form onSubmit={handleSaveEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newEvent.category}
                                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                >
                                    <option value="Academic">Academic</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Holiday">Holiday</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    rows="3"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEventModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-lg shadow-indigo-500/30"
                                >
                                    {editingEventId ? 'Update Event' : 'Add Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default DashboardHome;
