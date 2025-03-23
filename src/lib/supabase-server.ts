import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { CookieOptions } from '@supabase/ssr';

// Enable cookie debugging to troubleshoot auth issues
const DEBUG_COOKIES = process.env.NODE_ENV === 'development';

// Initialize the Supabase client for server components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

// Replace the existing createClient function with this simplified version
export function createClient(request: NextRequest) {
  // Track cookies that need to be set
  const cookiesToSet: {name: string, value: string, options?: any}[] = [];
  
  // Check for Authorization header or X-Supabase-Auth (from middleware)
  const authHeader = request.headers.get('Authorization');
  const middlewareToken = request.headers.get('X-Supabase-Auth');
  
  let accessToken = null;
  
  // Get token from headers, prioritizing normal Auth header
  if (authHeader && authHeader.startsWith('Bearer ')) {
    accessToken = authHeader.substring(7);
    console.log('🔑 Using token from Authorization header');
  } else if (middlewareToken) {
    accessToken = middlewareToken;
    console.log('🔑 Using token from middleware X-Supabase-Auth header');
  }
  
  // Create the Supabase client
  const supabase = createServerClient(
    supabaseUrl, 
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
      },
      cookies: {
        get(name) {
          // Try to get from headers first if an auth cookie
          if (accessToken && name.includes('auth-token')) {
            return accessToken;
          }
          
          // Otherwise get from cookies
          const cookie = request.cookies.get(name)?.value;
          return cookie;
        },
        set(name, value, options) {
          // Store cookies to be set in response
          cookiesToSet.push({ name, value, options: {
            ...options,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true
          }});
        },
        remove(name, options) {
          cookiesToSet.push({
            name, 
            value: '', 
            options: {
              ...options,
              path: '/',
              maxAge: 0
            }
          });
        },
      },
    }
  );
  
  return { supabase, cookiesToSet };
}

// Helper function to apply cookies to a response
export function applyCookiesToResponse(response: NextResponse, cookies: {name: string, value: string, options?: any}[]): NextResponse {
  if (!cookies.length) {
    if (DEBUG_COOKIES) {
      console.log(`🍪 No cookies to apply to response`);
    }
    return response;
  }
  
  if (DEBUG_COOKIES) {
    console.log(`🍪 Applying ${cookies.length} cookies to response`);
  }
  
  // Add cookies to the response
  cookies.forEach(({name, value, options}) => {
    if (DEBUG_COOKIES) {
      console.log(`🍪 Setting response cookie: ${name} with options:`, options);
    }
    
    try {
      // Set standard cookie options
      const cookieOptions = {
        path: '/',
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        ...options,
      };
      
      // Apply the cookie to the response
      response.cookies.set({
        name,
        value,
        ...cookieOptions
      });
      
      // Verify the cookie was set
      const setCookie = response.cookies.get(name);
      if (DEBUG_COOKIES) {
        if (setCookie) {
          console.log(`🍪 Verified cookie ${name} was set in response with path: ${setCookie.path || '/'}`);
        } else {
          console.error(`🍪 ERROR: Failed to set cookie ${name} in response!`);
        }
      }
    } catch (err) {
      console.error(`Error setting cookie ${name}:`, err);
    }
  });
  
  // Final check on response cookies
  if (DEBUG_COOKIES) {
    const finalCookies = response.cookies.getAll();
    console.log(`🍪 Response now has ${finalCookies.length} cookies:`);
    finalCookies.forEach(cookie => {
      console.log(`🍪 - ${cookie.name} (path: ${cookie.path || '/'}, maxAge: ${cookie.maxAge || 'default'})`);
    });
  }
  
  return response;
}

// Helper to format cookie string
function createCookieString(name: string, value: string, options?: any): string {
  let cookie = `${name}=${value}`;
  
  if (options) {
    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    if (options.domain) cookie += `; Domain=${options.domain}`;
    if (options.path) cookie += `; Path=${options.path}`;
    if (options.expires) cookie += `; Expires=${options.expires.toUTCString()}`;
    if (options.httpOnly) cookie += '; HttpOnly';
    if (options.secure) cookie += '; Secure';
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;
  }
  
  return cookie;
}