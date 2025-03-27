import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ColorCard } from '../components/ColorCard';
import { supabase } from '../lib/supabase';
import type { ColorPalette } from '../types';

export const Home: React.FC = () => {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPalettes = async () => {
      try {
        const { data, error } = await supabase
          .from('palettes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPalettes(data || []);
      } catch (error) {
        console.error('Error fetching palettes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPalettes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Discover Beautiful Color Palettes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Find and save the perfect color combinations for your next project
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {palettes.map((palette) => (
          <ColorCard key={palette.id} palette={palette} />
        ))}
      </div>
    </main>
  );
};