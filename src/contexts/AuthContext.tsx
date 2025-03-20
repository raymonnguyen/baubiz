'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, AuthError, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  showAuthModal: (mode?: 'login' | 'signup', actionAfterAuth?: () => void) => void;
  hideAuthModal: () => void;
  authModalVisible: boolean;
  authModalMode: 'login' | 'signup';
  authModalActionAfterAuth: (() => void) | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [authModalActionAfterAuth, setAuthModalActionAfterAuth] = useState<(() => void) | undefined>(undefined);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  // Initial session and auth state handling
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        // Convert Supabase user to our app's user format
        const userData: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'User',
          username: session.user.user_metadata?.username || '',
          avatar: session.user.user_metadata?.avatar_url || '',
        };
        setUser(userData);
      }
      
      setIsLoading(false);
      
      // Set up auth state change listener
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (_event, currentSession) => {
          setSession(currentSession);
          
          if (currentSession?.user) {
            const userData: AuthUser = {
              id: currentSession.user.id,
              email: currentSession.user.email || '',
              name: currentSession.user.user_metadata?.name || 'User',
              username: currentSession.user.user_metadata?.username || '',
              avatar: currentSession.user.user_metadata?.avatar_url || '',
            };
            setUser(userData);
          } else {
            setUser(null);
          }
        }
      );
      
      // Clean up subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Handle the special case for demo user
      if (email === 'phunguyen' && password === 'phunguyen') {
        // Use the special username as email for the demo
        email = 'phunguyen@example.com';
        password = 'phunguyen123'; // Ensure this matches what's in your Supabase
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Show success toast
      toast.success('Successfully logged in!');
      
      // Perform actions after successful login
      if (authModalActionAfterAuth) {
        authModalActionAfterAuth();
      }
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in. Please try again.');
      throw error;
    }
  };

  // Sign up with email and password
  const signup = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username: email.split('@')[0], // Generate a default username
          },
        },
      });
      
      if (error) throw error;
      
      toast.success('Account created! Please check your email to confirm your account.');
      // Supabase sends a confirmation email by default
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to sign up. Please try again.');
      throw error;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('You have been logged out');
      
      // Redirect to home page after logout
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out. Please try again.');
      throw error;
    }
  };

  // Show auth modal
  const showAuthModal = (mode: 'login' | 'signup' = 'signup', actionAfterAuth?: () => void) => {
    setAuthModalMode(mode);
    setAuthModalVisible(true);
    if (actionAfterAuth) {
      setAuthModalActionAfterAuth(actionAfterAuth);
    }
  };

  // Hide auth modal
  const hideAuthModal = () => {
    setAuthModalVisible(false);
    // Clear the action after auth when closing the modal
    setAuthModalActionAfterAuth(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
        showAuthModal,
        hideAuthModal,
        authModalVisible,
        authModalMode,
        authModalActionAfterAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 