import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Home = () => {
    return (
        <div className="w-full min-h-screen flex items-center justify-center relative z-20 pointer-events-auto px-4">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white mb-6 transition-colors drop-shadow-2xl">
                    The Chroma Vault
                </h1>

                <p className="text-xl md:text-2xl text-slate-600 dark:text-gray-300 font-medium max-w-2xl mb-12">
                    Premium inspiration, crafted by the community. Discover, save, and copy beautiful palettes for your next spatial experience.
                </p>

                {/* Uiverse inspired button */}
                <Link to="/vault" className="group relative px-8 py-4 font-bold text-white rounded-full bg-slate-900 dark:bg-white dark:text-black overflow-hidden hover:scale-105 transition-transform shadow-[0_0_40px_rgba(217,70,239,0.4)]">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-DEFAULT via-highlight to-accent-DEFAULT opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    <span className="relative z-10 flex items-center gap-2">
                        Enter The Vault <Sparkles size={18} />
                    </span>
                </Link>

            </div>
        </div>
    );
};
