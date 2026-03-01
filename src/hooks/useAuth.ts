/**
 * useAuth.ts
 * ─────────────────────────────────────────────
 * HOOK LAYER — encapsulates all authentication state and actions.
 * Only supports GitHub OAuth at the user's request.
 */

import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import {
    type User,
    GithubAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut, // Renaming to avoid conflict with the local signOut function
} from 'firebase/auth';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to auth changes
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    /** Sign in with GitHub OAuth */
    const signInWithGitHub = async () => {
        const provider = new GithubAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with GitHub", error);
            throw error;
        }
    };

    /** Sign out the current user */
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
            throw error;
        }
    };

    return { user, loading, signInWithGitHub, signOut };
}
