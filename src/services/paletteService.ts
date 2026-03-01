/**
 * paletteService.ts
 * ─────────────────────────────────────────────
 * DATA LAYER — all direct Firebase calls live here.
 * Components/hooks must NEVER call firebase directly.
 */

import { db, auth } from '../lib/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    increment,
    serverTimestamp,
    startAfter,
    DocumentSnapshot,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import type { ColorPalette } from '../types';

const PAGE_SIZE = 20;

// Helper to convert Firestore docs to ColorPalette objects
const fromFirestore = (docSnapshot: QueryDocumentSnapshot): ColorPalette => {
    const data = docSnapshot.data();
    return {
        id: docSnapshot.id,
        colors: data.colors,
        tags: data.tags,
        likes: data.likes,
        user_id: data.user_id,
        created_at: data.created_at?.toDate().toISOString(),
    };
};

/** Fetch a page of palettes with optional filter */
export async function fetchPalettes(
    filter: string,
    lastDoc: DocumentSnapshot | null
): Promise<{ palettes: ColorPalette[], lastDoc: DocumentSnapshot | null }> {
    let palettesQuery = query(collection(db, 'palettes'));

    // Apply filters and ordering
    if (filter === 'Popular') {
        palettesQuery = query(palettesQuery, orderBy('likes', 'desc'));
    } else if (filter === 'New') {
        palettesQuery = query(palettesQuery, orderBy('created_at', 'desc'));
    } else if (filter === 'Random') {
        // Firestore doesn't have a native 'random' order. Fallback to ordering by new.
        palettesQuery = query(palettesQuery, orderBy('created_at', 'desc'));
    } else if (filter === 'Collection') {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            return { palettes: [], lastDoc: null };
        }
        palettesQuery = query(palettesQuery, where('user_id', '==', userId), orderBy('created_at', 'desc'));
    } else {
        // Tag-based filter
        palettesQuery = query(
            palettesQuery,
            where('tags', 'array-contains', filter.toLowerCase()),
            orderBy('created_at', 'desc')
        );
    }
    
    // Apply pagination
    if (lastDoc) {
        palettesQuery = query(palettesQuery, startAfter(lastDoc));
    }
    palettesQuery = query(palettesQuery, limit(PAGE_SIZE));

    const querySnapshot = await getDocs(palettesQuery);
    const palettes = querySnapshot.docs.map(fromFirestore);
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return { palettes, lastDoc: lastVisible };
}

/** Insert a new palette row */
export async function insertPalette(
    colors: string[],
    tags: string[],
    userId: string
): Promise<void> {
    await addDoc(collection(db, 'palettes'), {
        colors,
        tags,
        user_id: userId,
        likes: 0,
        created_at: serverTimestamp(), // Use server timestamp for consistency
    });
}

/** Increment the like count for a palette */
export async function likePalette(
    paletteId: string,
    currentLikes: number // currentLikes is not needed for Firestore's increment
): Promise<void> {
    const paletteRef = doc(db, 'palettes', paletteId);
    // Use the atomic 'increment' operation
    await updateDoc(paletteRef, {
        likes: increment(1)
    });
}
