import { NextRequest, NextResponse } from 'next/server';
import { createClient, applyCookiesToResponse } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    // Debug request cookies
    console.log('SESSION API - Request cookies:');
    const authCookies = request.cookies.getAll().filter(
      cookie => /^sb-.*-auth-token$/.test(cookie.name) || cookie.name.includes('auth') || cookie.name.includes('token')
    );
    
    console.log(`Found ${authCookies.length} auth cookies`);
    authCookies.forEach(cookie => {
      console.log(`  Auth cookie: ${cookie.name}, length: ${cookie.value.length}`);
    });

    // Create supabase server client with request only
    const { supabase, cookiesToSet } = createClient(request);
    
    // Get the user from the session
    const { data, error } = await supabase.auth.getSession();
    
    // If there's an error, try refreshing the session
    if (error) {
      console.log("Session error, attempting refresh:", error.message);
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (!refreshError && refreshData.session) {
        console.log("Session refreshed successfully");
        // Return the refreshed session
        const response = NextResponse.json({ session: refreshData.session });
        return applyCookiesToResponse(response, cookiesToSet);
      }
    }
    
    console.log("AUTH SESSION - Session status:", 
      data.session ? "Found session" : "No session", 
      "Error:", error ? error.message : "No error",
      "Cookie count:", cookiesToSet.length
    );
    
    if (data.session) {
      console.log(`Session found for user: ${data.session.user.email}`);
      console.log(`Session expires at: ${new Date(data.session.expires_at! * 1000).toISOString()}`);
    }
    
    // Create response with session data
    const response = NextResponse.json({ session: data.session });
    response.headers.set('X-Session-Status', data.session ? 'active' : 'none');
    
    // Apply any auth cookies
    return applyCookiesToResponse(response, cookiesToSet);
  } catch (error) {
    console.error('Server error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}