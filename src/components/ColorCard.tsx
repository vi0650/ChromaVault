import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ColorPalette } from '../types';
import toast from 'react-hot-toast';

interface ColorCardProps {
  palette: ColorPalette;
  onLikeUpdate?: (paletteId: string, newLikeCount: number) => void;
}

export const ColorCard: React.FC<ColorCardProps> = ({ palette, onLikeUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(palette.likes);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showColorCodes, setShowColorCodes] = useState(false);

  useEffect(() => {
    checkIfLiked();
  }, []);

  useEffect(() => {
    setLikeCount(palette.likes);
  }, [palette.likes]);

  const checkIfLiked = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('palette_id', palette.id)
        .maybeSingle();

      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLikeClick = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to like palettes');
        return;
      }

      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;

      if (isLiked) {
        const { error: unlikeError } = await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('palette_id', palette.id);

        if (unlikeError) throw unlikeError;

        const { error: updateError } = await supabase
          .from('palettes')
          .update({ likes: newLikeCount })
          .eq('id', palette.id);

        if (updateError) throw updateError;

        setIsLiked(false);
        setLikeCount(newLikeCount);
        onLikeUpdate?.(palette.id, newLikeCount);
        toast.success('Palette unliked');
      } else {
        const { data: existingLike } = await supabase
          .from('likes')
          .select('id')
          .eq('user_id', user.id)
          .eq('palette_id', palette.id)
          .maybeSingle();

        if (existingLike) {
          setIsLiked(true);
          return;
        }

        const { error: likeError } = await supabase
          .from('likes')
          .insert([
            { user_id: user.id, palette_id: palette.id }
          ]);

        if (likeError) throw likeError;

        const { error: updateError } = await supabase
          .from('palettes')
          .update({ likes: newLikeCount })
          .eq('id', palette.id);

        if (updateError) throw updateError;

        setIsLiked(true);
        setLikeCount(newLikeCount);
        onLikeUpdate?.(palette.id, newLikeCount);
        toast.success('Palette liked!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    } finally {
      setIsLoading(false);
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-dark-200 rounded-lg overflow-hidden shadow-lg transition-shadow hover:shadow-xl"
    >
      <div 
        className="h-32 flex relative"
        onMouseEnter={() => setShowColorCodes(true)}
        onMouseLeave={() => setShowColorCodes(false)}
      >
        {palette.colors.map((color, index) => (
          <div
            key={index}
            className="flex-1 cursor-pointer transition-transform hover:transform hover:scale-y-105 relative group"
            style={{ backgroundColor: color }}
            onClick={() => {
              navigator.clipboard.writeText(color);
              toast.success(`Copied ${color} to clipboard!`);
            }}
          >
            {showColorCodes && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-mono">{color}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {palette.tags?.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 dark:bg-dark-300 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={handleLikeClick}
            disabled={isLoading || isLiking}
            className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
              isLiked
                ? 'text-highlight'
                : 'text-gray-600 dark:text-gray-400 hover:text-highlight'
            } ${(isLoading || isLiking) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart
              size={18}
              className={isLiked ? 'fill-current' : ''}
            />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};