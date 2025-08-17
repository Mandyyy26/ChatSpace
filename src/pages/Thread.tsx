import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useSubscription, useMutation } from '@apollo/client';
import { Send, ArrowLeft, User, Bot, Clock } from 'lucide-react';
import { MESSAGES_QUERY } from '../graphql/queries';
import { MESSAGES_SUBSCRIPTION } from '../graphql/subscriptions';
import { SEND_MESSAGE_ACTION } from '../graphql/mutations';
import { INSERT_USER_MESSAGE } from '../graphql/mutations';

export const Thread: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [message, setMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [insertUserMessage] = useMutation(INSERT_USER_MESSAGE);

  // 1) Fetch existing messages
  const { data: queryData, loading } = useQuery(MESSAGES_QUERY, {
    variables: { chat_id: chatId },
    skip: !chatId,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // 2) Subscribe to real-time updates
  const { data: subscriptionData } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chat_id: chatId },
    skip: !chatId,
  });

  // 3) Mutation for sending a message
  const [sendMessageAction, { loading: sending }] = useMutation(SEND_MESSAGE_ACTION);

  // 4) Combine & sort by created_at
  const allMessages = subscriptionData?.messages || queryData?.messages || [];

  // 5) Auto-scroll to bottom
  useEffect(() => {
    const id = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(id);
  }, [allMessages]);

  // 6) Handle send
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || !chatId) return;
    setMessage('');

    try {
      // 1) persist the user's prompt in DB
      await insertUserMessage({
        variables: { chat_id: chatId, content: text }
      });

      // 2) then trigger your AI reply
      await sendMessageAction({
        variables: { input: { chat_id: chatId, content: text } }
      });
    } catch (err) {
      console.error('Error sending message:', err);
      // restore input so the user can retry
      setMessage(text);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHrs = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffHrs < 24) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  };
 // Decide side purely from DB column
  const isUserMessage = (msg: any) => msg?.sender === 'user';  // 'bot' is the other case

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              AI Assistant
            </h1>
            <p className="text-sm text-gray-500">
              {allMessages.length} {allMessages.length === 1 ? 'message' : 'messages'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Clock className="h-4 w-4" />
          <span>Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {allMessages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Welcome to AI Assistant
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                I'm here to help you with any questions or tasks. Start a conversation below!
              </p>
            </div>
          ) : (
            allMessages.map((msg: any, i: number) => {
              const isUser = isUserMessage(msg);
              const showAvatar = i === 0 || (isUserMessage(allMessages[i - 1]) !== isUser);
              
              // Debug log for each message
              console.log(`Message ${i}:`, { 
                content: msg.content?.substring(0, 20) + '...', 
                isUser, 
                sender: msg.sender, 
                user_id: msg.user_id, 
                type: msg.type,
                role: msg.role 
              });

              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`flex max-w-2xl ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-2`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
                      {showAvatar ? (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                            isUser
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                              : 'bg-gradient-to-r from-gray-600 to-gray-700'
                          }`}
                        >
                          {isUser ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                      ) : (
                        <div className="w-8 h-8" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className="group relative flex flex-col max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                      {showAvatar && (
                        <div
                          className={`text-xs text-gray-500 mb-1 px-2 font-medium ${
                            isUser ? 'text-right' : 'text-left'
                          }`}
                        >
                          {isUser ? 'You' : 'AI Assistant'}
                        </div>
                      )}
                      
                      <div
                        className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
                          isUser
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        
                        <div
                          className={`text-xs mt-2 ${
                            isUser
                              ? 'text-blue-100 opacity-90'
                              : 'text-gray-500'
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Ask me anything... (Enter to send, Shift+Enter for new line)"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-32 transition-all duration-200 shadow-sm bg-white"
                rows={1}
                style={{ height: 'auto', minHeight: 48 }}
                onInput={e => {
                  const t = e.target as HTMLTextAreaElement;
                  t.style.height = 'auto';
                  t.style.height = Math.min(t.scrollHeight, 128) + 'px';
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={!message.trim() || sending}
              className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
          
          <div className="flex items-center justify-center mt-3 space-x-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <p className="text-xs text-gray-500 text-center">
              Messages are delivered in real-time
            </p>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};