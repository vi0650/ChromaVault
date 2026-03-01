/**
 * paletteService.ts
 * ─────────────────────────────────────────────
 * DATA LAYER — all direct Supabase calls live here.
 * Components/hooks must NEVER call supabase directly.
 */

import { supabase } from '../lib/supabase';
import type { ColorPalette } from '../types';

const PAGE_SIZE = 20;

// ─── READ ──────────────────────────────────────────────────────────────────

/** Fetch a page of palettes with optional filter */
export async function fetchPalettes(
    filter: string,
    page: number
): Promise<ColorPalette[]> {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from('palettes').select('*');

    if (filter === 'Popular') {
        query = query.order('likes', { ascending: false });
    } else if (filter === 'New') {
        query = query.order('created_at', { ascending: false });
    } else if (filter === 'Random') {
        // Uses a Postgres RPC for true random; falls back to date order
        query = query.order('created_at', { ascending: false });
    } else if (filter === 'Collection') {
        // Caller must verify auth before calling this branch
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        if (!userId) throw new Error('NOT_AUTHENTICATED');
        query = query.eq('user_id', userId).order('created_at', { ascending: false });
    } else {
        // Category tag filter (Pastel, Neon, etc.)
        query = query
            .contains('tags', [filter.toLowerCase()])
            .order('created_at', { ascending: false });
    }

    const { data, error } = await query.range(from, to);
    if (error) throw error;
    return (data ?? []) as ColorPalette[];
}

// ─── WRITE ─────────────────────────────────────────────────────────────────

/** Insert a new palette row */
export async function insertPalette(
    colors: string[],
    tags: string[],
    userId: string
): Promise<void> {
    const { error } = await supabase.from('palettes').insert([
        { colors, tags, user_id: userId, likes: 0 },
    ]);
    if (error) throw error;
}

/** Increment the like count for a palette */
export async function likePalette(
    paletteId: string,
    currentLikes: number
): Promise<void> {
    const { error } = await supabase
        .from('palettes')
        .update({ likes: currentLikes + 1 })
        .eq('id', paletteId);
    if (error) throw error;
}
