/**
 * ThemeToggle.tsx
 * ────────────────────────────────────────────────
 * Sun/Moon toggle button. Reads the class already applied by main.tsx
 * so the initial state is always correct (dark by default).
 */

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
    // Read the class that main.tsx already applied before React hydrated
    const [isDark, setIsDark] = useState(
        () => document.documentElement.classList.contains('dark')
    );

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(prev => !prev)}
            className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md hover:scale-110 transition-all cursor-pointer z-50 pointer-events-auto"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {/* Sun icon (light mode) */}
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 180 : 0, scale: isDark ? 0 : 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute"
            >
                <Sun size={16} className="text-amber-400" />
            </motion.div>

            {/* Moon icon (dark mode) */}
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : -180, scale: isDark ? 1 : 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <Moon size={16} className="text-purple-400" />
            </motion.div>
        </button>
    );
};
