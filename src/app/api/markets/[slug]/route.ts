import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;

  try {
    // Fetch the market without trying to join categories
    const { data: market, error } = await supabase
      .from('markets')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json(
          { error: 'Marketplace not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    // Fetch categories separately
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('market_id', market.id);

    if (categoriesError) throw categoriesError;

    // Count products and sellers in this marketplace
    const { count: productCount, error: productError } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('market_id', market.id);

    if (productError) throw productError;

    // Count distinct sellers in this marketplace's products
    const { data: sellers, error: sellerError } = await supabase
      .from('products')
      .select('seller_id')
      .eq('market_id', market.id)
      .limit(1000); // Set a reasonable limit

    if (sellerError) throw sellerError;

    // Get unique seller count
    const uniqueSellerIds = new Set(sellers?.map(item => item.seller_id));
    const sellerCount = uniqueSellerIds.size;

    // Return market with categories and additional stats
    return Response.json({
      ...market,
      categories: categories || [],
      stats: {
        productCount: productCount || 0,
        sellerCount: sellerCount || 0
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    return Response.json(
      { error: 'Failed to fetch marketplace' },
      { status: 500 }
    );
  }
} 