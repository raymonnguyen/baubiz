import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    // Fetch the market and its categories
    const { data: market, error } = await supabase
      .from('markets')
      .select(`
        *,
        categories:categories(*)
      `)
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

    // Return market with additional stats
    return Response.json({
      ...market,
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