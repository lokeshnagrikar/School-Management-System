import { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const Login = () => {
    const { login, loginWithGoogle, user } = useContext(AuthContext); // Get user to redirect if already logged in
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const errorParam = params.get("error");

        console.log("Login Page params - Token:", token ? "Present" : "Missing", "Error:", errorParam);

        if (errorParam) {
            setError("Google Login failed. Please try again or use email/password.");
        }

        if (token) {
            const handleGoogleLogin = async () => {
                console.log("Initiating Google Login with token...");
                setLoading(true);
                try {
                    const result = await loginWithGoogle(token);
                    console.log("Google Login Result:", result);
                    if (result.success) {
                        console.log("Login success, navigating to dashboard");
                        navigate("/dashboard");
                    } else {
                        console.error("Login failed:", result.message);
                        setError(result.message || "Google Login failed");
                        setLoading(false);
                    }
                } catch (err) {
                    console.error("Google Login Exception:", err);
                    setError("An unexpected error occurred");
                    setLoading(false);
                }
            };
            handleGoogleLogin();
        }
    }, [location, loginWithGoogle, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.message || "Invalid email or password");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900 dark:bg-black transition-colors duration-500">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="School Building"
                    className="w-full h-full object-cover opacity-40 dark:opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80 dark:from-black/80 dark:to-slate-900/90 backdrop-blur-sm"></div>
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-3xl shadow-2xl mx-4"
            >
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-2xl font-bold text-white">IS</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 font-serif">Welcome Back</h2>
                    <p className="text-blue-200 text-sm">Sign in to access your dashboard</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="text-blue-300" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiLock className="text-blue-300" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-blue-400/30 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/10 border-white/20" />
                            <label htmlFor="remember-me" className="ml-2 block text-blue-200">Remember me</label>
                        </div>
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-300 hover:text-white transition-colors">Forgot password?</Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : (
                            <>
                                Sign In <FiArrowRight className="ml-2" />
                            </>
                        )}
                    </button>

                    <div className="relative flex py-4 items-center">
                        <div className="flex-grow border-t border-white/20"></div>
                        <span className="flex-shrink-0 mx-4 text-blue-200 text-sm">Or continue with</span>
                        <div className="flex-grow border-t border-white/20"></div>
                    </div>

                    <a
                        href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}/api/users/google`}
                        className="w-full flex items-center justify-center px-4 py-4 border border-white/20 bg-white/10 hover:bg-white/20 text-base font-medium rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-all"
                    >
                        <FcGoogle className="mr-2 text-2xl" />
                        Sign in with Google
                    </a>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-blue-200">
                        Don't have an account?{' '}
                        <Link to="/contact" className="font-medium text-white hover:text-blue-300 transition-colors">
                            Contact Admissions
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
