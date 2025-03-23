import { NextRequest, NextResponse } from 'next/server';
import { createClient, applyCookiesToResponse } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    // Create supabase server client with request only
    const { supabase, cookiesToSet } = createClient(request);
    
    // Sign out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error.message);
      
      const response = NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    console.log('Sign out successful');
    console.log('Cookies to set/remove:', cookiesToSet.length);
    
    // Create success response
    const response = NextResponse.json({
      message: 'Signed out successfully'
    });
    
    // Apply auth cookies (in this case, removing session cookies)
    return applyCookiesToResponse(response, cookiesToSet);
  } catch (error) {
    console.error('Server error during sign out:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 