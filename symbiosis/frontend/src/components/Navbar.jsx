import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut, FiLayout, FiUser, FiSettings, FiChevronDown } from "react-icons/fi";

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

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Admissions", path: "/admissions" },
        { name: "Gallery", path: "/gallery" },
        { name: "Contact", path: "/contact" },
    ];

    const isActive = (path) => location.pathname === path;
    const isHome = location.pathname === "/";

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || !isHome
                ? "backdrop-blur-xl bg-white/80 shadow-md"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            ISBM
                        </div>
                        <span
                            className={`text-xl font-bold tracking-wide ${scrolled || !isHome ? "text-gray-900" : "text-white"
                                }`}
                        >
                            ISBM School
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative font-medium transition ${scrolled || !isHome ? "text-gray-700" : "text-white/90"
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <motion.span
                                        layoutId="activeNav"
                                        className="absolute -bottom-2 left-0 h-0.5 w-full bg-blue-600 rounded-full"
                                    />
                                )}
                            </Link>
                        ))}

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`flex items-center gap-3 focus:outline-none transition-all duration-300 p-1 rounded-full border-2 ${scrolled || !isHome ? 'border-gray-200' : 'border-white/30 hover:border-white/50'}`}
                                >
                                    <img
                                        src={user.profileImage ? `http://localhost:5000${user.profileImage}` : "https://ui-avatars.com/api/?name=" + user.name + "&background=0D8ABC&color=fff"}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className={`hidden lg:block text-sm font-medium mr-1 ${scrolled || !isHome ? 'text-gray-700' : 'text-white'}`}>
                                        {user.name}
                                    </span>
                                    <FiChevronDown className={`hidden lg:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''} ${scrolled || !isHome ? 'text-gray-500' : 'text-white/80'}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden z-50 origin-top-right box-content"
                                        >
                                            <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                                    {user.role}
                                                </span>
                                            </div>

                                            <div className="px-2 py-2">
                                                <Link
                                                    to="/dashboard/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                        <FiUser size={16} />
                                                    </div>
                                                    My Profile
                                                </Link>

                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                        <FiLayout size={16} />
                                                    </div>
                                                    Dashboard
                                                </Link>

                                                <Link
                                                    to="/dashboard/settings"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                                        <FiSettings size={16} />
                                                    </div>
                                                    Settings
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-100 mt-1 px-2 py-2">
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setIsProfileOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
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
                                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-blue-500/30 transition"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden p-2 rounded-lg ${scrolled || !isHome ? "text-gray-800" : "text-white"
                            }`}
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden bg-white shadow-xl border-t"
                    >
                        <div className="px-4 py-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-4 py-3 rounded-lg font-medium ${isActive(link.path)
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="pt-4 border-t">
                                {user ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-100"
                                        >
                                            <FiLayout /> Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center gap-2 w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50"
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
