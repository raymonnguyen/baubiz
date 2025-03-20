'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import MessageChat, { Message, Conversation } from '@/components/ui/MessageChat';

// Mock data - in a real app this would come from an API
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    with: {
      id: 'user1',
      name: 'Sarah Johnson',
      avatar: '/images/seller1.jpg',
      isVerified: true,
      isActive: true,
    },
    lastMessage: {
      content: 'Is the stroller still available?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: true,
    },
    product: {
      id: 'p1',
      title: 'Baby Stroller',
      price: 120,
      image: '/images/stroller.jpg',
    },
    messages: [
      {
        id: 'msg1',
        content: 'Hi, is the baby stroller still available?',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        read: true,
      },
      {
        id: 'msg2',
        content: 'Yes, it is! Are you interested?',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
        read: true,
      },
      {
        id: 'msg3',
        content: 'Great! What\'s the condition of the stroller? Any damages or issues I should know about?',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
        read: true,
      },
      {
        id: 'msg4',
        content: 'It\'s in excellent condition. Only used for about 6 months. No damages at all, and all functions work perfectly.',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        read: true,
      },
      {
        id: 'msg5',
        content: 'Sounds perfect! Would you be willing to meet somewhere to see it in person?',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
        read: true,
      },
      {
        id: 'msg6',
        content: 'Of course! I\'m available this weekend. Would Saturday around 2pm work for you?',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
        read: true,
      },
      {
        id: 'msg7',
        content: 'Saturday at 2pm works great. Where would you like to meet?',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: true,
      },
      {
        id: 'msg8',
        content: 'How about the coffee shop at Central Mall? It\'s public and has parking.',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        read: true,
      },
      {
        id: 'msg9',
        content: 'Perfect! I\'ll see you there. I\'ll be wearing a blue jacket.',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        read: true,
      },
      {
        id: 'msg10',
        content: 'Great! I\'ll bring the stroller. I have a red car, and I\'ll park near the entrance.',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        read: true,
      },
      {
        id: 'msg11',
        content: 'Is the stroller still available?',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        read: true,
      },
    ],
  },
  {
    id: 'conv2',
    with: {
      id: 'user2',
      name: 'Emily Parker',
      avatar: '/images/seller2.jpg',
      isVerified: true,
      isActive: false,
    },
    lastMessage: {
      content: 'Would you take $180 for the crib?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
    product: {
      id: 'p2',
      title: 'Wooden Baby Crib',
      price: 200,
      image: '/images/crib.jpg',
    },
    messages: [
      {
        id: 'msg1',
        content: 'Hello! I\'m interested in your wooden baby crib.',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
      },
      {
        id: 'msg2',
        content: 'Hi Emily! Thanks for your interest. It\'s still available.',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.8), // 4.8 hours ago
        read: true,
      },
      {
        id: 'msg3',
        content: 'Great! Is the mattress included with the crib?',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.6), // 4.6 hours ago
        read: true,
      },
      {
        id: 'msg4',
        content: 'Yes, it comes with a barely used mattress. My baby only slept in it for about 3 months.',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.4), // 4.4 hours ago
        read: true,
      },
      {
        id: 'msg5',
        content: 'Would you take $180 for the crib?',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
      },
    ],
  },
  {
    id: 'conv3',
    with: {
      id: 'user3',
      name: 'Jessica Miller',
      isVerified: false,
      isActive: false,
    },
    lastMessage: {
      content: 'Can I see more pictures?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
    product: {
      id: 'p3',
      title: 'Baby Clothes Bundle',
      price: 45,
      image: '/images/clothes.jpg',
    },
    messages: [
      {
        id: 'msg1',
        content: 'Hi there! I\'m interested in your baby clothes bundle.',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
        read: true,
      },
      {
        id: 'msg2',
        content: 'Hello Jessica! The bundle is still available if you\'re interested.',
        sender: 'user' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5), // 24.5 hours ago
        read: true,
      },
      {
        id: 'msg3',
        content: 'Can I see more pictures?',
        sender: 'other' as const,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
        read: true,
      },
    ],
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversations[0]?.id || null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileConversation, setShowMobileConversation] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle sending a message
  const handleSendMessage = (conversationId: string, content: string) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === conversationId) {
          const newMessage = {
            id: `msg${Date.now()}`,
            content,
            sender: 'user' as const,
            timestamp: new Date(),
            read: false,
          };
          
          return {
            ...conv,
            lastMessage: {
              content,
              timestamp: new Date(),
              read: false,
            },
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      });
    });
  };

  // Handle marking messages as read
  const handleMarkAsRead = (conversationId: string, messageIds: string[]) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === conversationId) {
          const updatedMessages = conv.messages.map(msg => {
            if (messageIds.includes(msg.id)) {
              return { ...msg, read: true };
            }
            return msg;
          });
          
          return {
            ...conv,
            messages: updatedMessages,
            ...(conv.lastMessage && messageIds.includes(conv.messages[conv.messages.length - 1].id) 
              ? { lastMessage: { ...conv.lastMessage, read: true } } 
              : {})
          };
        }
        return conv;
      });
    });
  };

  // Get the selected conversation
  const activeConversation = conversations.find(conv => conv.id === selectedConversation);

  // Count unread messages
  const getUnreadCount = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    return conversation?.messages.filter(msg => !msg.read && msg.sender === 'other').length || 0;
  };

  // Format time for display in conversation list
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    }
    
    if (diffHour > 0) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    }
    
    if (diffMin > 0) {
      return diffMin === 1 ? '1 min ago' : `${diffMin} mins ago`;
    }
    
    return 'Just now';
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Messages</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Conversation List */}
        <div 
          className={`w-full md:w-1/3 lg:w-1/4 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden ${
            isMobile && showMobileConversation ? 'hidden' : 'block'
          }`}
        >
          <div className="p-4 bg-background-alt border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-bold">Your Conversations</h2>
          </div>
          
          {conversations.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[600px] overflow-y-auto">
              {conversations.map(conversation => {
                const isActive = conversation.id === selectedConversation;
                const unreadCount = getUnreadCount(conversation.id);
                
                return (
                  <div 
                    key={conversation.id}
                    className={`p-4 hover:bg-background-alt cursor-pointer transition-colors ${
                      isActive ? 'bg-background-alt' : ''
                    }`}
                    onClick={() => {
                      setSelectedConversation(conversation.id);
                      if (isMobile) {
                        setShowMobileConversation(true);
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          {conversation.with.avatar ? (
                            <Image
                              src={conversation.with.avatar}
                              alt={conversation.with.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-12 h-12 bg-secondary text-white rounded-full">
                              {conversation.with.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        {conversation.with.isActive && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                        )}
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">{conversation.with.name}</h3>
                          <span className="text-text-lighter text-xs">
                            {conversation.lastMessage && formatTimeAgo(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        {conversation.lastMessage && (
                          <p className={`text-sm truncate ${
                            !conversation.lastMessage.read && conversation.lastMessage.content !== conversation.messages[conversation.messages.length - 1].content
                              ? 'font-medium text-text'
                              : 'text-text-light'
                          }`}>
                            {conversation.lastMessage.content}
                          </p>
                        )}
                        {conversation.product && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 bg-secondary rounded-full"></span>
                            <span className="text-xs text-text-light truncate">
                              Re: {conversation.product.title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-text-light mb-4">You have no messages yet.</p>
              <Link href="/marketplace" className="btn-primary py-2 px-4">
                Browse Marketplace
              </Link>
            </div>
          )}
        </div>
        
        {/* Chat Window */}
        <div 
          className={`flex-1 h-[600px] ${
            isMobile ? (showMobileConversation ? 'block' : 'hidden') : 'block'
          }`}
        >
          {activeConversation ? (
            <>
              {isMobile && (
                <button
                  onClick={() => setShowMobileConversation(false)}
                  className="mb-4 flex items-center gap-1 text-text-light hover:text-primary transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back to conversations
                </button>
              )}
              <MessageChat
                conversation={activeConversation}
                currentUserId="current-user" // In a real app, this would be the actual user ID
                onSendMessage={handleSendMessage}
                onMarkAsRead={handleMarkAsRead}
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center border border-gray-100 dark:border-gray-800 rounded-xl bg-background-alt">
              <div className="text-center p-8">
                <svg
                  className="w-16 h-16 text-text-light mx-auto mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="text-xl font-bold mb-2">No conversation selected</h3>
                <p className="text-text-light mb-4">
                  Select a conversation from the list or start a new one through a listing.
                </p>
                <Link href="/marketplace" className="btn-primary py-2 px-4">
                  Browse Marketplace
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 