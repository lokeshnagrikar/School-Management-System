import { useContext, useState, useRef, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import {
    FiUser,
    FiMail,
    FiShield,
    FiCheckCircle,
    FiCamera,
    FiUpload,
    FiClock,
    FiLock,
    FiActivity,
    FiGrid,
} from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('overview');
    const [uploading, setUploading] = useState(false);
    const [activities, setActivities] = useState([]);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchActivityLogs = async () => {
            try {
                const { data } = await api.get('/users/activity');
                setActivities(data);
            } catch (err) {
                console.error(err);
            }
        };
        if (user) fetchActivityLogs();
    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setPasswordLoading(true);
        try {
            await api.put('/users/profile', { password });
            alert('Password updated successfully');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const { data } = await api.post('/users/profile/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            userInfo.profileImage = data.profileImage;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            window.location.reload();
        } catch {
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (!user) return <LoadingSpinner fullScreen={false} />;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FiGrid },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'activity', label: 'Activity', icon: FiActivity },
    ];

    return (
        <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 transition-colors">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-7xl bg-white dark:bg-slate-800 rounded-3xl shadow-[0_20px_60px_-15px_rgba(79,70,229,0.35)] dark:shadow-none overflow-hidden flex flex-col md:flex-row border border-indigo-100 dark:border-slate-700 transition-colors"
            >
                {/* LEFT PROFILE PANEL */}
                <div className="md:w-1/3 relative p-10 flex flex-col items-center justify-center text-white bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
                    {/* Decorative blobs */}
                    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-400 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10 flex flex-col items-center text-center"
                    >
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-36 h-36 rounded-full p-1 bg-white/20 backdrop-blur-lg shadow-2xl transition-transform group-hover:scale-105">
                                <div className="w-full h-full rounded-full overflow-hidden bg-white/10 flex items-center justify-center text-4xl font-bold">
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        user.name?.charAt(0)
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-2 right-2 bg-white text-indigo-600 p-2 rounded-full shadow-lg hover:bg-indigo-50 transition"
                            >
                                <FiCamera />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <h2 className="mt-5 text-2xl font-bold">{user.name}</h2>
                        <p className="text-indigo-200 text-sm">{user.email}</p>

                        <div className="mt-4 flex gap-2 flex-wrap justify-center">
                            <span className="px-4 py-1 bg-white/10 rounded-full text-xs font-semibold border border-white/20 flex items-center gap-1 capitalize">
                                <FiShield /> {user.role}
                            </span>
                            <span className="px-4 py-1 bg-green-500/20 rounded-full text-xs font-semibold border border-green-400/30 text-green-200 flex items-center gap-1">
                                <FiCheckCircle /> Active
                            </span>
                        </div>
                    </motion.div>

                    {uploading && (
                        <div className="absolute bottom-4 text-indigo-200 text-sm animate-pulse">
                            Uploading photo...
                        </div>
                    )}
                </div>

                {/* RIGHT CONTENT PANEL */}
                <div className="md:w-2/3 flex flex-col bg-gray-50 dark:bg-slate-900/50 transition-colors">
                    {/* Tabs */}
                    <div className="flex gap-8 px-10 pt-8 pb-4 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative pb-3 flex items-center gap-2 text-sm font-semibold transition ${activeTab === tab.id
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                    }`}
                            >
                                <tab.icon />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-10 overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        Account Overview
                                    </h3>

                                    <div className="grid grid-cols-2 gap-5">
                                        {[
                                            { label: 'User ID', value: user._id?.slice(0, 12) },
                                            { label: 'Role', value: user.role },
                                            { label: 'Email', value: user.email },
                                            { label: 'Joined', value: new Date(user.createdAt || Date.now()).toLocaleDateString() },
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
                                            >
                                                <p className="text-xs text-gray-400 font-semibold uppercase">
                                                    {item.label}
                                                </p>
                                                <p className="mt-1 text-gray-800 dark:text-white font-medium truncate">
                                                    {item.value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="max-w-md"
                                >
                                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Security Settings</h3>
                                    <form
                                        onSubmit={handlePasswordChange}
                                        className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4 transition-colors"
                                    >
                                        {[password, confirmPassword].map((_, i) => (
                                            <div key={i} className="relative">
                                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="password"
                                                    value={i === 0 ? password : confirmPassword}
                                                    onChange={(e) =>
                                                        i === 0
                                                            ? setPassword(e.target.value)
                                                            : setConfirmPassword(e.target.value)
                                                    }
                                                    placeholder={i === 0 ? 'New password' : 'Confirm password'}
                                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none transition-colors"
                                                />
                                            </div>
                                        ))}

                                        <button
                                            disabled={!password || password !== confirmPassword || passwordLoading}
                                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                                        >
                                            {passwordLoading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {activeTab === 'activity' && (
                                <motion.div
                                    key="activity"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Recent Activity</h3>
                                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-700 overflow-hidden transition-colors">
                                        {activities.length ? (
                                            activities.map((log, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.04 }}
                                                    className="p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                                        <FiActivity />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800 dark:text-white">
                                                            {log.description}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{log.action}</p>
                                                    </div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                                        <FiClock />
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center text-gray-400">
                                                No recent activity
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
