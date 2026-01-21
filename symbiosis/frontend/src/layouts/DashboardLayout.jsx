import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ThemeToggle from '../components/ThemeToggle';

const DashboardLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 font-sans transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <header className="flex justify-between items-center py-4 px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-indigo-50 dark:border-slate-800 sticky top-0 z-20 shadow-sm transition-colors duration-300">
                    <div className="flex items-center">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                            ISBM School
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <ThemeToggle />

                        <Link to="/dashboard/profile" className="flex items-center gap-3 hover:bg-white/50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-indigo-100 dark:hover:border-slate-700 hover:shadow-sm">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                    {user?.role}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 p-[2px] shadow-lg group-hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{user?.name?.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
