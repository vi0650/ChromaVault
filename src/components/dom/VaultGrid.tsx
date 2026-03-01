/**
 * VaultGrid.tsx
 * ─────────────────────────────────────────────────────────────────
 * VIEW LAYER — renders palette cards, sidebar, infinite scroll.
 * Data fetching is handled by `usePalettes` hook.
 * Direct Supabase calls have been removed from this file.
 */

import { useRef, useLayoutEffect, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Heart, Check, Copy, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { Sidebar } from './Sidebar';
import { usePalettes } from '../../hooks/usePalettes';
import { useAuth } from '../../hooks/useAuth';

export const VaultGrid = () => {
    const [activeFilter, setActiveFilter] = useState('New');
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const { palettes, loading, hasMore, loadMore, handleLike } = usePalettes(activeFilter);
    const { user } = useAuth();

    const gridRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // ─── GSAP entrance animation when palettes list changes ────────────────
    useLayoutEffect(() => {
        if (palettes.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.palette-card',
                { y: 60, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.9,
                    stagger: 0.07,
                    ease: 'power3.out',
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [palettes.length]);

    // ─── Intersection Observer for infinite scroll ─────────────────────────
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                loadMore();
            }
        }, { threshold: 0.1 });

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, loadMore]);

    // ─── Copy color hex to clipboard ───────────────────────────────────────
    const handleCopy = (color: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        toast.success(`Copied ${color}`);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    // ─── Like handler (requires auth) ──────────────────────────────────────
    const onLike = async (paletteId: string, currentLikes: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            toast.error('Sign in to like palettes');
            return;
        }
        await handleLike(paletteId, currentLikes);
    };

    return (
        /*
         * Layout:
         *  - The outer wrapper is NOT min-h-screen; VaultRoute controls full height
         *  - flex gap-8 puts sidebar next to the grid without extra top space
         */
        <div ref={containerRef} className="w-full pointer-events-auto">
            <div className="flex gap-8 items-start">

                {/* ── Sticky sidebar ─────────────────────────────────────────────── */}
                <Sidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

                {/* ── Main content area ─────────────────────────────────────────── */}
                <div className="flex-1 min-w-0">

                    {/* Empty state */}
                    {!loading && palettes.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                            <p className="text-lg font-medium">No palettes found</p>
                            <p className="text-sm mt-1 text-slate-600">Try a different filter or create the first one!</p>
                        </div>
                    )}

                    {/* Palette grid */}
                    <div
                        ref={gridRef}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full"
                    >
                        {palettes.map(palette => (
                            <div
                                key={palette.id}
                                className="palette-card group cursor-pointer flex flex-col h-[300px]"
                            >
                                {/* Color swatch card */}
                                <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/5 bg-black/20 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-white/15 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                                    <div className="absolute inset-0 flex flex-col">
                                        {palette.colors?.map(color => (
                                            <div
                                                key={color}
                                                onClick={e => handleCopy(color, e)}
                                                className="flex-1 w-full flex items-end p-3 cursor-copy relative group/color transition-all duration-300 hover:flex-[1.8]"
                                                style={{ backgroundColor: color }}
                                            >
                                                {/* Color hex badge — appears on hover */}
                                                <div className="opacity-0 group-hover/color:opacity-100 translate-y-1 group-hover/color:translate-y-0 transition-all duration-200 bg-black/60 backdrop-blur-md text-white font-mono text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                                    {copiedColor === color ? <Check size={11} /> : <Copy size={11} />}
                                                    {color.toUpperCase()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Meta row: tags + like */}
                                <div className="mt-3 flex items-center justify-between px-1 text-slate-500">
                                    <div className="flex gap-1.5 flex-wrap">
                                        {palette.tags?.slice(0, 2).map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full uppercase tracking-wider font-semibold text-slate-400"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={e => onLike(palette.id, palette.likes || 0, e)}
                                        className="flex items-center gap-1.5 font-mono text-xs font-medium hover:text-accent-DEFAULT transition-colors group/like cursor-pointer"
                                    >
                                        <Heart
                                            size={14}
                                            className="group-hover/like:fill-accent-DEFAULT group-hover/like:text-accent-DEFAULT transition-all active:scale-75"
                                        />
                                        {palette.likes || 0}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Infinite scroll sentinel & spinner ─────────────────────── */}
                    <div ref={loadMoreRef} className="h-16 w-full flex items-center justify-center mt-8">
                        {loading && (
                            <Loader2 size={24} className="animate-spin text-accent-DEFAULT/60" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
