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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // First try with standard Supabase getSession
        const { data, error } = await supabase.auth.getSession();
        
        if (data.session) {
          // Store authentication status in localStorage to help with cross-tab sync
          localStorage.setItem('is_authenticated', 'true');
          
          // We have a valid session
          handleSessionUser(data.session.user);
          
          // Save the token for backup
          if (data.session.access_token) {
            localStorage.setItem('supabase-auth-token', data.session.access_token);
            setCookie('supabase-auth-token', data.session.access_token, 7);
          }
        } else if (error) {
          console.error('Session retrieval error:', error);
          
          // Try to refresh the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (!refreshError && refreshData.session) {
            // Session refreshed successfully
            localStorage.setItem('is_authenticated', 'true');
            handleSessionUser(refreshData.session.user);
            
            // Save the refreshed token for backup
            if (refreshData.session.access_token) {
              localStorage.setItem('supabase-auth-token', refreshData.session.access_token);
              setCookie('supabase-auth-token', refreshData.session.access_token, 7);
            }
          } else {
            // Last resort: Try to get token from localStorage or cookie
            const cookieToken = getCookie('supabase-auth-token');
            const localStorageToken = localStorage.getItem('supabase-auth-token');
            
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
                  localStorage.setItem('is_authenticated', 'true');
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
                localStorage.setItem('is_authenticated', 'true');
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
              localStorage.removeItem('is_authenticated');
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
      localStorage.removeItem('is_authenticated');
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

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Get all auth cookie names first
      const cookieString = document.cookie;
      const cookies = cookieString.split(';');
      const authCookies = cookies
        .map(cookie => cookie.trim().split('=')[0])
        .filter(name => name.includes('auth') || name.includes('token') || /^sb-.*-auth-token$/.test(name));
      
      // Call sign out API
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear all auth cookies explicitly
      authCookies.forEach(cookieName => {
        document.cookie = `${cookieName}=; Path=/; Max-Age=-99999999;`;
      });
      
      // Also clear custom backup cookie
      document.cookie = 'supabase-auth-token=; Path=/; Max-Age=-99999999;';
      document.cookie = 'supabase-auth-expiry=; Path=/; Max-Age=-99999999;';
      
      // Clear localStorage
      localStorage.removeItem('supabase-auth-token');
      localStorage.removeItem('is_authenticated');
      
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