import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import { FiLock, FiSettings, FiGlobe, FiSave, FiBell, FiCheck, FiSliders } from 'react-icons/fi';

const Settings = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('security');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [preferences, setPreferences] = useState({ notifications: true, theme: 'light' });
    const [systemConfig, setSystemConfig] = useState({
        schoolName: '',
        address: '',
        contactEmail: '',
        contactPhone: '',
        currentAcademicYear: '',
        maintenanceMode: false
    });

    useEffect(() => {
        fetchPreferences();
        if (user.role === 'ADMIN') fetchSystemConfig();
    }, [user]);

    const fetchPreferences = async () => {
        try {
            const { data } = await api.get('/settings/preferences');
            setPreferences(data);
        } catch (err) { console.error(err); }
    };

    const fetchSystemConfig = async () => {
        try {
            const { data } = await api.get('/settings/system');
            setSystemConfig(data);
        } catch (err) { console.error(err); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        setLoading(true);
        try {
            await api.put('/users/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally { setLoading(false); }
    };

    const handlePreferenceUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/settings/preferences', preferences);
            setPreferences(data);
            setMessage({ type: 'success', text: 'Preferences saved' });
        } catch {
            setMessage({ type: 'error', text: 'Failed to save preferences' });
        } finally { setLoading(false); }
    };

    const handleSystemUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put('/settings/system', systemConfig);
            setSystemConfig(data);
            setMessage({ type: 'success', text: 'System configuration updated' });
        } catch {
            setMessage({ type: 'error', text: 'Failed to update system config' });
        } finally { setLoading(false); }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <motion.button
            onClick={() => setActiveTab(id)}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-all
      ${activeTab === id
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            <Icon /> {label}
        </motion.button>
    );

    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-10
                     bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500
                     bg-clip-text text-transparent animate-pulse">
                Settings
            </h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-8">
                <TabButton id="security" label="Security" icon={FiLock} />
                <TabButton id="preferences" label="Preferences" icon={FiSliders} />
                {user.role === 'ADMIN' && <TabButton id="system" label="System Config" icon={FiGlobe} />}
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >

                {/* Global Message */}
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 rounded-lg mb-6 flex items-center gap-2
              ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                    >
                        {message.type === 'success' ? <FiCheck /> : <FiSettings />}
                        {message.text}
                    </motion.div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Change Password</h2>
                        <p className="text-gray-500 mb-6">Use a strong password for your account.</p>
                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                            {['currentPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                                <div key={i}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                               transition-all"
                                        value={passwordData[field]}
                                        onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                                        required
                                        minLength={field === 'newPassword' ? 6 : 0}
                                    />
                                </div>
                            ))}
                            <button type="submit" disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                           text-white rounded-lg hover:scale-[1.02] transition-transform flex items-center gap-2">
                                {loading ? 'Saving...' : <><FiSave /> Update Password</>}
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Preferences</h2>
                        <p className="text-gray-500 mb-6">Customize your dashboard.</p>
                        <form onSubmit={handlePreferenceUpdate} className="space-y-6 max-w-md">

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 animate-pulse">
                                        <FiBell />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                        <p className="text-sm text-gray-500">Receive updates via email.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={preferences.notifications}
                                        onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                  after:bg-white after:border-gray-300 after:border after:rounded-full
                                  after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                </label>
                            </div>

                            <button type="submit" disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                           text-white rounded-lg hover:scale-[1.02] transition-transform flex items-center gap-2">
                                {loading ? 'Saving...' : <><FiSave /> Save Preferences</>}
                            </button>
                        </form>
                    </motion.div>
                )}

                {/* System Config Tab (Admin) */}
                {activeTab === 'system' && user.role === 'ADMIN' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">System Configuration</h2>
                        <p className="text-gray-500 mb-6">Manage global app settings.</p>
                        <form onSubmit={handleSystemUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {[
                                { label: 'School Name', key: 'schoolName', type: 'text' },
                                { label: 'Contact Email', key: 'contactEmail', type: 'email' },
                                { label: 'Contact Phone', key: 'contactPhone', type: 'text' },
                            ].map((field) => (
                                <div key={field.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                    <input
                                        type={field.type}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        value={systemConfig[field.key]}
                                        onChange={(e) => setSystemConfig({ ...systemConfig, [field.key]: e.target.value })}
                                    />
                                </div>
                            ))}

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    rows="2"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    value={systemConfig.address}
                                    onChange={(e) => setSystemConfig({ ...systemConfig, address: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg col-span-2 border border-red-100 hover:shadow-md transition-shadow">
                                <div>
                                    <h3 className="font-bold text-red-800">Maintenance Mode</h3>
                                    <p className="text-sm text-red-600">Restrict non-admin access</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={systemConfig.maintenanceMode}
                                        onChange={(e) => setSystemConfig({ ...systemConfig, maintenanceMode: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full
                                  peer-checked:bg-red-600
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                  after:bg-white after:border-gray-300 after:border after:rounded-full
                                  after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                </label>
                            </div>

                            <div className="col-span-2">
                                <button type="submit" disabled={loading}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                             text-white rounded-lg hover:scale-[1.02] transition-transform flex items-center gap-2">
                                    {loading ? 'Saving...' : <><FiSave /> Update System Config</>}
                                </button>
                            </div>

                        </form>
                    </motion.div>
                )}

            </motion.div>
        </div>
    );
};

export default Settings;
