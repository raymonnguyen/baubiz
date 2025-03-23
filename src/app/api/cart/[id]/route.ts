import { NextRequest, NextResponse } from 'next/server';
import { createClient, applyCookiesToResponse } from '@/lib/supabase-server';

// Update cart item quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Create supabase server client with request only
    const { supabase, cookiesToSet } = createClient(request);
    
    // Get the user from the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log("PATCH - Session status:", session ? "Found session" : "No session", 
              "Error:", sessionError ? sessionError.message : "No error",
              "Cookie count:", cookiesToSet.length);
    
    if (sessionError || !session || !session.user) {
      const response = NextResponse.json(
        { message: 'Unauthorized' }, 
        { status: 401 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    const user = session.user;
    
    const { quantity } = await request.json();
    
    if (quantity === undefined || quantity < 1) {
      const response = NextResponse.json(
        { message: 'Valid quantity is required' }, 
        { status: 400 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Verify the user owns this cart item
    const { data: cartItem, error: getError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (getError || !cartItem) {
      const response = NextResponse.json(
        { message: 'Cart item not found or access denied', error: getError }, 
        { status: 404 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Update the cart item
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error updating cart item:', updateError);
      
      const response = NextResponse.json(
        { message: 'Error updating cart item', error: updateError }, 
        { status: 500 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Create response with data
    const response = NextResponse.json(
      { message: 'Cart item updated' }
    );
    
    // Apply any auth cookies
    return applyCookiesToResponse(response, cookiesToSet);
  } catch (error) {
    console.error('Server error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Delete cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Create supabase server client with request only
    const { supabase, cookiesToSet } = createClient(request);
    
    // Get the user from the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log("DELETE - Session status:", session ? "Found session" : "No session", 
              "Error:", sessionError ? sessionError.message : "No error",
              "Cookie count:", cookiesToSet.length);
    
    if (sessionError || !session || !session.user) {
      const response = NextResponse.json(
        { message: 'Unauthorized' }, 
        { status: 401 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    const user = session.user;
    
    // Verify the user owns this cart item
    const { data: cartItem, error: getError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
    
    if (getError || !cartItem) {
      const response = NextResponse.json(
        { message: 'Cart item not found or access denied', error: getError }, 
        { status: 404 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Delete the cart item
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting cart item:', deleteError);
      
      const response = NextResponse.json(
        { message: 'Error deleting cart item', error: deleteError }, 
        { status: 500 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Create response with data
    const response = NextResponse.json(
      { message: 'Cart item deleted' }
    );
    
    // Apply any auth cookies
    return applyCookiesToResponse(response, cookiesToSet);
  } catch (error) {
    console.error('Server error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 