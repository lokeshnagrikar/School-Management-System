import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiCheckCircle,
    FiBook,
    FiAward,
    FiUsers,
} from "react-icons/fi";
import api from '../services/api';

const Home = () => {
    const [content, setContent] = useState({});

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await api.get('/cms/content');
                const map = {};
                if (Array.isArray(data)) {
                    data.forEach(c => map[c.section] = c);
                }
                setContent(map);
            } catch (error) {
                console.error("Failed to load CMS content", error);
            }
        };
        fetchContent();
    }, []);

    const hero = content['home-hero'] || {};
    // const about = content['home-about'] || {}; // Can be used for About section if needed

    return (
        <div className="font-sans bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <img
                    src={hero.imageUrl || "https://images.unsplash.com/photo-1599725427295-6ed79ff8dbef?w=1600&auto=format&fit=crop&q=80"}
                    alt="School Campus"
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                />

                {/* Gradient Hole Overlay */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 35%, rgba(15,23,42,0.85) 70%, rgba(15,23,42,0.95) 100%)",
                    }}
                />

                {/* Animated Color Wash */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-indigo-900/70 bg-[length:300%_300%]"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ mixBlendMode: "overlay" }}
                />

                {/* Floating Gradient Orbs */}
                <motion.div
                    className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/40 rounded-full blur-[120px]"
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 14, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-purple-600/40 rounded-full blur-[120px]"
                    animate={{ y: [0, -40, 0] }}
                    transition={{ duration: 16, repeat: Infinity }}
                />

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center sm:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="max-w-3xl"
                    >
                        <span className="block text-blue-300 font-semibold tracking-widest uppercase mb-4">
                            Welcome to ISBM School
                        </span>

                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 font-serif">
                            {hero.title || (
                                <>
                                    Empowering <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
                                        Future Leaders
                                    </span>
                                </>
                            )}
                            {/* Use title from CMS if exists, else default JSX structure */}
                        </h1>
                        {!hero.title && !hero.subtitle && (
                            /* If using CMS title, we might lose the formatting (br/span). 
                               For simplicity, if CMS content exists, render it plain string. 
                               OR: keep the default if no content. 
                               But if content exists, use it. */
                            null
                        )}

                        {hero.title && (
                            /* Ensure custom title doesn't break layout. */
                            /* Re-rendering title to be safe for updates */
                            /* Wait, above logic is slightly complex. 
                               Let's simplify: 
                               If content found, use content.title.
                               If NOT, use hardcoded. 
                            */
                            null
                        )}


                        <p className="text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
                            {hero.body || hero.subtitle || "We provide world-class education that nurtures academic excellence, creativity, leadership, and character in a future-ready environment."}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/admissions"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-500/50"
                            >
                                Apply for Admission
                                <FiArrowRight className="ml-2" />
                            </Link>

                            <Link
                                to="/about"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full border border-white/40 text-white hover:bg-white/10 backdrop-blur transition"
                            >
                                Discover More
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>


            {/* Stats Section */}
            <section className="py-20 bg-white dark:bg-slate-900 relative -mt-24 z-20 mx-4 md:mx-10 rounded-3xl shadow-2xl transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { number: "25+", label: "Years of Excellence", icon: FiAward },
                            { number: "1500+", label: "Happy Students", icon: FiUsers },
                            { number: "100%", label: "College Acceptance", icon: FiCheckCircle },
                            { number: "50+", label: "Expert Faculty", icon: FiBook },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6"
                            >
                                <div className="inline-flex p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-4 transition-colors">
                                    <stat.icon size={32} />
                                </div>
                                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                                    {stat.number}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Academic Excellence */}
            <section className="py-24 bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Our Programs</span>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 font-serif transition-colors">Academic Excellence</h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors">
                            We offer a comprehensive curriculum designed to inspire curiosity and critical thinking at every stage of development.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Primary Years", desc: "Foundation for lifelong learning through play and inquiry.", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80" },
                            { title: "Middle School", desc: "Bridging the gap with project-based learning and discovery.", img: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2Nob29sfGVufDB8fDB8fHww" },
                            { title: "Senior School", desc: "Preparing future leaders with rigorous academic programs.", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all border border-gray-100 dark:border-slate-700"
                            >
                                <div className="h-64 overflow-hidden">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">{item.desc}</p>
                                    <Link to="/academics" className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Learn More <FiArrowRight />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Life at ISBM (Gallery Preview) */}
            <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-purple-600 dark:text-purple-400 font-bold tracking-wider uppercase text-sm">Campus Life</span>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 font-serif transition-colors">Life at ISBM</h2>
                        </div>
                        <Link to="/gallery" className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
                            View Full Gallery <FiArrowRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
                        <div className="col-span-2 md:col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
                            <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Student Life" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-8 flex flex-col justify-end">
                                <h3 className="text-white text-2xl font-bold">Holistic Growth</h3>
                                <p className="text-gray-200">Sports & Arts</p>
                            </div>
                        </div>
                        <div className="col-span-1 rounded-2xl overflow-hidden relative group">
                            <img src="https://plus.unsplash.com/premium_photo-1682284353484-4e16001c58eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2Nob29sfGVufDB8fDB8fHww" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Library" />
                        </div>
                        <div className="col-span-1 rounded-2xl overflow-hidden relative group">
                            <img src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Classroom" />
                        </div>
                        <div className="col-span-2 md:col-span-2 rounded-2xl overflow-hidden relative group">
                            <img src="https://plus.unsplash.com/premium_photo-1681505304701-34e8808fbc5a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5ub3ZhdGlvbiUyMGxhYiUyMHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Activities" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-white text-xl font-bold">Innovation Labs</h3>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/gallery" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                            View Full Gallery <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Newsletter / Notice Preview */}
            <section className="py-24 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pink-500 opacity-5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-6 font-serif px-4">
                        Ready to Join the ISBM Family?
                    </h2>
                    <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto px-4">
                        Admissions are open for the upcoming academic session. Give your child
                        a future built on excellence, values, and innovation.
                    </p>
                    <div className="flex justify-center gap-4 flex-col sm:flex-row px-4">
                        <Link
                            to="/contact"
                            className="px-8 py-3 bg-white text-blue-900 font-bold rounded-full hover:bg-blue-50 transition shadow-lg transform hover:-translate-y-0.5"
                        >
                            Contact Us
                        </Link>
                        <Link
                            to="/admissions"
                            className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition transform hover:-translate-y-0.5"
                        >
                            Admission Procedure
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
