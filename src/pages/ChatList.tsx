import React from 'react';
import { useSubscription, useMutation } from '@apollo/client';
import { LIST_CHATS_SUBSCRIPTION } from '../graphql/subscriptions';
import { CREATE_CHAT } from '../graphql/mutations';
import { Plus, MessageCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const ChatList: React.FC = () => {
  const { data, loading, error } = useSubscription(LIST_CHATS_SUBSCRIPTION);
  const [createChat] = useMutation(CREATE_CHAT);

  const handleCreateChat = async () => {
    const title = prompt('Enter chat title:');
    if (title) {
      await createChat({ variables: { title } });
    }
  };

  if (loading) {
    return (
      <div className="space-y-2 p-4 max-w-2xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading chats: {error.message}
      </div>
    );
  }

  const chats = data?.chats || [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Your Chats</h1>
        <button
          onClick={handleCreateChat}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </button>
      </div>

      {chats.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No chats yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new chat.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat: any) => (
            <NavLink
              key={chat.id}
              to={`/chat/${chat.id}`}
              className={({ isActive }) =>
                `block p-4 rounded border transition ${
                  isActive
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`
              }
            >
              <h3 className="font-medium text-gray-900">{chat.title}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(chat.created_at).toLocaleString()}
              </p>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};