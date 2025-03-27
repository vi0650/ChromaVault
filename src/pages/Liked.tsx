import React, { useEffect, useState } from 'react';
import { ColorCard } from '../components/ColorCard';
import { supabase } from '../lib/supabase';
import type { ColorPalette } from '../types';
import { Auth } from '../components/Auth';

export const Liked: React.FC = () => {
  const [likedPalettes, setLikedPalettes] = useState<ColorPalette[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndLikes = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (!user) {
          setLoading(false);
          return;
        }

        // First get all likes for the user
        const { data: likes, error: likesError } = await supabase
          .from('likes')
          .select('palette_id')
          .eq('user_id', user.id);

        if (likesError) throw likesError;

        if (!likes?.length) {
          setLikedPalettes([]);
          setLoading(false);
          return;
        }

        // Then fetch the actual palettes
        const paletteIds = likes.map(like => like.palette_id);
        const { data: palettes, error: palettesError } = await supabase
          .from('palettes')
          .select('*')
          .in('id', paletteIds);

        if (palettesError) throw palettesError;
        
        setLikedPalettes(palettes || []);
      } catch (error) {
        console.error('Error fetching liked palettes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLikes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sign In to View Liked Palettes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to see your liked color palettes
          </p>
        </div>
        <Auth />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Liked Palettes</h1>
      
      {likedPalettes.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>You haven't liked any palettes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedPalettes.map((palette) => (
            <ColorCard key={palette.id} palette={palette} />
          ))}
        </div>
      )}
    </div>
  );
};