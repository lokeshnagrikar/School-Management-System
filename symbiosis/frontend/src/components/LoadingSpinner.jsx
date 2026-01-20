import { motion } from "framer-motion";

const LoadingSpinner = ({ fullScreen = true, message = "Loading..." }) => {
    const containerClasses = fullScreen
        ? "min-h-screen flex flex-col justify-center items-center bg-gray-50/50 backdrop-blur-sm fixed inset-0 z-50"
        : "flex flex-col justify-center items-center py-20";

    return (
        <div className={containerClasses}>
            <motion.div
                className="relative w-20 h-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Outer Ring */}
                <motion.span
                    className="absolute inset-0 border-4 border-blue-200 rounded-full"
                />

                {/* Spinning Ring */}
                <motion.span
                    className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Pulse */}
                <motion.div
                    className="absolute inset-0 m-auto w-4 h-4 bg-blue-600 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            <motion.p
                className="mt-4 text-blue-800 font-semibold tracking-wider text-sm uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                {message}
            </motion.p>
        </div>
    );
};

export default LoadingSpinner;
