import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const palettes = [
  // ── WARM & EARTHY ──
  { colors: ['#A67C52', '#8B5E3C', '#F5ECD7', '#2C1A0E'], tags: ['Warm', 'Earthy', 'Coffee', 'Mocha'] },
  { colors: ['#C8A882', '#E8D5B7', '#6B4226', '#3A2010'], tags: ['Earthy', 'Vintage', 'Warm', 'Brown'] },
  { colors: ['#D4956A', '#E8C9A0', '#A0522D', '#F7F0E6'], tags: ['Autumn', 'Warm', 'Rustic', 'Natural'] },
  { colors: ['#BFA181', '#8C6B45', '#F2E8D9', '#4A3728'], tags: ['Sand', 'Neutral', 'Warm', 'Minimal'] },
  { colors: ['#E07B54', '#C45C3A', '#F5C9A8', '#2D1810'], tags: ['Burnt Orange', 'Bold', 'Warm', 'Energetic'] },

  // ── ETHEREAL BLUES & COOL TONES ──
  { colors: ['#B8D4E8', '#7BA7C7', '#3D7BAD', '#1A3F5C'], tags: ['Blue', 'Calm', 'Ocean', 'Serene'] },
  { colors: ['#E8F4FD', '#A8D4F5', '#5BA3D9', '#1A5C8A'], tags: ['Sky', 'Light', 'Clean', 'Professional'] },
  { colors: ['#8EC5E6', '#5DA0C8', '#2A6FA8', '#0D3D6B'], tags: ['Cold', 'Corporate', 'Trust', 'Deep'] },
  { colors: ['#D6EAF8', '#AED6F1', '#5DADE2', '#1A5276'], tags: ['Pastel', 'Blue', 'Soft', 'Calm'] },
  { colors: ['#4FC3D7', '#2196A8', '#0D6E7A', '#F0FAFB'], tags: ['Teal', 'Modern', 'Fresh', 'Digital'] },

  // ── LAVENDER & PURPLE ──
  { colors: ['#E8DAEF', '#C39BD3', '#8E44AD', '#4A235A'], tags: ['Purple', 'Elegant', 'Luxury', 'Rich'] },
  { colors: ['#F3E5F5', '#CE93D8', '#9C27B0', '#4A148C'], tags: ['Lavender', 'Gradient', 'Vibrant', 'Modern'] },
  { colors: ['#EDE7F6', '#B39DDB', '#673AB7', '#311B92'], tags: ['Deep Purple', 'Dark', 'Bold', 'Professional'] },
  { colors: ['#F8F0FF', '#D7BFFF', '#9B59B6', '#2E1065'], tags: ['Pastel', 'Purple', 'Soft', 'Dreamy'] },

  // ── NEON & CYBERPUNK ──
  { colors: ['#0D0D0D', '#1A1A2E', '#C8FF00', '#39FF14'], tags: ['Neon', 'Dark', 'Cyberpunk', 'Bold'] },
  { colors: ['#000000', '#0A0A2A', '#FF00FF', '#00FFFF'], tags: ['Neon', 'Vibrant', 'Dark', 'Tech'] },
  { colors: ['#1A0A2E', '#2D1B69', '#FF6EC7', '#00D4FF'], tags: ['Neon', 'Retro', 'Vibrant', 'Bold'] },
  { colors: ['#0F1923', '#1A3A4A', '#00FF88', '#F5F5F5'], tags: ['Matrix', 'Dark', 'Neon', 'Tech'] },

  // ── CREAMY PASTELS & SOFT NEUTRALS ──
  { colors: ['#FFF9F0', '#FDEBD0', '#F8C471', '#E59866'], tags: ['Cream', 'Warm', 'Pastel', 'Soft'] },
  { colors: ['#FEF9F0', '#FAE5D3', '#E8B4A0', '#C0917A'], tags: ['Peach', 'Pastel', 'Soft', 'Romantic'] },
  { colors: ['#F9F6F1', '#EDE0D0', '#C8A882', '#8B6F47'], tags: ['Linen', 'Neutral', 'Minimal', 'Warm'] },
  { colors: ['#FAFAFA', '#F0EBE3', '#D4C5B0', '#7A6A57'], tags: ['Greige', 'Neutral', 'Minimal', 'Clean'] },

  // ── NATURE & BOTANICAL ──
  { colors: ['#2D5A27', '#4CAF50', '#A5D6A7', '#F1F8E9'], tags: ['Green', 'Nature', 'Fresh', 'Eco'] },
  { colors: ['#1B5E20', '#388E3C', '#C8E6C9', '#F9FBE7'], tags: ['Forest', 'Nature', 'Spring', 'Botanical'] },
  { colors: ['#8D6E63', '#A1887F', '#D7CCC8', '#EFEBE9'], tags: ['Earthy', 'Muted', 'Natural', 'Warm'] },
  { colors: ['#33691E', '#7CB342', '#E6EE9C', '#FAFDE7'], tags: ['Lime', 'Spring', 'Fresh', 'Vibrant'] },

  // ── BOLD CONTRAST & MAXIMALIST ──
  { colors: ['#FF1744', '#FF9100', '#FFEA00', '#00E676'], tags: ['Bold', 'Vibrant', 'Energetic', 'Maximalist'] },
  { colors: ['#E53935', '#1E88E5', '#F9A825', '#FFFFFF'], tags: ['Primary', 'Bold', 'Graphic', 'Classic'] },
  { colors: ['#BF360C', '#F4511E', '#FF8A65', '#FBE9E7'], tags: ['Red', 'Warm', 'Gradient', 'Bold'] },
  { colors: ['#263238', '#37474F', '#FF7043', '#ECEFF1'], tags: ['Dark', 'Contrast', 'Modern', 'Professional'] },
  { colors: ['#1A237E', '#283593', '#F57F17', '#FFF9C4'], tags: ['Contrast', 'Bold', 'Retro', 'Graphic'] },
];

export const seedPalettes = async () => {
  console.log('🚀 Starting palette seeding...');
  const palettesCollection = collection(db, 'palettes');
  
  let successCount = 0;
  for (const palette of palettes) {
    try {
      await addDoc(palettesCollection, {
        ...palette,
        likes: 0,
        created_at: serverTimestamp()
      });
      successCount++;
      console.log(`✅ [${successCount}/${palettes.length}] Added: ${palette.tags[0]}`);
    } catch (e) {
      console.error('❌ Error adding document: ', e);
    }
  }
  
  console.log(`🎨 Finished seeding ${successCount} palettes.`);
  return successCount;
};
