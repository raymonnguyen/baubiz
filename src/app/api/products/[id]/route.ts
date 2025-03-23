import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id;
    
    // First fetch the product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', id)
      .single();
      
    if (productError) throw productError;

    // Then fetch the seller profile with created_at
    const { data: sellerData, error: sellerError } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, business_type, seller_verification_status, created_at')
      .eq('id', productData.seller_id)
      .single();

    if (sellerError) throw sellerError;

    // Combine the data
    const productWithSeller = {
      ...productData,
      seller: sellerData
    };

    // Fetch frequently bought together items
    // This would typically be based on order history, but for now we'll use category-based
    const { data: frequentlyBoughtData, error: frequentlyBoughtError } = await supabase
      .from('products')
      .select('*')
      .eq('category', productData.category)
      .neq('id', productData.id)
      .neq('seller_id', productData.seller_id)
      .limit(10);

    if (frequentlyBoughtError) throw frequentlyBoughtError;

    // Fetch more items from the same seller
    const { data: sellerProductsData, error: sellerProductsError } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', productData.seller_id)
      .neq('id', productData.id)
      .limit(10);

    if (sellerProductsError) throw sellerProductsError;

    return NextResponse.json({
      product: productWithSeller,
      frequentlyBoughtTogether: frequentlyBoughtData || [],
      moreFromSeller: sellerProductsData || []
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
} 