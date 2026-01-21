import { motion } from 'framer-motion';
import { FiAward, FiBook, FiUsers, FiTarget, FiHeart, FiClock, FiCheckCircle } from 'react-icons/fi';

const About = () => {
    // Animation Variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-slate-950 min-h-screen font-sans overflow-hidden transition-colors duration-300">
            {/* 1. Hero Section - Parallax style */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1950&q=80"
                        alt="School Building"
                        className="w-full h-full object-cover brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center max-w-4xl px-4 mt-16">
                    <motion.span
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold tracking-wider uppercase mb-4 backdrop-blur-md"
                    >
                        Since 2000
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif tracking-tight"
                    >
                        Building Future <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Generations</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
                    >
                        More than just a school. We are a community dedicated to excellence, innovation, and character.
                    </motion.p>
                </div>
            </section>

            {/* 2. Our Success Story (Text + Image) */}
            <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    <motion.div variants={fadeInUp} className="relative">
                        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 z-0"></div>
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800 transition-colors">
                            <img
                                src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                                alt="Students Learning"
                                className="w-full h-auto transform hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Floating Stats Card */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-10 -right-10 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 hidden md:block transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                                    <FiUsers size={24} />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">25+</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Years of Experience</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="space-y-8">
                        <div>
                            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Our Story</span>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4 font-serif transition-colors">A Legacy of Excellence</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed transition-colors">
                                Founded in 2000, ISBM School started with a humble vision: to create a space where education goes beyond textbooks. Today, we stand as a beacon of knowledge, having nurtured thousands of young minds who are now leaders in various fields across the globe.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: "Holistic Development", icon: FiHeart },
                                { title: "Global Curriculum", icon: FiBook },
                                { title: "State-of-the-art Infrastructure", icon: FiCheckCircle }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="font-semibold text-gray-800 dark:text-white">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* 3. Mission & Vision Cards */}
            <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 gap-8"
                    >
                        {/* Vision Card */}
                        <motion.div
                            variants={fadeInUp}
                            className="group p-10 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-[2rem] border border-blue-100 dark:border-slate-700 hover:shadow-2xl dark:hover:shadow-slate-900/50 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <FiTarget size={150} className="text-blue-600 dark:text-blue-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                                    <FiTarget size={28} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Our Vision</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed transition-colors">
                                    To be a global institution that nurtures creative thinkers, compassionate leaders, and responsible citizens who contribute positively to society through innovation and integrity.
                                </p>
                            </div>
                        </motion.div>

                        {/* Mission Card */}
                        <motion.div
                            variants={fadeInUp}
                            className="group p-10 bg-gradient-to-br from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-[2rem] border border-purple-100 dark:border-slate-700 hover:shadow-2xl dark:hover:shadow-slate-900/50 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <FiAward size={150} className="text-purple-600 dark:text-purple-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                                    <FiAward size={28} />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Our Mission</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed transition-colors">
                                    We inspire a love for learning, foster critical thinking, and empower students with 21st-century skills to thrive in an ever-changing world while staying rooted in values.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 4. Principal's Message */}
            <section className="py-24 max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-gray-900 dark:bg-black rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-gray-800 dark:border-gray-800"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                    <div className="relative z-10">
                        <div className="mx-auto w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 backdrop-blur-sm">
                            <span className="text-4xl">❝</span>
                        </div>
                        <p className="text-2xl md:text-3xl font-serif leading-relaxed italic text-gray-200 mb-10">
                            "Education is not just about filling a bucket, but lighting a fire. At ISBM, we strive to ignite the curiosity and passion within every child, preparing them not just for exams, but for life."
                        </p>
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-4 border-white/20 overflow-hidden mb-4 shadow-lg">
                                <img src="https://topcbscschools.in/wp-content/uploads/2021/08/dummy-profile-pic-male1.jpg" alt="Principal" className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-xl font-bold text-white">Dr. A. Sharma</h4>
                            <p className="text-blue-400 font-medium tracking-wide uppercase text-sm">Principal</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 5. Core Values */}
            <section className="py-20 bg-blue-50 dark:bg-slate-900/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-sm">Our Philosophy</span>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2 font-serif transition-colors">Core Values</h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: "Integrity", icon: FiCheckCircle, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
                            { name: "Excellence", icon: FiAward, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-100 dark:bg-purple-900/30" },
                            { name: "Respect", icon: FiHeart, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-100 dark:bg-pink-900/30" },
                            { name: "Discipline", icon: FiClock, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-900/30" }
                        ].map((val, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-300 group border border-gray-100 dark:border-slate-700"
                            >
                                <div className={`w-16 h-16 mx-auto ${val.bg} ${val.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <val.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{val.name}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
