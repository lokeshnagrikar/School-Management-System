import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import {
    FiHome, FiUsers, FiUserCheck, FiBookOpen, FiBell, FiImage,
    FiMessageSquare, FiSettings, FiLogOut, FiCheckSquare, FiBarChart2, FiFileText
} from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    <div className="px-4 mt-6 mb-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account</p>
    </div>
    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
            : 'text-gray-400 hover:bg-slate-800 hover:text-white transition-colors';
    };

    const NavItem = ({ to, icon: Icon, label, external }) => {
        if (external) {
            return (
                <a href={to} target="_blank" rel="noopener noreferrer" className={`text-gray-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center px-4 py-3 mx-2 my-1 text-sm font-medium rounded-xl transition-all duration-200`}>
                    <Icon className="mr-3 text-lg" />
                    {label}
                </a>
            );
        }
        return (
            <Link to={to} className={`${isActive(to)} flex items-center px-4 py-3 mx-2 my-1 text-sm font-medium rounded-xl transition-all duration-200`}>
                <Icon className="mr-3 text-lg" />
                {label}
            </Link>
        );
    };

    return (
        <div className="flex flex-col w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 min-h-screen transition-colors duration-300">
            <div className="flex items-center justify-center h-20 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/50">
                        <span className="text-white font-bold">IS</span>
                    </div>
                    <span className="text-white text-xl font-bold tracking-tight">
                        {user?.role === 'STUDENT' ? 'Student' : user?.role === 'TEACHER' ? 'Teacher' : 'Admin'}
                        <span className="text-indigo-400">Panel</span>
                    </span>
                </div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto py-4 custom-scrollbar-dark">
                <div className="px-4 mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Main</p>
                </div>
                <nav className="space-y-0.5">
                    <NavItem to="/dashboard" icon={FiHome} label="Overview" />
                    <NavItem to="/dashboard/profile" icon={FiUsers} label="My Profile" />

                    {user?.role === 'ADMIN' && (
                        <>
                            <div className="px-4 mt-6 mb-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Management</p>
                            </div>
                            <NavItem to="/dashboard/students" icon={FiUsers} label="Students" />
                            <NavItem to="/dashboard/staff" icon={FiUserCheck} label="Staff" />
                            <NavItem to="/dashboard/academics" icon={FiBookOpen} label="Academics" />
                            <NavItem to="/dashboard/gallery" icon={FiImage} label="Gallery" />

                            <div className="px-4 mt-6 mb-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">System</p>
                            </div>
                            <NavItem to="/dashboard/notices" icon={FiBell} label="Notices" />
                            <NavItem to="/dashboard/enquiries" icon={FiMessageSquare} label="Enquiries" />
                        </>
                    )}

                    {user?.role === 'TEACHER' && (
                        <>
                            <div className="px-4 mt-6 mb-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic</p>
                            </div>
                            <NavItem to="/dashboard/assignments" icon={FiFileText} label="Assignments" />
                            <NavItem to="/dashboard/attendance" icon={FiCheckSquare} label="Attendance" />
                            <NavItem to="/dashboard/marks" icon={FiBarChart2} label="Marks" />
                            <NavItem to="/dashboard/notices" icon={FiBell} label="Notices" />
                        </>
                    )}

                    {user?.role === 'STUDENT' && (
                        <>
                            <div className="px-4 mt-6 mb-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning</p>
                            </div>
                            <NavItem to="/dashboard/my-assignments" icon={FiFileText} label="My Assignments" />
                            <NavItem to="/dashboard/notices" icon={FiBell} label="Notices" />
                        </>
                    )}

                    <div className="px-4 mt-6 mb-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account</p>
                    </div>
                    <NavItem to="/dashboard/settings" icon={FiSettings} label="Settings" />
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <Link
                    to="/"
                    className="flex items-center w-full px-4 py-3 mb-2 text-sm font-medium text-gray-400 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <FiHome className="mr-3 text-lg" />
                    Back to Website
                </Link>
                <button
                    onClick={() => {
                        logout();
                        window.location.href = '/login';
                    }}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-red-900/20 hover:text-red-300 transition-colors"
                >
                    <FiLogOut className="mr-3 text-lg" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
