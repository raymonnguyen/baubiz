import { NextRequest, NextResponse } from 'next/server';
import { createClient, applyCookiesToResponse } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  console.log('GET /api/cart');
  
  try {
    // Create supabase server client
    const { supabase, cookiesToSet } = createClient(request);
    const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return new Response(JSON.stringify({ 
      error: 'Unauthorized', 
      details: error?.message || 'No active session'
    }), { 
      status: 401, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
    // Check for authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      console.log(`Auth header present: ${authHeader.startsWith('Bearer ') ? 'Bearer token' : 'Other format'}`);
    } else {
      console.log('No Authorization header present');
    }
    
    // Check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
    }
    
    if (!session) {
      console.log('No session found');
      const response = NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    console.log(`Session found for user: ${session.user.id}`);
    
    // Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        *,
        products:product_id(*),
        profiles:seller_id(id, name, business_type, created_at, avatar_url)
      `)
      .eq('user_id', session.user.id);
    
    if (cartError) {
      console.error('Error fetching cart items:', cartError);
      
      const response = NextResponse.json(
        { error: 'Error fetching cart items' }, 
        { status: 500 }
      );
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    console.log(`Found ${cartItems?.length || 0} cart items`);
    
    // Create response with data
    const response = NextResponse.json({ cartItems });
    
    // Add session token cookie to help with authentication
    if (session.access_token) {
      response.cookies.set({
        name: 'sb-access-token',
        value: session.access_token,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    }
    
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

export async function POST(request: NextRequest) {  
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
    
    // Get request body
    const body = await request.json();
    const productId = body.product_id;
    const quantity = body.quantity || 1;
    
    if (!productId) {
      const response = NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError || !product) {
      const response = NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    // Check if item is already in cart
    const { data: existingItem, error: existingItemError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('product_id', productId)
      .maybeSingle();
    
    if (existingItemError && existingItemError.code !== 'PGRST116') {
      const response = NextResponse.json(
        { error: 'Error checking cart item' }, 
        { status: 500 }
      );
      return applyCookiesToResponse(response, cookiesToSet);
    }
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);
      
      if (updateError) {
        const response = NextResponse.json(
          { error: 'Error updating cart item' }, 
          { status: 500 }
        );
        return applyCookiesToResponse(response, cookiesToSet);
      }
    } else {
      // Add new item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: session.user.id,
          product_id: productId,
          seller_id: product.seller_id,
          quantity: quantity
        });
      
      if (insertError) {
        const response = NextResponse.json(
          { error: 'Error adding cart item' }, 
          { status: 500 }
        );
        return applyCookiesToResponse(response, cookiesToSet);
      }
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