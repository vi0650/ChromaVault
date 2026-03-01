/**
 * Create.tsx
 * ─────────────────────────────────────────────
 * Page for creating and saving new color palettes.
 * Uses insertPalette service from the data layer.
 */

import { useState } from 'react';
import { Save, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { insertPalette } from '../services/paletteService';
import { useAuth } from '../hooks/useAuth';

export const CreatePalette = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [colors, setColors] = useState<string[]>(['#EA5A47', '#F5CD7A', '#34A0A4', '#164E63']);
    const [tags, setTags] = useState('');
    const [saving, setSaving] = useState(false);

    const handleColorChange = (index: number, newColor: string) => {
        const updated = [...colors];
        updated[index] = newColor;
        setColors(updated);
    };

    const addColor = () => {
        if (colors.length >= 8) return;
        setColors(prev => [...prev, '#888888']);
    };

    const removeColor = (index: number) => {
        if (colors.length <= 2) return;
        setColors(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!user) {
            toast.error('Sign in required to save palettes.');
            return;
        }

        setSaving(true);
        try {
            const tagArray = tags
                .split(',')
                .map(t => t.trim().toLowerCase())
                .filter(t => t.length > 0);

            await insertPalette(colors, tagArray, user.uid);
            toast.success('Palette saved to Vault!');
            setTimeout(() => navigate('/vault'), 800);
        } catch (err) {
            console.error(err);
            toast.error('Failed to save palette.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-screen pt-24 pb-16 px-4 relative z-10 pointer-events-auto flex items-center justify-center"
        >
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">

                {/* ── Preview panel ──────────────────────────────────────────────── */}
                <div className="aspect-square relative rounded-3xl overflow-hidden flex flex-col justify-end p-8 bg-black/30 border border-white/10 backdrop-blur-xl">
                    {/* Full-swatch preview fills the whole card */}
                    <div className="absolute inset-0 flex">
                        {colors.map((c, i) => (
                            <div
                                key={i}
                                className="flex-1 transition-colors duration-300"
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>

                    {/* Strip preview at the bottom */}
                    <div className="relative z-10">
                        <p className="text-white/50 mb-3 font-mono text-xs uppercase tracking-widest drop-shadow">
                            Preview
                        </p>
                        <div className="flex w-full h-14 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                            {colors.map((c, i) => (
                                <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Editor controls ────────────────────────────────────────────── */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-white mb-2">
                            Mix Colors
                        </h1>
                        <p className="text-gray-400">
                            Tweak the values to craft the perfect palette.
                        </p>
                    </div>

                    {/* Color pickers */}
                    <div className="space-y-3">
                        {colors.map((color, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10 backdrop-blur-md group"
                            >
                                {/* Native color input */}
                                <input
                                    type="color"
                                    value={color}
                                    onChange={e => handleColorChange(index, e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0 shadow-inner"
                                />

                                {/* Hex text input */}
                                <input
                                    type="text"
                                    value={color.toUpperCase()}
                                    onChange={e => handleColorChange(index, e.target.value)}
                                    className="bg-transparent border-none text-white font-mono text-base focus:ring-0 w-28 outline-none"
                                />

                                {/* Swatch preview dot */}
                                <div
                                    className="ml-auto w-6 h-6 rounded-full border border-white/20 flex-shrink-0"
                                    style={{ backgroundColor: color }}
                                />

                                {/* Remove color button */}
                                <button
                                    onClick={() => removeColor(index)}
                                    disabled={colors.length <= 2}
                                    className="text-slate-600 hover:text-red-400 transition-colors disabled:opacity-20 cursor-pointer"
                                >
                                    <Minus size={14} />
                                </button>
                            </div>
                        ))}

                        {/* Add color button */}
                        {colors.length < 8 && (
                            <button
                                onClick={addColor}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-accent-DEFAULT transition-colors px-2 cursor-pointer"
                            >
                                <Plus size={16} /> Add color
                            </button>
                        )}
                    </div>

                    {/* Tags + Save */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Tags <span className="text-slate-600">(comma separated)</span>
                            </label>
                            <input
                                type="text"
                                value={tags}
                                onChange={e => setTags(e.target.value)}
                                placeholder="dark, neon, minimal..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent-DEFAULT transition-colors"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-accent-DEFAULT hover:bg-accent-hover disabled:opacity-60 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_40px_rgba(217,70,239,0.5)] hover:scale-[1.02] cursor-pointer"
                        >
                            <Save size={18} />
                            {saving ? 'Saving…' : 'Save to Vault'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
