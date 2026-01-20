import React from 'react';
import { FiCheckCircle, FiClock, FiCalendar, FiBookOpen } from 'react-icons/fi';

const StudentDashboard = ({ user }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name.split(' ')[0]}!</h1>
            <p className="text-gray-600 mb-8">Here's what's happening today.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                        <FiCheckCircle className="text-green-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Attendance</p>
                        <p className="text-2xl font-bold text-gray-800">92%</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <FiBookOpen className="text-blue-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Assignments</p>
                        <p className="text-2xl font-bold text-gray-800">4 Pending</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <FiCalendar className="text-purple-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Upcoming Events</p>
                        <p className="text-2xl font-bold text-gray-800">2</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                        <FiClock className="text-orange-600 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Next Class</p>
                        <p className="text-lg font-bold text-gray-800 truncate">Mathematics</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Notices */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Notices</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-50">
                                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mr-4 text-indigo-600 font-bold shrink-0">
                                    {20 + i}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-1">Annual Sports Day Registration</h4>
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        Registration for the annual sports day is now open. Please contact your class teacher for more details and to sign up for events.
                                    </p>
                                    <span className="text-xs text-indigo-500 mt-2 block font-medium">Jan {20 + i}, 2026</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Class Schedule / Quick Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">My Class Teacher</h3>
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" alt="Teacher" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Mr. Sharma</p>
                            <p className="text-sm text-gray-500">Class 10-A</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-4 mt-8">Today's Schedule</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-700">09:00 AM</span>
                            <span className="text-gray-600">Mathematics</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-700">10:00 AM</span>
                            <span className="text-gray-600">Science</span>
                        </div>
                        <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                            <span className="font-semibold text-gray-700">11:00 AM</span>
                            <span className="text-gray-600">History</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
