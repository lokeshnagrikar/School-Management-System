import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const floatVariants = {
    animate: {
        y: [0, -6, 0],
        rotate: [0, 4, -4, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const glowVariants = {
    animate: {
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.05, 1],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const AnimatedNavIcon = () => {
    return (
        <div className="relative flex items-center">
            {/* Glow */}
            <motion.div
                variants={glowVariants}
                animate="animate"
                className="absolute -inset-2 rounded-xl bg-gradient-to-r
                           from-blue-500 via-indigo-500 to-violet-500
                           blur-xl opacity-60"
            />

            {/* Icon */}
            <motion.div
                variants={floatVariants}
                animate="animate"
                whileHover={{ scale: 1.12, rotate: 8 }}
                className="relative z-10 w-10 h-10 rounded-xl
                           bg-white dark:bg-slate-900
                           shadow-lg dark:shadow-slate-900/60
                           flex items-center justify-center
                           text-blue-600 dark:text-blue-400 border border-white/20"
            >
                <FaGraduationCap className="text-2xl" />
            </motion.div>
        </div>
    );
};

export default AnimatedNavIcon;
