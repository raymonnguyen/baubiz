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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Initialize authentication state with strong persistence
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for direct token in cookies or localStorage first
        const cookieToken = getCookie('supabase-auth-token');
        const localStorageToken = localStorage.getItem('supabase-auth-token');
        
        if (cookieToken || localStorageToken) {
          console.log('Found existing token, attempting to restore session');
        }
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session retrieval error:', error);
          
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error('Session refresh error:', refreshError);
            
            // Try to restore session from token if we have one
            if (cookieToken || localStorageToken) {
              try {
                const token = cookieToken || localStorageToken;
                const { data: tokenData, error: tokenError } = await supabase.auth.setSession({
                  access_token: token!,
                  refresh_token: '',
                });
                
                if (tokenError) {
                  console.error('Token restoration error:', tokenError);
                  handleAuthFailure();
                } else if (tokenData.session) {
                  console.log('Session restored from token');
                  handleSessionUser(tokenData.session.user);
                }
              } catch (e) {
                console.error('Token restoration exception:', e);
                handleAuthFailure();
              }
            } else {
              handleAuthFailure();
            }
          } else if (refreshData.session) {
            // Session refreshed successfully
            handleSessionUser(refreshData.session.user);
            
            // Save the refreshed token for backup
            if (refreshData.session.access_token) {
              localStorage.setItem('supabase-auth-token', refreshData.session.access_token);
              setCookie('supabase-auth-token', refreshData.session.access_token, 7);
            }
          } else {
            handleAuthFailure();
          }
        } else if (data.session) {
          // We have a valid session
          handleSessionUser(data.session.user);
          
          // Save the token for backup
          if (data.session.access_token) {
            localStorage.setItem('supabase-auth-token', data.session.access_token);
            setCookie('supabase-auth-token', data.session.access_token, 7);
          }
        } else {
          handleAuthFailure();
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log(`Auth state change: ${event}`);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (currentSession?.user) {
                handleSessionUser(currentSession.user);
                
                // Save the token for backup
                if (currentSession.access_token) {
                  localStorage.setItem('supabase-auth-token', currentSession.access_token);
                  setCookie('supabase-auth-token', currentSession.access_token, 7);
                }
                
                // Dispatch login success event
                window.dispatchEvent(new CustomEvent('auth:login:success'));
              }
            } else if (event === 'SIGNED_OUT') {
              handleAuthFailure();
              // Dispatch logout event
              window.dispatchEvent(new CustomEvent('auth:logout'));
            } else if (event === 'USER_UPDATED') {
              if (currentSession?.user) {
                handleSessionUser(currentSession.user);
              }
            }
          }
        );
        
        // Clean up subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        handleAuthFailure();
      } finally {
        setIsLoading(false);
      }
    };
    
    // Handle authentication failure
    const handleAuthFailure = () => {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('supabase-auth-token');
      deleteCookie('supabase-auth-token');
    };
    
    // Helper function to process user from session
    const handleSessionUser = (sessionUser: any) => {
      if (!sessionUser) return;
      
      // Transform to match our user interface
      const userData: AuthUser = {
        id: sessionUser.id,
        email: sessionUser.email || '',
        name: sessionUser.user_metadata?.name || 'User',
        username: sessionUser.user_metadata?.username || '',
        avatar: sessionUser.user_metadata?.avatar_url || '',
      };
      
      setUser(userData);
      setIsAuthenticated(true);
    };
    
    // Cookie helpers
    function setCookie(name: string, value: string, days: number) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax';
    }
    
    function getCookie(name: string) {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    
    function deleteCookie(name: string) {
      document.cookie = name + '=; Max-Age=-99999999; path=/';
    }
    
    initializeAuth();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      // Show success toast
      toast.success('Successfully logged in!');
      
      // Dispatch login success event
      window.dispatchEvent(new CustomEvent('auth:login:success'));
      
      // Perform actions after successful login
      if (authModalActionAfterAuth) {
        authModalActionAfterAuth();
      }
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast.error(error.message || 'Failed to log in. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
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
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Failed to sign up. Please try again.');
      throw error;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear authentication state
      setUser(null);
      setIsAuthenticated(false);
      
      // Dispatch logout event
      window.dispatchEvent(new CustomEvent('auth:logout'));
      
      toast.success('Successfully logged out!');
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showAuthModal = (mode: 'login' | 'signup' = 'signup', actionAfterAuth?: () => void) => {
    setAuthModalMode(mode);
    setAuthModalActionAfterAuth(actionAfterAuth);
    setAuthModalVisible(true);
  };

  const hideAuthModal = () => {
    setAuthModalVisible(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        showAuthModal,
        hideAuthModal,
        authModalVisible,
        authModalMode,
        authModalActionAfterAuth,
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