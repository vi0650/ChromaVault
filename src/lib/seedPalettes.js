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
  { colors: ['#222831', '#393E46', '#00ADB5', '#EEEEEE'], tags: ['dark', 'modern', 'professional'] },
  { colors: ['#FFD93D', '#FF6B6B', '#4D96FF', '#6BCB77'], tags: ['vibrant', 'playful', 'energetic'] },
  { colors: ['#F9ED69', '#F08A5D', '#B83B5E', '#6A2C70'], tags: ['sunset', 'warm', 'gradient'] },
  { colors: ['#F9F7F7', '#DBE2EF', '#3F72AF', '#112D4E'], tags: ['corporate', 'clean', 'professional'] },
  { colors: ['#FFF5E4', '#FFE3E1', '#FFD1D1', '#FF9494'], tags: ['pastel', 'soft', 'romantic'] },
  { colors: ['#2C3333', '#395B64', '#A5C9CA', '#E7F6F2'], tags: ['ocean', 'calm', 'professional'] },
  { colors: ['#F7ECDE', '#E9DAC1', '#9ED2C6', '#54BAB9'], tags: ['nature', 'earthy', 'soothing'] },
  { colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560'], tags: ['dark', 'modern', 'contrast'] },
  { colors: ['#F8EDE3', '#BDD2B6', '#A2B29F', '#798777'], tags: ['nature', 'muted', 'elegant'] },
  { colors: ['#FF7B54', '#FFB26B', '#FFD56F', '#939B62'], tags: ['autumn', 'warm', 'natural'] },
  { colors: ['#CDFCF6', '#98ECF6', '#7B89F9', '#5B4B8A'], tags: ['cool', 'gradient', 'modern'] },
  { colors: ['#F0E3CA', '#FF8303', '#A35709', '#1B1A17'], tags: ['coffee', 'warm', 'rich'] },
  { colors: ['#3330E4', '#F637EC', '#FBB454', '#FAEA48'], tags: ['neon', 'vibrant', 'bold'] },
  { colors: ['#EEEEEE', '#00ADB5', '#393E46', '#222831'], tags: ['minimal', 'modern', 'clean'] },
  { colors: ['#F9F9F9', '#F6F6F6', '#C7C7C7', '#2D2D2D'], tags: ['monochrome', 'minimal', 'clean'] },
  { colors: ['#FFE6E6', '#F2D1D1', '#DAEAF1', '#C6DCE4'], tags: ['pastel', 'soft', 'gentle'] },
  { colors: ['#2C3639', '#3F4E4F', '#A27B5C', '#DCD7C9'], tags: ['vintage', 'classic', 'elegant'] },
  { colors: ['#FFF8EA', '#9E7676', '#815B5B', '#594545'], tags: ['coffee', 'warm', 'cozy'] },
  { colors: ['#F7F7F7', '#279EFF', '#0C356A', '#0174BE'], tags: ['corporate', 'professional', 'trust'] },
  { colors: ['#FAF8F1', '#FAEAB1', '#E5BA73', '#C58940'], tags: ['desert', 'warm', 'natural'] },
  { colors: ['#E3FDFD', '#CBF1F5', '#A6E3E9', '#71C9CE'], tags: ['ocean', 'calm', 'fresh'] },
  { colors: ['#FFE1E1', '#FFC7C7', '#FF9F9F', '#FF8585'], tags: ['pink', 'soft', 'sweet'] },
  { colors: ['#222831', '#2D4059', '#FF5722', '#EEEEEE'], tags: ['dark', 'modern', 'bold'] },
  { colors: ['#F9F7F7', '#3F72AF', '#112D4E', '#DBE2EF'], tags: ['corporate', 'trust', 'professional'] },
  { colors: ['#F8EDE3', '#DFD3C3', '#D0B8A8', '#7D6E83'], tags: ['neutral', 'elegant', 'sophisticated'] }
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
