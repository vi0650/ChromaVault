/**
 * Auth.tsx
 * ─────────────────────────────────────
 * Header auth widget — ONLY GitHub sign-in.
 * Google login has been removed at the user's request.
 */

import { useState } from 'react';
import { Github, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export const Auth = () => {
    const { user, loading, signInWithGitHub, signOut } = useAuth();
    const [authLoading, setAuthLoading] = useState(false);

    const handleGitHub = async () => {
        setAuthLoading(true);
        try {
            await signInWithGitHub();
            // Page will redirect; no need to reset state
        } catch {
            toast.error('GitHub sign-in failed. Check your GitHub App settings.');
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success('Logged out successfully');
        } catch {
            toast.error('Logout failed');
        }
    };

    // ── Loading Skeleton ────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="w-9 h-9 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-white/50" />
            </div>
        );
    }

    // ── Logged-in State ─────────────────────────────────────────────────────
    if (user) {
        return (
            <div className="flex items-center gap-3">
                {/* User Pill */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <img
                        src={
                            user.user_metadata.avatar_url ||
                            `https://ui-avatars.com/api/?name=${user.email}&background=random`
                        }
                        alt="Avatar"
                        className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm text-white/80 font-medium">
                        {user.user_metadata.user_name ||
                            user.user_metadata.name ||
                            user.email?.split('@')[0]}
                    </span>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all cursor-pointer text-white/50"
                >
                    <LogOut size={16} />
                </button>
            </div>
        );
    }

    // ── Signed-out state — GitHub Sign-In ───────────────────────────────────
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleGitHub}
                disabled={authLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-[#24292e] hover:bg-[#2f363d] text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(36,41,46,0.3)] cursor-pointer disabled:opacity-60 hover:scale-[1.03] active:scale-95 group"
            >
                {authLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Github size={16} className="group-hover:rotate-12 transition-transform" />
                )}
                <span>Sign in with GitHub</span>
            </button>
        </div>
    );
};
