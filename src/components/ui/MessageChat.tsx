'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  with: {
    id: string;
    name: string;
    avatar?: string;
    isVerified: boolean;
    isActive?: boolean;
  };
  lastMessage?: {
    content: string;
    timestamp: Date;
    read: boolean;
  };
  product?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  messages: Message[];
}

interface MessageChatProps {
  conversation: Conversation;
  currentUserId: string;
  onSendMessage: (conversationId: string, content: string) => void;
  onMarkAsRead?: (conversationId: string, messageIds: string[]) => void;
}

const MessageChat = ({
  conversation,
  currentUserId,
  onSendMessage,
  onMarkAsRead,
}: MessageChatProps) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
    
    // Mark unread messages as read
    const unreadMessages = conversation.messages
      .filter(msg => !msg.read && msg.sender === 'other')
      .map(msg => msg.id);
      
    if (unreadMessages.length > 0 && onMarkAsRead) {
      onMarkAsRead(conversation.id, unreadMessages);
    }
  }, [conversation.messages, conversation.id, onMarkAsRead]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageText.trim()) {
      onSendMessage(conversation.id, messageText);
      setMessageText('');
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    // If message is from today, show only time
    if (
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear()
    ) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If message is from this year, show date without year
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return messageDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="flex flex-col h-full bg-background rounded-xl shadow-soft overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              {conversation.with.avatar ? (
                <Image
                  src={conversation.with.avatar}
                  alt={conversation.with.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 bg-secondary text-white rounded-full">
                  {conversation.with.name.charAt(0)}
                </div>
              )}
            </div>
            {conversation.with.isActive && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-medium">{conversation.with.name}</h3>
              {conversation.with.isVerified && (
                <span className="text-secondary" title="Verified Seller">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-text-light text-sm">
              {conversation.with.isActive ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        {/* Product info if available */}
        {conversation.product && (
          <div className="flex items-center gap-2 bg-background-alt rounded-lg p-2">
            <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={conversation.product.image}
                alt={conversation.product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-sm">
              <p className="font-medium line-clamp-1 max-w-[100px]">{conversation.product.title}</p>
              <p className="text-primary font-bold">${conversation.product.price.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {conversation.messages.map((message, index) => {
            const isUser = message.sender === 'user';
            const showDate = index === 0 || 
              new Date(message.timestamp).toDateString() !== 
              new Date(conversation.messages[index - 1].timestamp).toDateString();
              
            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 bg-background-alt text-text-light text-xs rounded-full">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isUser ? 'bg-primary text-white' : 'bg-background-alt text-text'} rounded-2xl px-4 py-2`}>
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 ${isUser ? 'text-white/70' : 'text-text-light'} flex items-center gap-1 justify-end`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {isUser && (
                        <span title={message.read ? 'Read' : 'Delivered'}>
                          {message.read ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
                            </svg>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <form 
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-100 dark:border-gray-800"
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="form-input flex-1"
          />
          <button
            type="submit"
            className="btn-primary px-4 py-2"
            disabled={!messageText.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageChat; 