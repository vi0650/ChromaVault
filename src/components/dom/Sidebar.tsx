/**
 * Sidebar.tsx
 * ────────────────────────────────────────────────
 * Sticky filter sidebar for the Vault page.
 * Uses `sticky` positioning relative to its scroll container.
 * No extra margins/padding that could cause the blank space.
 */

import { Heart, Clock, Sparkles, Shuffle } from 'lucide-react';

interface SidebarProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

// All category tags users can filter by
const CATEGORIES = [
    'Pastel', 'Vintage', 'Retro', 'Neon', 'Gold',
    'Light', 'Dark', 'Warm', 'Cold', 'Summer', 'Fall', 'Winter', 'Spring',
];

// Helper button component for each filter item
const FilterItem = ({
    label,
    icon: Icon,
    value,
    activeFilter,
    setActiveFilter,
}: {
    label: string;
    icon?: React.ElementType;
    value: string;
    activeFilter: string;
    setActiveFilter: (v: string) => void;
}) => {
    const isActive = activeFilter === value;

    return (
        <button
            onClick={() => setActiveFilter(value)}
            className={`
        flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
        ${isActive
                    ? 'bg-accent-DEFAULT/15 text-accent-DEFAULT font-semibold shadow-[0_0_12px_rgba(217,70,239,0.15)]'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }
      `}
        >
            {Icon && (
                <Icon
                    size={16}
                    className={isActive ? 'text-accent-DEFAULT' : 'text-slate-500'}
                />
            )}
            <span>{label}</span>
        </button>
    );
};

export const Sidebar = ({ activeFilter, setActiveFilter }: SidebarProps) => {
    const props = { activeFilter, setActiveFilter };

    return (
        /*
         * Key layout notes:
         *  - `w-56 flex-shrink-0`   → fixed 224 px width, never shrinks
         *  - `sticky top-20`         → sticks 80 px from top (below the fixed header)
         *  - `self-start`            → required with sticky inside a flex parent
         *  - `max-h-[calc(100vh-5rem)] overflow-y-auto` → scrolls internally if content overflows
         *  - NO extra left/right padding that would push content away
         */
        <aside className="w-56 flex-shrink-0 sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto hidden md:block pointer-events-auto">
            <div className="space-y-6 py-2 pr-2">

                {/* ── Main views ──────────────────────────────────── */}
                <div className="space-y-0.5">
                    <FilterItem label="New" icon={Sparkles} value="New"        {...props} />
                    <FilterItem label="Popular" icon={Clock} value="Popular"    {...props} />
                    <FilterItem label="Random" icon={Shuffle} value="Random"     {...props} />
                    <FilterItem label="Collection" icon={Heart} value="Collection" {...props} />
                </div>

                {/* ── Divider ─────────────────────────────────────── */}
                <hr className="border-white/8" />

                {/* ── Category tags ───────────────────────────────── */}
                <div className="space-y-0.5">
                    <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold px-3 pb-1">
                        Categories
                    </p>
                    {CATEGORIES.map(cat => (
                        <FilterItem key={cat} label={cat} value={cat} {...props} />
                    ))}
                </div>

            </div>
        </aside>
    );
};
