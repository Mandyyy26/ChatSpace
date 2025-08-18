import React from 'react';
import { useSubscription, useMutation } from '@apollo/client';
import { LIST_CHATS_SUBSCRIPTION } from '../graphql/subscriptions';
import { CREATE_CHAT } from '../graphql/mutations';
import { Plus, MessageCircle, Clock, ChevronRight } from 'lucide-react';
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
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm border border-red-200 dark:border-red-800 max-w-md mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unable to load chats</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const chats = data?.chats || [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Conversations</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {chats.length === 0 
                ? "Start your first conversation" 
                : `${chats.length} ${chats.length === 1 ? 'conversation' : 'conversations'}`
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateChat}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {chats.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No conversations yet</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              Create your first chat to start having conversations with AI.
            </p>
            <button
              onClick={handleCreateChat}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Start First Chat</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat: any) => (
              <NavLink
                key={chat.id}
                to={`/chat/${chat.id}`}
                className={({ isActive }) =>
                  `group block p-4 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750'
                  }`
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate mb-1">
                      {chat.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(chat.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: new Date(chat.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};