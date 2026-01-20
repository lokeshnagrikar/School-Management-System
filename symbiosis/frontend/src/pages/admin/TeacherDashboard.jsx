import React from 'react';
import { FiUsers, FiBook, FiCheckSquare, FiCalendar } from 'react-icons/fi';

const TeacherDashboard = ({ user }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name}!</h1>
            <p className="text-gray-600 mb-8">Manage your classes and students efficiently.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <FiUsers className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">My Students</p>
                        <p className="text-2xl font-bold text-gray-800">45</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <FiBook className="text-purple-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Classes</p>
                        <p className="text-2xl font-bold text-gray-800">3</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <FiCheckSquare className="text-orange-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Attendance</p>
                        <p className="text-2xl font-bold text-gray-800">Pending</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <FiCalendar className="text-green-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Timetable</p>
                        <p className="text-2xl font-bold text-gray-800">View</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Classes */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Today's Classes</h3>
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                                    <th className="pb-3 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[1, 2, 3].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 text-sm font-medium text-gray-800">09:00 AM - 10:00 AM</td>
                                        <td className="py-4 text-sm text-gray-600">Class 10-A</td>
                                        <td className="py-4 text-sm text-gray-600">Mathematics</td>
                                        <td className="py-4 text-right">
                                            <button className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors">Start Class</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group flex items-center">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FiCheckSquare />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-blue-800">Mark Attendance</span>
                        </button>
                        <button className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group flex items-center">
                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <FiBook />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-purple-800">Upload Marks</span>
                        </button>
                        <button className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group flex items-center">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <FiUsers />
                            </div>
                            <span className="font-medium text-gray-700 group-hover:text-green-800">View Student List</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
