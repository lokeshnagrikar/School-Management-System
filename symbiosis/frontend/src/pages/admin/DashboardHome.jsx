import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

const DashboardHome = () => {
    const { user } = useContext(AuthContext);

    // Render Student Dashboard
    if (user?.role === 'STUDENT') {
        return <StudentDashboard user={user} />;
    }

    // Render Teacher Dashboard
    if (user?.role === 'TEACHER') {
        return <TeacherDashboard user={user} />;
    }

    // Default: Admin Dashboard
    return (
        <div>
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard Overview</h3>
            <p className="text-gray-500 mt-1">Welcome back, {user?.name} ({user?.role})</p>

            <div className="mt-8">
                <div className="flex flex-wrap -mx-6">
                    {/* Admin Stats */}
                    <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                        <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white border-l-4 border-indigo-500">
                            <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                                <i className="fas fa-users text-white text-2xl"></i>
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">1,234</h4>
                                <div className="text-gray-500">Total Students</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-6 sm:w-1/2 xl:w-1/3 mt-6 sm:mt-0">
                        <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white border-l-4 border-green-500">
                            <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
                                <i className="fas fa-chalkboard-teacher text-white text-2xl"></i>
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">45</h4>
                                <div className="text-gray-500">Total Teachers</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full px-6 sm:w-1/2 xl:w-1/3 mt-6 xl:mt-0">
                        <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white border-l-4 border-pink-500">
                            <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                                <i className="fas fa-envelope-open-text text-white text-2xl"></i>
                            </div>
                            <div className="mx-5">
                                <h4 className="text-2xl font-semibold text-gray-700">12</h4>
                                <div className="text-gray-500">New Enquiries</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h4 className="text-gray-600 text-lg font-medium">Coming Up</h4>
                <div className="mt-4 bg-white shadow rounded-lg p-6">
                    <p className="text-gray-600">No upcoming events scheduled.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
