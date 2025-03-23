import { NextRequest, NextResponse } from 'next/server';
import { createClient, applyCookiesToResponse } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Create supabase server client with request only
    const { supabase, cookiesToSet } = createClient(request);
    
    // Get request body with credentials
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    console.log(`Attempting sign in for ${email}`);
    
    // Special case for demo user
    let actualEmail = email;
    let actualPassword = password;
    
    if (email === 'phunguyen' && password === 'phunguyen') {
      actualEmail = 'phunguyen@example.com';
      actualPassword = 'phunguyen123';
      console.log('Using demo credentials');
    }
    
    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: actualEmail,
      password: actualPassword,
    });
    
    if (error) {
      console.error('Sign in error:', error.message);
      
      const response = NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    console.log('Sign in successful, session established');
    console.log('User ID:', data.user.id);
    console.log('Session expires at:', new Date(data.session.expires_at! * 1000).toISOString());
    console.log('Cookies to set:', cookiesToSet.length);
    
    // Log each cookie being set for debugging
    cookiesToSet.forEach(cookie => {
      console.log(`Will set cookie: ${cookie.name} with path: ${cookie.options?.path || '/'}`);
      
      // Check for auth token cookie specifically
      if (/^sb-.*-auth-token$/.test(cookie.name)) {
        console.log(`Found auth token cookie with length: ${cookie.value.length}`);
      }
    });
    
    // Create success response with detailed data
    const response = NextResponse.json({
      user: data.user,
      session: data.session,
      message: 'Authentication successful'
    });
    
    // Apply auth cookies
    const finalResponse = applyCookiesToResponse(response, cookiesToSet);
    
    // Log the cookies that were actually set
    console.log(`Final response has ${finalResponse.cookies.getAll().length} cookies`);
    finalResponse.cookies.getAll().forEach(cookie => {
      console.log(`Final cookie set: ${cookie.name} with path: ${cookie.path}`);
      
      // For auth cookies, check their values and options
      if (/^sb-.*-auth-token$/.test(cookie.name)) {
        console.log(`Auth cookie in response length: ${cookie.value.length}`);
        console.log(`Auth cookie options: path=${cookie.path}, maxAge=${cookie.maxAge}`);
      }
    });
    
    return finalResponse;
  } catch (error) {
    console.error('Server error during sign in:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 