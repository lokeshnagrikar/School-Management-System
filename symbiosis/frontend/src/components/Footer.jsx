import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiArrowRight, FiShield, FiFileText } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import api from '../services/api';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

    const handleSubscribe = async () => {
        if (!email) return;
        setStatus('loading');
        try {
            await api.post('/newsletter', { email });
            setStatus('success');
            setTimeout(() => {
                setStatus(null);
                setEmail('');
            }, 3000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus(null), 3000);
        }
    };

    return (
        <footer className="bg-gray-900 dark:bg-slate-950 text-white pt-16 pb-8 border-t border-gray-800 dark:border-slate-900 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Section: Newsletter */}
                <div className="mb-16 bg-gradient-to-r from-indigo-900/50 to-blue-900/50 rounded-3xl p-8 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Subscribe to our Newsletter</h3>
                        <p className="text-gray-400 mt-2 max-w-md">Stay updated with the latest school news, achievements, and upcoming events delivered to your inbox.</p>
                    </div>
                    <div className="relative z-10 w-full md:w-auto">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="px-5 py-3 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-72 backdrop-blur-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    onClick={handleSubscribe}
                                    disabled={status === 'loading'}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'} <FiArrowRight />
                                </button>
                            </div>
                            {status === 'success' && <p className="text-green-400 text-sm ml-1">Subscribed successfully!</p>}
                            {status === 'error' && <p className="text-red-400 text-sm ml-1">Already subscribed or invalid data.</p>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: School Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                ISBM
                            </div>
                            <span className="text-xl font-bold tracking-wide text-white">
                                ISBM School
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Empowering students with knowledge, character, and leadership skills since 2000. Affiliated with CBSE & ISO 9001:2015 Certified.
                        </p>
                        <div className="flex gap-4">
                            {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-all text-gray-400 hover:text-white">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Academics */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <FaGraduationCap className="text-indigo-500" /> Academics
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/academics/curriculum" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> Curriculum (CBSE)</Link></li>
                            <li><Link to="/academics/calendar" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> Academic Calendar</Link></li>
                            <li><Link to="/departments" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> Departments</Link></li>
                            <li><Link to="/faculty" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> Our Faculty</Link></li>
                            <li><Link to="/achievements" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> Achievements</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Portals & Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <FiShield className="text-indigo-500" /> Portals
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/login" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> Student Login</Link></li>
                            <li><Link to="/login" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> Parent Portal</Link></li>
                            <li><Link to="/login" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> Staff Login</Link></li>
                            <li><Link to="/admissions" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> Online Admission</Link></li>
                            <li><Link to="/gallery" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span> School Gallery</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Legal */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <FiMapPin className="text-indigo-500" /> Contact Info
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <FiMapPin className="mt-1 text-indigo-500 flex-shrink-0" />
                                <span>123 Knowledge Park, Education City,<br /> Pune, Maharashtra 411000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone className="text-indigo-500 flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="text-indigo-500 flex-shrink-0" />
                                <span>admissions@isbmschool.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} ISBM School. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
