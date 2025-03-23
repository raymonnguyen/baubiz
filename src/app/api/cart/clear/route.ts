import { NextRequest, NextResponse } from 'next/server';
import { createClient, applyCookiesToResponse } from '@/lib/supabase-server';

// Handle DELETE requests to clear a user's cart
export async function DELETE(request: NextRequest) {
  try {
    // Create supabase server client
    const { supabase, cookiesToSet } = createClient(request);
    
    // Check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      const response = NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Delete all cart items for this user
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', session.user.id);
    
    if (deleteError) {
      const response = NextResponse.json(
        { error: 'Error clearing cart' }, 
        { status: 500 }
      );
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Create response with success
    const response = NextResponse.json({ success: true });
    
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