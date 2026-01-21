import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FiUsers, FiBook, FiCheckSquare, FiCalendar, FiClock, FiMoreVertical } from 'react-icons/fi';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner';

const TeacherDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        totalClassesAssigned: 0,
        totalStudents: 0,
        classesToday: 0
    });
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Stats
                const statsRes = await api.get('/teacher/stats');
                setStats(statsRes.data);

                // Fetch Schedule
                const scheduleRes = await api.get('/teacher/schedule');
                setSchedule(scheduleRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch teacher dashboard data", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) return <LoadingSpinner fullScreen={false} />;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, {user?.name}!</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Here is an overview of your classes today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'My Students', value: stats.totalStudents, icon: FiUsers, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800' },
                    { label: 'Classes Today', value: stats.classesToday, icon: FiBook, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800' },
                    { label: 'Assigned Classes', value: stats.totalClassesAssigned, icon: FiCheckSquare, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800' },
                    { label: 'Timetable', value: 'View', icon: FiCalendar, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border ${stat.border} flex items-center transition-all hover:shadow-md cursor-pointer`}
                    >
                        <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-sm mr-4`}>
                            <stat.icon />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-white mt-0.5">{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Classes */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <FiClock className="text-indigo-500" /> Today's Schedule
                        </h3>
                        <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700">Full Timetable</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Class</th>
                                    <th className="px-6 py-4">Subject</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                                {schedule.length > 0 ? (
                                    schedule.map((cls) => (
                                        <tr key={cls.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-700/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    {cls.startTime} - {cls.endTime}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-600">
                                                    Class {cls.class}-{cls.section}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">{cls.subject}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                                    Start Class
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                                            No classes scheduled for today.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link to="/dashboard/attendance" className="w-full text-left p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group flex items-center shadow-sm hover:shadow-md">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FiCheckSquare className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400">Mark Attendance</h4>
                                <p className="text-xs text-gray-400 mt-0.5">For Scheduled Classes</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/marks" className="w-full text-left p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all group flex items-center shadow-sm hover:shadow-md">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <FiBook className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-400">Upload Marks</h4>
                                <p className="text-xs text-gray-400 mt-0.5">Recent Exam</p>
                            </div>
                        </Link>

                        <Link to="/dashboard/students" className="w-full text-left p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group flex items-center shadow-sm hover:shadow-md">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <FiUsers className="text-xl" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-green-700 dark:group-hover:text-green-400">Student List</h4>
                                <p className="text-xs text-gray-400 mt-0.5">View all students</p>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default TeacherDashboard;
