import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get('limit')) || 10;
  
  try {
    // Get top markets
    const { data: topMarkets, error } = await supabase
      .from('markets')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    if (topMarkets && topMarkets.length > 0) {
      // Get all categories for these markets
      const { data: marketCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .in('market_id', topMarkets.map(m => m.id));
        
      if (categoriesError) throw categoriesError;
      
      // Attach categories to each market
      const marketsWithCategories = topMarkets.map(market => ({
        ...market,
        categories: marketCategories?.filter(cat => cat.market_id === market.id) || []
      }));
      
      // Limit each market to have max 10 categories for the slider
      const processedMarkets = marketsWithCategories.map(market => ({
        ...market,
        categories: market.categories?.slice(0, 10) || []
      }));
      
      return Response.json(processedMarkets);
    }
    
    return Response.json(topMarkets || []);
  } catch (error) {
    console.error('Error fetching top markets:', error);
    return Response.json(
      { error: 'Failed to fetch top markets' },
      { status: 500 }
    );
  }
} 