/**
 * Auth.tsx
 * ─────────────────────────────────────────────
 * Handles the user authentication state and renders either
 * the user profile or a sign-in button.
 */

import { Github, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Auth = () => {
    const { user, handleGitHub, handleLogout, authLoading } = useAuth();

    // ── RENDER ──────────────────────────────────────────────────────────────

    // ── Logged-in State ─────────────────────────────────────────────────────
    if (user) {
        return (
            <div className="flex items-center gap-3">
                {/* User Pill */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <img
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}`}
                        alt="Avatar"
                        className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm text-white/80 font-medium">
                        {user.displayName || user.email?.split('@')[0]}
                    </span>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                    <LogOut size={16} className="text-white/60" />
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
