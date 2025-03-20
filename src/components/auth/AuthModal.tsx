'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  title?: string;
  subtitle?: string;
  redirectPath?: string;
  actionAfterAuth?: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'signup',
  title = 'Join Mom Marketplace',
  subtitle,
  redirectPath = '',
  actionAfterAuth
}: AuthModalProps) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('phunguyen@example.com'); // Pre-fill for demo
  const [password, setPassword] = useState('phunguyen123'); // Pre-fill for demo
  
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Reset form state when modal opens/closes or mode changes
  useEffect(() => {
    setError(null);
    setIsSubmitting(false);
    
    // Set demo credentials if mode changes
    if (mode === 'login') {
      setEmail('phunguyen@example.com');
      setPassword('phunguyen123');
    }
  }, [isOpen, mode]);
  
  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  // Handle escape key to close
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // Show processing toast
    const loadingToast = toast.loading(mode === 'login' ? 'Logging in...' : 'Creating your account...');
    
    try {
      if (mode === 'login') {
        // Allow login with username "phunguyen" for demo purposes
        const identifier = email === 'phunguyen' ? email : email;
        await login(identifier, password);
        // Toast success happens in AuthContext
      } else {
        await signup(name, email, password);
        // Toast success happens in AuthContext
      }
      
      // If there's an action to perform after authentication, do it
      if (actionAfterAuth) {
        actionAfterAuth();
      }
      
      // Dismiss the loading toast
      toast.dismiss(loadingToast);
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      // Dismiss the loading toast
      toast.dismiss(loadingToast);
      // The error toast is already shown in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-2xl bg-white shadow-xl"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Logo and title */}
              <div className="flex flex-col items-center p-6 pt-10">
                <div className="mb-2">
                  <div className="relative h-14 w-14">
                    <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14 text-primary">
                      <path 
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z" 
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                {subtitle && <p className="mt-2 text-center text-gray-600">{subtitle}</p>}
                
                {/* Instructions for demo login */}
                <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                  <p className="font-medium">Demo Credentials (Pre-filled)</p>
                  <p>Email: phunguyen@example.com</p>
                  <p>Password: phunguyen123</p>
                </div>
              </div>
              
              {/* Form */}
              <div className="px-6 pb-8">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  {mode === 'signup' && (
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-primary py-3 font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
                  >
                    {isSubmitting ? 'Processing...' : mode === 'login' ? 'Log in' : 'Sign up'}
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-500">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button
                      onClick={toggleMode}
                      className="ml-1 text-primary hover:text-primary-dark focus:outline-none"
                    >
                      {mode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
} 