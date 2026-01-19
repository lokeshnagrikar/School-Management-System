import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const DashboardLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center py-4 px-6 bg-white border-b-4 border-primary">
                    <div className="flex items-center">
                        {/* Mobile menu button could go here */}
                    </div>
                    <div className="flex items-center">
                        <Link to="/dashboard/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer group">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">Hello, {user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold border-2 border-white shadow-sm group-hover:border-blue-200 transition-colors">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        </Link>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
