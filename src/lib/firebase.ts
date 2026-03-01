// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfldmyQNHlRoVGkB5w_v-ARopY3mXLGGI",
  authDomain: "chromavault-0650.firebaseapp.com",
  projectId: "chromavault-0650",
  storageBucket: "chromavault-0650.firebasestorage.app",
  messagingSenderId: "563073086254",
  appId: "1:563073086254:web:307f3109373d8f98a180bf",
  measurementId: "G-SDG46PW5XN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to the services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
