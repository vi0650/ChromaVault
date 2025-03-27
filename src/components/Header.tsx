import React, { useEffect, useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Moon, Sun, User } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        handleSessionExpired();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      switch (event) {
        case 'SIGNED_OUT':
        case 'USER_DELETED':
          handleSignOut();
          break;
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          await refreshSession(session);
          break;
        case 'SIGNED_IN':
          toast.success('Successfully signed in!');
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refreshSession = async (session: any) => {
    if (!session) {
      handleSessionExpired();
      return;
    }

    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setUser(data.user);
    } catch (error) {
      console.error('Error refreshing session:', error);
      handleSessionExpired();
    }
  };

  const handleSessionExpired = () => {
    setUser(null);
    toast.error('Your session has expired. Please sign in again.');
    navigate('/profile');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Successfully signed out');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-dark-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center gap-2">
              <Palette className="h-8 w-8 text-highlight" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ChromaVault
              </span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-400"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-dark-300 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-400">
                  <User size={20} />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white dark:bg-dark-300 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3 border-b dark:border-dark-400">
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-gray-100 dark:bg-dark-400' : ''
                            } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`${
                              active ? 'bg-gray-100 dark:bg-dark-400' : ''
                            } block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 bg-highlight text-white rounded-lg hover:bg-accent transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};