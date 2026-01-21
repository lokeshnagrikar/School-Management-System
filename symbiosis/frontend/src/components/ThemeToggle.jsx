import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { RiSunLine, RiMoonClearLine } from 'react-icons/ri';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{
                    y: theme === 'dark' ? 0 : 30,
                    opacity: theme === 'dark' ? 1 : 0,
                    rotate: theme === 'dark' ? 0 : 90
                }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className="absolute inset-0 flex items-center justify-center p-2"
            >
                <RiMoonClearLine className="text-blue-500 w-5 h-5" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    y: theme === 'light' ? 0 : -30,
                    opacity: theme === 'light' ? 1 : 0,
                    rotate: theme === 'light' ? 0 : -90
                }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className="flex items-center justify-center p-0.5"
            >
                <RiSunLine className="text-orange-500 w-5 h-5" />
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
