/**
 * usePalettes.ts
 * ─────────────────────────────────────────────
 * HOOK LAYER — manages palette list state, pagination, and filter switching.
 * All DB calls go through paletteService (never direct supabase calls here).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPalettes, likePalette } from '../services/paletteService';
import type { ColorPalette } from '../types';
import toast from 'react-hot-toast';

interface UsePalettesReturn {
    palettes: ColorPalette[];
    loading: boolean;
    hasMore: boolean;
    loadMore: () => void;
    handleLike: (paletteId: string, currentLikes: number) => Promise<void>;
}

export function usePalettes(activeFilter: string): UsePalettesReturn {
    const [palettes, setPalettes] = useState<ColorPalette[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    // Track the current page in a ref to avoid stale closure issues
    const pageRef = useRef(0);

    // ─── Load first page whenever the filter changes ─────────────────────────
    useEffect(() => {
        let cancelled = false;

        const loadFirst = async () => {
            setLoading(true);
            pageRef.current = 0;
            setPalettes([]);
            setHasMore(true);

            try {
                const data = await fetchPalettes(activeFilter, 0);
                if (cancelled) return;
                setPalettes(data);
                setHasMore(data.length === 20);
                pageRef.current = 1;
            } catch (err: any) {
                if (!cancelled) {
                    console.error('[usePalettes] Failed to load palettes:', err);
                    toast.error(`Error loading data: ${err.message || 'Check your internet connection'}`);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadFirst();
        return () => { cancelled = true; };
    }, [activeFilter]);


    // ─── Load next page (infinite scroll) ────────────────────────────────────
    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const data = await fetchPalettes(activeFilter, pageRef.current);
            setPalettes(prev => [...prev, ...data]);
            setHasMore(data.length === 20);
            pageRef.current += 1;
        } catch (err) {
            console.error('[usePalettes] Failed to load more:', err);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, loading, hasMore]);

    // ─── Optimistic like ─────────────────────────────────────────────────────
    const handleLike = useCallback(async (paletteId: string, currentLikes: number) => {
        // Optimistic update — show change immediately
        setPalettes(prev =>
            prev.map(p => p.id === paletteId ? { ...p, likes: p.likes + 1 } : p)
        );

        try {
            await likePalette(paletteId, currentLikes);
        } catch {
            // Revert if DB call fails
            setPalettes(prev =>
                prev.map(p => p.id === paletteId ? { ...p, likes: currentLikes } : p)
            );
        }
    }, []);

    return { palettes, loading, hasMore, loadMore, handleLike };
}
