import React from 'react';
import { useSignOut, useUserData } from '@nhost/react';
import { LogOut, MessageCircle } from 'lucide-react';

export const TopBar: React.FC = () => {
  const { signOut } = useSignOut();
  const user = useUserData();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-semibold text-gray-900">Chat App</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.displayName || user?.email}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};