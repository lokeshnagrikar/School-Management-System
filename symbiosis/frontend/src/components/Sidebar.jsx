import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FiHome, FiUsers, FiBook, FiBell, FiMessageSquare, FiLogOut, FiGrid, FiUser, FiImage, FiSettings, FiDatabase } from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white transition-colors';
    };

    const NavItem = ({ to, icon: Icon, label, external }) => {
        if (external) {
            return (
                <a href={to} target="_blank" rel="noopener noreferrer" className={`text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex items-center px-4 py-3 mx-2 my-1 text-sm font-medium rounded-xl transition-all duration-200`}>
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
        <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-800 min-h-screen transition-all duration-300">
            <div className="flex items-center justify-center h-20 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">IS</span>
                    </div>
                    <span className="text-white text-xl font-bold tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
                </div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</p>
                </div>
                <nav className="space-y-1">
                    <NavItem to="/dashboard" icon={FiGrid} label="Overview" />
                    <NavItem to="/dashboard/profile" icon={FiUser} label="My Profile" />

                    {user?.role === 'ADMIN' && (
                        <>
                            <div className="px-4 mt-6 mb-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Management</p>
                            </div>
                            <NavItem to="/dashboard/students" icon={FiUsers} label="Students" />
                            <NavItem to="/dashboard/staff" icon={FiUsers} label="Staff" />
                            <NavItem to="/dashboard/academics" icon={FiBook} label="Academics" />
                            <NavItem to="/dashboard/gallery" icon={FiImage} label="Gallery" />

                            <div className="px-4 mt-6 mb-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">System</p>
                            </div>
                            <NavItem to="/dashboard/notices" icon={FiBell} label="Notices" />
                            <NavItem to="/dashboard/enquiries" icon={FiMessageSquare} label="Enquiries" />
                            <NavItem to="http://localhost:5000/api-docs" icon={FiDatabase} label="API Docs" external={true} />
                        </>
                    )}

                    {/* Settings for Everyone (or at least Admin/Teacher/Student) */}
                    <div className="px-4 mt-6 mb-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
                    </div>
                    <NavItem to="/dashboard/settings" icon={FiSettings} label="Settings" />

                    {user?.role === 'TEACHER' && (
                        <>
                            <div className="px-4 mt-6 mb-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Academic</p>
                            </div>
                            <NavItem to="/dashboard/students" icon={FiUsers} label="My Students" />
                            <NavItem to="/dashboard/academics" icon={FiBook} label="Manage Classes" />
                            <NavItem to="/dashboard/notices" icon={FiBell} label="Notices" />
                        </>
                    )}

                    {user?.role === 'STUDENT' && (
                        <>
                            <div className="px-4 mt-6 mb-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Learning</p>
                            </div>
                            <NavItem to="/dashboard/notices" icon={FiBell} label="Notices" />
                        </>
                    )}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-800">
                <Link
                    to="/"
                    className="flex items-center w-full px-4 py-3 mb-2 text-sm font-medium text-gray-400 rounded-xl hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <FiHome className="mr-3 text-lg" />
                    Back to Website
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-gray-800 hover:text-red-300 transition-colors"
                >
                    <FiLogOut className="mr-3 text-lg" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
