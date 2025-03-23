import { NextRequest, NextResponse } from 'next/server';
import { createClient, applyCookiesToResponse } from '@/lib/supabase-server';

interface CartItemMapping {
  [productId: string]: string;
}

// This endpoint returns a mapping of product_id to cart_item_id to help the client
// correctly reference cart items by their ID when updating
export async function GET(request: NextRequest) {
  try {
    // Create supabase server client with request only
    const { supabase, cookiesToSet } = createClient(request);
    
    // Get the user from the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log("ITEMS - Session status:", session ? "Found session" : "No session", 
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
    
    // Get cart item mappings - only the IDs we need
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('id, product_id')
      .eq('user_id', user.id);
    
    if (cartError) {
      console.error('Error fetching cart item mappings:', cartError);
      
      const response = NextResponse.json(
        { message: 'Error fetching cart item mappings', error: cartError }, 
        { status: 500 }
      );
      
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Transform to a mapping object for easier use
    const productToCartMap = cartItems.reduce<CartItemMapping>((map, item) => {
      map[item.product_id] = item.id;
      return map;
    }, {});
    
    // Create a standard response with the data
    const response = NextResponse.json({ cartItemMap: productToCartMap });
    
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