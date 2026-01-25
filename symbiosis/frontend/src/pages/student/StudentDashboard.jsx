import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiClock, FiCalendar, FiBookOpen, FiActivity, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const StudentDashboard = ({ user }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/students/dashboard');
                // Fetch Fees
                const { data: feeData } = await api.get('/fees');
                const pendingFees = feeData.filter(f => f.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

                setDashboardData({ ...data, pendingFees });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
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

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    const { attendancePercent, assignmentsPending, upcomingEvents, nextClass, recentNotices, classTeacher, schedule, pendingFees } = dashboardData || {};

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 transform origin-bottom-left" />
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                    <p className="text-blue-100">Ready to learn? Here's your schedule for today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Attendance', value: `${attendancePercent}%`, icon: FiCheckCircle, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-100 dark:border-emerald-800/30' },
                    { label: 'Assignments', value: `${assignmentsPending} Pending`, icon: FiBookOpen, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-100 dark:border-blue-800/30' },
                    { label: 'Events', value: `${upcomingEvents} Upcoming`, icon: FiCalendar, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/30', border: 'border-purple-100 dark:border-purple-800/30' },
                    { label: 'Next Class', value: nextClass, icon: FiClock, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-100 dark:border-orange-800/30' },
                    { label: 'Fees Due', value: `₹${pendingFees || 0}`, icon: FiDollarSign, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-100 dark:border-red-800/30' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                        className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border ${stat.border} flex items-center transition-all`}
                    >
                        <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mr-4 shadow-sm`}>
                            <stat.icon className={`${stat.color} text-xl`} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Notices */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-50 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <FiActivity className="text-indigo-500" /> Recent Notices
                        </h3>
                        <Link to="/dashboard/notices" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</Link>
                    </div>
                    <div className="flex-1 p-6 space-y-4">
                        {recentNotices && recentNotices.length > 0 ? (
                            recentNotices.map((notice) => (
                                <motion.div
                                    key={notice._id}
                                    whileHover={{ scale: 1.01 }}
                                    className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-all border border-gray-100 dark:border-slate-700 group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center mr-4 text-indigo-600 dark:text-indigo-400 font-bold shrink-0 border border-indigo-100 dark:border-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <span className="text-xs uppercase">{new Date(notice.createdAt).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-lg leading-none">{new Date(notice.createdAt).getDate()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{notice.title}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                            {notice.content}
                                        </p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-4">No recent notices</div>
                        )}
                    </div>
                </motion.div>

                {/* Class Schedule / Quick Info */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Class Teacher</h3>
                    {classTeacher ? (
                        <div className="flex items-center mb-8 bg-gray-50 dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                            <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm">
                                <img
                                    src={classTeacher.photoPath ? `http://localhost:5000${classTeacher.photoPath}` : `https://ui-avatars.com/api/?name=${classTeacher.name}&background=random`}
                                    alt="Teacher"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white">{classTeacher.name}</p>
                                <p className="text-sm text-indigo-500 dark:text-indigo-400 font-medium">Class Teacher</p>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 text-gray-500 text-sm">No Class Teacher assigned</div>
                    )}

                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Today's Schedule</h3>
                    <div className="space-y-4 relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100 dark:bg-slate-700" />

                        {schedule && schedule.length > 0 ? (
                            schedule.map((cls, idx) => (
                                <div key={idx} className="flex relative z-10 items-center">
                                    <div className={`w-8 h-8 rounded-full bg-white dark:bg-slate-800 border-4 border-blue-500 flex items-center justify-center shrink-0 shadow-sm z-10`} />
                                    <div className="ml-4 flex-1 bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-100 dark:border-slate-700 flex justify-between items-center group hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all cursor-pointer">
                                        <span className="font-semibold text-gray-700 dark:text-gray-200">{cls.subject ? cls.subject.name : 'Free Period'}</span>
                                        <div className="text-right">
                                            <span className="block text-xs font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-600 mb-1">{cls.startTime} - {cls.endTime}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-4 relative z-10 bg-white dark:bg-slate-800">No classes scheduled for today.</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default StudentDashboard;
