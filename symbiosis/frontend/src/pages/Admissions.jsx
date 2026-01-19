import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit3, FiUsers, FiFileText, FiInfo } from "react-icons/fi";

const steps = [
    {
        step: "Step 1",
        title: "Online Application",
        desc: "Fill out the online enquiry/application form.",
        icon: FiEdit3,
    },
    {
        step: "Step 2",
        title: "School Interaction",
        desc: "Visit the school and interact with the Principal or Grade Coordinator.",
        icon: FiUsers,
    },
    {
        step: "Step 3",
        title: "Confirmation",
        desc: "Submit documents and complete the fee payment process.",
        icon: FiFileText,
    },
];

const Admissions = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-14 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Page Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-14 font-serif"
                >
                    Admissions
                </motion.h1>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 mb-14">
                    {steps.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.15 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-2xl shadow-lg p-8 text-center group"
                        >
                            <motion.div
                                whileHover={{ rotate: 8, scale: 1.1 }}
                                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-inner"
                            >
                                <item.icon size={30} />
                            </motion.div>

                            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                                {item.step}
                            </span>
                            <h3 className="mt-2 text-xl font-bold text-gray-900">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl p-6 mb-14"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-blue-600"
                    >
                        <FiInfo size={28} />
                    </motion.div>
                    <p className="text-blue-800 font-medium">
                        Admissions open for <strong>Academic Year 2026–2027</strong> from
                        Nursery to Grade 10.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Interested in Admission?
                    </h2>
                    <Link
                        to="/contact"
                        className="inline-flex items-center px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl hover:shadow-blue-500/40 transition"
                    >
                        Contact Us for Enquiry
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Admissions;
