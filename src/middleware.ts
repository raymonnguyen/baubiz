import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // Initialize response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  
  try {
    // Get existing token from cookies
    const supabaseAccessToken = request.cookies.get('supabase-auth-token');
    const sessionExpiry = request.cookies.get('supabase-auth-expiry');
    
    // Log cookie state for debugging
    if (supabaseAccessToken) {
      console.log('Found existing auth token in cookies');
    }
    
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name) {
            const cookie = request.cookies.get(name);
            return cookie?.value;
          },
          set(name, value, options) {
            // Set cookie with persistent settings
            response.cookies.set({
              name,
              value,
              path: '/',
              sameSite: 'lax',
              httpOnly: name.includes('access') || name.includes('refresh'),
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 24 * 7, // 7 days
              ...options,
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              path: '/',
              maxAge: -1,
              ...options,
            });
          },
        },
      }
    );
    
    // Attempt to get and refresh the session
    const { data } = await supabase.auth.getSession();
    
    // If we have a session, enhance cookies to ensure persistence
    if (data?.session) {
      console.log('Session found in middleware');
      
      // Set direct auth token cookie to ensure persistence
      response.cookies.set({
        name: 'supabase-auth-token',
        value: data.session.access_token,
        path: '/',
        httpOnly: false, // Allow JS access for client-side fallback
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
      });
      
      // Set expiry timestamp to help with client-side refresh logic
      const expiryTime = new Date().getTime() + (60 * 60 * 24 * 7 * 1000);
      response.cookies.set({
        name: 'supabase-auth-expiry',
        value: expiryTime.toString(),
        path: '/',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax'
      });
    } else if (supabaseAccessToken?.value) {
      // If session is not found but we have a token in cookies, try to preserve it
      console.log('No session but token exists in cookies');
    }
  } catch (e) {
    console.error('Middleware error:', e);
  }
  
  return response;
}

// Only apply middleware where needed
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|svg|ico)$).*)',
  ],
}; 