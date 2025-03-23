import { NextRequest, NextResponse } from 'next/server';
import { createClient, applyCookiesToResponse } from '@/lib/supabase-server';

// This endpoint is used to check if the user is authenticated
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
    
    // Add explicit headers to help with debugging
    response.headers.set('X-Session-Status', data.session ? 'active' : 'none');
    
    // Apply any auth cookies
    const finalResponse = applyCookiesToResponse(response, cookiesToSet);
    
    // Log final response cookies
    console.log(`Final response has ${finalResponse.cookies.getAll().length} cookies`);
    
    return finalResponse;
  } catch (error) {
    console.error('Server error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 