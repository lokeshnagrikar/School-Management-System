import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut, FiLayout, FiUser, FiSettings, FiChevronDown, FiSearch, FiPlus, FiBell, FiHome } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import AnimatedNavIcon from "./AnimatedNavIcon";
import { navConfig } from "../config/navConfig";
import api from "../services/api";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getNavLinks = () => {
        if (!user) return navConfig.PUBLIC;
        return navConfig[user.role] || navConfig.PUBLIC;
    };

    const navLinks = getNavLinks();

    const isActive = (path) => location.pathname === path;
    const isHome = location.pathname === "/";

    const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({ students: [], staff: [] });
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery.length < 2) {
                setSearchResults({ students: [], staff: [] });
                return;
            }
            try {
                const { data } = await api.get(`/search?q=${searchQuery}`);
                setSearchResults(data);
                setIsSearchOpen(true);
            } catch (error) {
                console.error("Search failed", error);
            }
        };

        const timeoutId = setTimeout(() => {
            if (searchQuery) fetchSearchResults();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Fetch Notifications
    useEffect(() => {
        if (user) {
            const fetchNotifications = async () => {
                try {
                    const { data } = await api.get('/notifications');
                    setNotifications(data);
                } catch (error) {
                    console.error("Failed to fetch notifications", error);
                }
            };
            fetchNotifications();
            // Poll every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    // ... existing useEffects ...

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || !isHome
                ? "backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 shadow-md border-b border-gray-100 dark:border-slate-800"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <AnimatedNavIcon />
                        <span
                            className={`text-2xl font-extrabold tracking-tight ${scrolled || !isHome
                                ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient"
                                : "text-white drop-shadow-md"
                                }`}
                        >
                            ISBM School
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative font-medium transition ${scrolled || !isHome ? "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400" : "text-white/90 hover:text-white"
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <motion.span
                                        layoutId="activeNav"
                                        className="absolute -bottom-2 left-0 h-0.5 w-full bg-blue-600 dark:bg-blue-400 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}

                        {/* Search Bar */}
                        <div className={`relative group ${scrolled || !isHome ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}>
                            <div className={`flex items-center rounded-full px-3 py-1.5 transition-all duration-300 w-48 focus-within:w-64 focus-within:ring-2 focus-within:ring-blue-500/50 ${scrolled || !isHome ? 'bg-gray-100 dark:bg-slate-800' : 'bg-white/10 backdrop-blur-md border border-white/20'}`}>
                                <FiSearch className={`w-4 h-4 ${scrolled || !isHome ? 'text-gray-500 dark:text-gray-400' : 'text-white/70'}`} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder-gray-500 dark:placeholder-gray-400 text-inherit"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchOpen(true)}
                                    onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                                />
                            </div>

                            <AnimatePresence>
                                {isSearchOpen && searchQuery.length >= 2 && (searchResults.students.length > 0 || searchResults.staff.length > 0) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 max-h-96 overflow-y-auto custom-scrollbar"
                                    >
                                        {searchResults.students.length > 0 && (
                                            <div className="py-2">
                                                <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">Students</div>
                                                {searchResults.students.map(s => (
                                                    <Link key={s._id} to={`/dashboard/students`} className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                            {s.profileImage ? <img src={s.profileImage} alt="" className="w-full h-full rounded-full object-cover" /> : s.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.name}</p>
                                                            <p className="text-xs text-gray-500">{s.admissionNumber}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.staff.length > 0 && (
                                            <div className="py-2 border-t border-gray-100 dark:border-slate-700">
                                                <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">Staff</div>
                                                {searchResults.staff.map(s => (
                                                    <Link key={s._id} to={`/dashboard/staff`} className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                            {s.photoPath ? <img src={s.photoPath} alt="" className="w-full h-full rounded-full object-cover" /> : s.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.name}</p>
                                                            <p className="text-xs text-gray-500">{s.designation}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Quick Actions (Admin/Teacher Only) */}
                        {user && (user.role === 'ADMIN' || user.role === 'TEACHER') && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                                    className={`p-2 rounded-full transition-colors ${scrolled || !isHome ? 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200' : 'hover:bg-white/20 text-white'}`}
                                    title="Quick Actions"
                                >
                                    <FiPlus className="w-5 h-5" />
                                </button>
                                <AnimatePresence>
                                    {isQuickActionsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 py-1"
                                        >
                                            <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Create New</div>
                                            {user.role === 'ADMIN' && (
                                                <Link to="/dashboard/students" onClick={() => setIsQuickActionsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">Student</Link>
                                            )}
                                            <Link to="/dashboard/notices" onClick={() => setIsQuickActionsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">Notice</Link>
                                            {user.role === 'TEACHER' && (
                                                <Link to="/dashboard/assignments" onClick={() => setIsQuickActionsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">Assignment</Link>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Notification Bell */}
                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className={`p-2 rounded-full transition-colors relative ${scrolled || !isHome ? 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200' : 'hover:bg-white/20 text-white'}`}
                                >
                                    <FiBell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                                    )}
                                </button>
                                <AnimatePresence>
                                    {isNotificationsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                                <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                                            </div>
                                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No notifications</div>
                                                ) : (
                                                    notifications.map(n => (
                                                        <div
                                                            key={n._id}
                                                            onClick={() => !n.read && markAsRead(n._id)}
                                                            className={`px-4 py-3 border-b border-gray-50 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                                        >
                                                            <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                                                                {n.message}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                            <Link to="/dashboard/notices" onClick={() => setIsNotificationsOpen(false)} className="block p-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                View All
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <div className="pl-4 border-l border-gray-200 dark:border-slate-700">
                            <ThemeToggle />
                        </div>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center gap-3 focus:outline-none transition-all duration-300 p-1 rounded-full border-2 ${scrolled || !isHome ? 'border-gray-200 dark:border-slate-700 hover:border-blue-500' : 'border-white/30 hover:border-white/50'}`}
                                >
                                    <img
                                        src={user.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`) : `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className={`hidden lg:block text-sm font-medium mr-1 ${scrolled || !isHome ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}>
                                        {user.name}
                                    </span>
                                    <FiChevronDown className={`hidden lg:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} ${scrolled || !isHome ? 'text-gray-500 dark:text-gray-400' : 'text-white/80'}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl py-2 border border-gray-100 dark:border-slate-700 overflow-hidden z-50 origin-top-right box-content"
                                        >
                                            <div className="px-5 py-3 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                                <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                    {user.role}
                                                </span>
                                            </div>

                                            <div className="px-2 py-2">
                                                <Link
                                                    to="/dashboard/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                                        <FiUser size={16} />
                                                    </div>
                                                    My Profile
                                                </Link>

                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                                                        <FiLayout size={16} />
                                                    </div>
                                                    Dashboard
                                                </Link>

                                                <Link
                                                    to="/dashboard/settings"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg">
                                                        <FiSettings size={16} />
                                                    </div>
                                                    Settings
                                                </Link>

                                                {user.role === 'ADMIN' && (
                                                    <Link
                                                        to="/dashboard/profile"
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                    >
                                                        <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg">
                                                            <FiLayout size={16} />
                                                        </div>
                                                        Activity Log
                                                    </Link>
                                                )}
                                            </div>

                                            <div className="border-t border-gray-100 dark:border-slate-700 mt-1 px-2 py-2">
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                                                        <FiLogOut size={16} />
                                                    </div>
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-blue-500/30 transition hover:scale-105 active:scale-95"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-lg ${scrolled || !isHome ? "text-gray-800 dark:text-white" : "text-white"
                                }`}
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-white dark:bg-slate-900 shadow-xl border-t border-gray-100 dark:border-slate-800"
                    >
                        <div className="px-4 py-6 space-y-2">
                            {/* Mobile Search */}
                            <div className="mb-4 relative">
                                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchOpen(true)}
                                />
                                {/* Mobile Search Results */}
                                {searchQuery.length >= 2 && isSearchOpen && (
                                    <div className="mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
                                        {/* Reuse desktop search results logic or simplified view */}
                                        {searchResults.students.length > 0 && (
                                            <div className="py-2">
                                                <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">Students</div>
                                                {searchResults.students.map(s => (
                                                    <Link key={s._id} to={`/dashboard/students`} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 truncate">{s.name}</Link>
                                                ))}
                                            </div>
                                        )}
                                        {searchResults.staff.length > 0 && (
                                            <div className="py-2 border-t border-gray-100 dark:border-slate-700">
                                                <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase">Staff</div>
                                                {searchResults.staff.map(s => (
                                                    <Link key={s._id} to={`/dashboard/staff`} onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 truncate">{s.name}</Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-lg font-medium ${isActive(link.path)
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                                {user ? (
                                    <>
                                        <div className="border-b border-gray-100 dark:border-slate-800 pb-2 mb-2">
                                            <div className="flex items-center justify-between px-4 py-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                                                Menu
                                            </div>
                                            {/* Mobile Quick Actions */}
                                            {(user.role === 'ADMIN' || user.role === 'TEACHER') && (
                                                <>
                                                    {user.role === 'ADMIN' && <Link to="/dashboard/students" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm text-gray-700 dark:text-gray-300"><FiPlus size={14} /> Add Student</Link>}
                                                    <Link to="/dashboard/notices" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm text-gray-700 dark:text-gray-300"><FiPlus size={14} /> Add Notice</Link>
                                                    {user.role === 'TEACHER' && <Link to="/dashboard/assignments" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm text-gray-700 dark:text-gray-300"><FiPlus size={14} /> Add Assignment</Link>}
                                                </>
                                            )}

                                            {/* Mobile Notifications Link */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                                    className="flex items-center gap-2 px-4 py-3 w-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                                                >
                                                    <div className="relative">
                                                        <FiBell />
                                                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                                                    </div>
                                                    Notifications ({unreadCount})
                                                </button>
                                                {/* Render simplified notifications list here if needed or rely on desktop modal/page */}
                                            </div>
                                        </div>

                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                                        >
                                            <FiLayout /> Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-3 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <FiLogOut /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-lg bg-blue-600 text-white text-center font-medium"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
