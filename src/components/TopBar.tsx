import React from 'react';
import { useSignOut, useUserData } from '@nhost/react';
import { LogOut, MessageCircle, User } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export const TopBar: React.FC = () => {
  const { signOut } = useSignOut();
  const user = useUserData();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Logo and title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Chat App
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI-powered conversations
            </p>
          </div>
        </div>
        
        {/* Right side - User info and controls */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {/* User profile section */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            {/* User avatar */}
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full border border-gray-300 dark:border-gray-600">
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {getInitials(displayName)}
                </span>
              )}
            </div>
            
            {/* User name */}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {displayName}
              </p>
              {user?.email && user.displayName && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              )}
            </div>
            
            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};