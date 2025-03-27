import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Heart, User } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-3 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 ${
            isActive('/') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link
          to="/create"
          className={`flex flex-col items-center gap-1 ${
            isActive('/create') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Plus size={24} />
          <span className="text-xs">Create</span>
        </Link>
        
        <Link
          to="/liked"
          className={`flex flex-col items-center gap-1 ${
            isActive('/liked') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Heart size={24} />
          <span className="text-xs">Liked</span>
        </Link>
        
        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 ${
            isActive('/profile') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <User size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
};