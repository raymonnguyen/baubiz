import { createBrowserClient } from '@supabase/ssr';

// Extract project reference for the token name
function getAuthTokenName() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const match = supabaseUrl.match(/\/\/([^.]+)\.supabase/);
  const projectRef = match ? match[1] : '';
  return projectRef ? `sb-${projectRef}-auth-token` : 'supabase-auth-token';
}

// Export the token name for use in other files
export const AUTH_TOKEN_NAME = getAuthTokenName();
console.log('Using auth token name:', AUTH_TOKEN_NAME);

// Create a Supabase client with explicit session handling
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    }
  }
);

// Store token directly in localStorage to ensure persistence
export function storeTokenInLocalStorage(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('supabase-auth-token', token);
    console.log('Token stored in localStorage');
  }
}

// Get token from localStorage as fallback
export function getStoredToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('supabase-auth-token');
  }
  return null;
}

// Helper function to get an access token with fallbacks
export async function getAccessToken() {
  try {
    // Try to get from session first
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.access_token) {
      storeTokenInLocalStorage(data.session.access_token);
      return data.session.access_token;
    }
    
    // Try refreshing the session
    const { data: refreshData } = await supabase.auth.refreshSession();
    if (refreshData.session?.access_token) {
      storeTokenInLocalStorage(refreshData.session.access_token);
      return refreshData.session.access_token;
    }
    
    // Fall back to localStorage if session retrieval fails
    const storedToken = getStoredToken();
    if (storedToken) {
      console.log('Using token from localStorage');
      return storedToken;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting access token:', error);
    
    // Final fallback to localStorage
    const storedToken = getStoredToken();
    return storedToken;
  }
} 