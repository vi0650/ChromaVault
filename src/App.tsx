import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ThemeProvider } from './context/ThemeContext';
import { Home } from './pages/Home';
import { Create } from './pages/Create';
import { Liked } from './pages/Liked';
import { Profile } from './pages/Profile';
import { supabase } from './lib/supabase';
import toast from 'react-hot-toast';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Try to refresh the session on app load
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          // Clear any invalid session data
          await supabase.auth.signOut();
        } else if (!session) {
          // No session exists, but that's okay - user might be anonymous
          console.log('No active session');
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
        toast.error('There was a problem connecting to the service');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pb-16">
          <Header />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/liked" element={<Liked />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>

          <Navigation />
          <Toaster position="bottom-center" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;