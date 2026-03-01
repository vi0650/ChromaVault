import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const palettes = [
    // Existing palettes with corrected tags
    { colors: ['#222831', '#393E46', '#00ADB5', '#EEEEEE'], tags: ['Dark', 'Modern', 'Professional'] },
    { colors: ['#FFD93D', '#FF6B6B', '#4D96FF', '#6BCB77'], tags: ['Vibrant', 'Playful', 'Energetic'] },
    { colors: ['#F9ED69', '#F08A5D', '#B83B5E', '#6A2C70'], tags: ['Sunset', 'Warm', 'Gradient'] },
    { colors: ['#F9F7F7', '#DBE2EF', '#3F72AF', '#112D4E'], tags: ['Corporate', 'Clean', 'Professional', 'Light'] },
    { colors: ['#FFF5E4', '#FFE3E1', '#FFD1D1', '#FF9494'], tags: ['Pastel', 'Soft', 'Romantic'] },
    { colors: ['#2C3333', '#395B64', '#A5C9CA', '#E7F6F2'], tags: ['Ocean', 'Calm', 'Professional', 'Cold'] },
    { colors: ['#F7ECDE', '#E9DAC1', '#9ED2C6', '#54BAB9'], tags: ['Nature', 'Earthy', 'Soothing'] },
    { colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560'], tags: ['Dark', 'Modern', 'Contrast'] },
    { colors: ['#F8EDE3', '#BDD2B6', '#A2B29F', '#798777'], tags: ['Nature', 'Muted', 'Elegant'] },
    { colors: ['#FF7B54', '#FFB26B', '#FFD56F', '#939B62'], tags: ['Autumn', 'Warm', 'Natural', 'Fall'] },
    { colors: ['#CDFCF6', '#98ECF6', '#7B89F9', '#5B4B8A'], tags: ['Cool', 'Gradient', 'Modern', 'Cold'] },
    { colors: ['#F0E3CA', '#FF8303', '#A35709', '#1B1A17'], tags: ['Coffee', 'Warm', 'Rich'] },
    { colors: ['#EEEEEE', '#00ADB5', '#393E46', '#222831'], tags: ['Minimal', 'Modern', 'Clean'] },
    { colors: ['#F9F9F9', '#F6F6F6', '#C7C7C7', '#2D2D2D'], tags: ['Monochrome', 'Minimal', 'Clean', 'Light'] },
    { colors: ['#FFE6E6', '#F2D1D1', '#DAEAF1', '#C6DCE4'], tags: ['Pastel', 'Soft', 'Gentle'] },
    { colors: ['#2C3639', '#3F4E4F', '#A27B5C', '#DCD7C9'], tags: ['Vintage', 'Classic', 'Elegant'] },
    { colors: ['#FFF8EA', '#9E7676', '#815B5B', '#594545'], tags: ['Coffee', 'Warm', 'Cozy', 'Vintage'] },

    // New palettes for missing categories
    { colors: ['#D83F87', '#2A1B3D', '#44318D', '#A4B3B6'], tags: ['Retro', 'Vibrant'] },
    { colors: ['#3330E4', '#F637EC', '#FBB454', '#FAEA48'], tags: ['Neon', 'Vibrant', 'Bold'] },
    { colors: ['#FFD700', '#F0A500', '#CF7500', '#B85C00'], tags: ['Gold', 'Rich', 'Warm'] },
    { colors: ['#A6DCEF', '#8ECDDD', '#76BED1', '#5DA9C5'], tags: ['Cold', 'Blue', 'Winter'] },
    { colors: ['#FAD02E', '#F9A825', '#F57F17', '#EF6C00'], tags: ['Summer', 'Vibrant', 'Warm'] },
    { colors: ['#D88C3A', '#A35400', '#6E2C00', '#3A1900'], tags: ['Fall', 'Earthy', 'Warm'] },
    { colors: ['#90EE90', '#3CB371', '#2E8B57', '#006400'], tags: ['Spring', 'Nature', 'Green'] },
    { colors: ['#FFC0CB', '#FFB6C1', '#FF69B4', '#FF1493'], tags: ['Pastel', 'Pink', 'Spring'] }
];

const seedPalettes = async () => {
  const palettesCollection = collection(db, 'palettes');
  for (const palette of palettes) {
    try {
      await addDoc(palettesCollection, { ...palette, likes: 0, createdAt: new Date() });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
  console.log('Finished seeding palettes.');
  process.exit(0);
};

seedPalettes();
