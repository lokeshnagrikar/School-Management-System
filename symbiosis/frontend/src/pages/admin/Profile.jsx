import { useContext, useState, useRef, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import api from '../../services/api';
import { FiUser, FiMail, FiShield, FiCheckCircle, FiCamera, FiUpload } from 'react-icons/fi';
import LoadingSpinner from '../../components/LoadingSpinner';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [activities, setActivities] = useState([]);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        const fetchActivityLogs = async () => {
            try {
                const { data } = await api.get('/users/activity');
                setActivities(data);
            } catch (error) {
                console.error('Error fetching activity logs:', error);
            }
        };

        if (user) {
            fetchActivityLogs();
        }
    }, [user]);


    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setPasswordLoading(true);
        try {
            await api.put('/users/profile', { password });
            alert("Password updated successfully");
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Password Update Error:', error);
            const message = error.response?.data?.message || 'Failed to update password';
            alert(`Error: ${message}`);
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
            // New Single Endpoint call
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data: updatedUser } = await api.post('/users/profile/image', formData, config);

            // Update Local Storage
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            userInfo.profileImage = updatedUser.profileImage;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            // Force reload to reflect changes in Context (or simple alert)
            window.location.reload();

            setUploading(false);
        } catch (error) {
            console.error('Upload Error:', error);
            const message = error.response?.data?.message || error.response?.data || error.message || 'Image upload failed';
            setUploading(false);
            alert(`Error: ${message}`);
        }
    };

    if (!user) return <LoadingSpinner fullScreen={false} />;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg relative group">
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400 overflow-hidden">
                                {user.profileImage ? (
                                    <img
                                        src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user.name ? user.name.charAt(0) : <FiUser />
                                )}
                            </div>

                            {/* Upload Button Overlay */}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <FiCamera className="text-white text-2xl" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                    <div className="mb-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                                <FiShield className="mr-2" /> {user.role}
                            </span>
                        </div>
                        {uploading && <span className="text-sm text-blue-600 animate-pulse flex items-center"><FiUpload className="mr-2" /> Uploading...</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Contact Information</h3>
                                <div className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-xl">
                                    <FiMail className="mr-3 text-blue-500" />
                                    {user.email}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Account Status</h3>
                                <div className="flex items-center text-green-700 bg-green-50 p-4 rounded-xl">
                                    <FiCheckCircle className="mr-3" />
                                    Active
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">System Information</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex justify-between">
                                    <span>User ID:</span>
                                    <span className="font-mono text-gray-500">{user._id || user.id}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Last Login:</span>
                                    <span>{new Date().toLocaleDateString()}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Permissions:</span>
                                    <span>Full Access</span>
                                </li>
                            </ul>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Security Settings</h3>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="Set new password"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!password || passwordLoading}
                                        className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        {passwordLoading ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                        <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
                            {activities.length > 0 ? (
                                activities.map((activity, index) => (
                                    <div key={index} className="flex items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <div className={`w-2 h-2 rounded-full mr-4 ${activity.action === 'LOGIN' ? 'bg-green-500' :
                                            activity.action === 'REGISTER' ? 'bg-purple-500' :
                                                'bg-blue-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                                            <p className="text-xs text-gray-500">Action: {activity.action}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(activity.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    No recent activity found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
