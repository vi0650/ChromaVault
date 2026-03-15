import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Palette, Plus } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Auth } from './Auth';
import { seedPalettes } from '../../lib/seedPalettes';
import toast from 'react-hot-toast';

export const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        const handleKeyPress = async (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                const toastId = toast.loading('Seeding palettes...');
                try {
                    const count = await seedPalettes();
                    toast.success(`Successfully seeded ${count} palettes!`, { id: toastId });
                    window.location.reload();
                } catch (err) {
                    toast.error('Seeding failed.', { id: toastId });
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    // Only apply text-white on Home page if not scrolled, else use theme colors
    const isHome = location.pathname === '/';
    const headerClasses = `fixed top-0 left-0 right-0 z-50 pointer-events-auto transition-all duration-300 ${scrolled
        ? 'bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10 py-4'
        : 'bg-transparent py-6'
        }`;

    const textClasses = scrolled || !isHome ? 'text-slate-900 dark:text-white' : 'text-white';

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link to="/" className={`${textClasses} flex items-center gap-3 group transition-colors`}>
                    <Palette size={28} className="transition-transform group-hover:rotate-12" />
                    <span className="font-bold text-xl tracking-tighter">ChromaVault</span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Auth />
                    <ThemeToggle />
                    {isHome ? (
                        <Link
                            to="/vault"
                            className="flex items-center gap-2 text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 px-5 py-2.5 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            <Palette size={16} />
                            Open Vault
                        </Link>
                    ) : (
                        <Link
                            to="/create"
                            className="flex items-center gap-2 text-sm font-medium text-white bg-accent-DEFAULT hover:bg-accent-hover px-5 py-2.5 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(217,70,239,0.3)]"
                        >
                            <Plus size={16} />
                            New Palette
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};
