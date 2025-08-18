import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useSubscription, useMutation } from '@apollo/client';
import { Send, ArrowLeft, User, Bot, MessageSquare } from 'lucide-react';
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
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading conversation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>AI Assistant</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {allMessages.length} {allMessages.length === 1 ? 'message' : 'messages'}
            </p>
          </div>
        </div>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {allMessages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to AI Assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                I'm here to help you with any questions or tasks. Start a conversation below!
              </p>
            </div>
          ) : (
            allMessages.map((msg: any, i: number) => {
              const isUser = isUserMessage(msg);
              const showAvatar = i === 0 || (isUserMessage(allMessages[i - 1]) !== isUser);
              
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                  <div className={`flex max-w-2xl ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-end space-x-3`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
                      {showAvatar ? (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isUser
                              ? 'bg-blue-600 dark:bg-blue-500'
                              : 'bg-gray-600 dark:bg-gray-500'
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
                    <div className="group relative flex flex-col max-w-xs sm:max-w-md">
                      {showAvatar && (
                        <div
                          className={`text-xs text-gray-500 dark:text-gray-400 mb-1 px-3 font-medium ${
                            isUser ? 'text-right' : 'text-left'
                          }`}
                        >
                          {isUser ? 'You' : 'AI Assistant'}
                        </div>
                      )}
                      
                      <div
                        className={`relative px-3 py-2 rounded-lg ${
                          isUser
                            ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        
                        <div
                          className={`text-xs mt-2 ${
                            isUser
                              ? 'text-blue-100 dark:text-blue-200'
                              : 'text-gray-500 dark:text-gray-400'
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
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 py-4">
        <div className="max-w-3xl mx-auto">
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
                placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[48px] max-h-32 transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
              className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white rounded-lg disabled:cursor-not-allowed transition-colors duration-200"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            Messages are delivered in real-time
          </p>
        </div>
      </div>
    </div>
  );
};