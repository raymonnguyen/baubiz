import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = (page - 1) * limit;
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  try {
    // For category filtering, we need a different approach
    if (category) {
      // First get the category IDs that match the category name
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('market_id')
        .ilike('name', `%${category}%`);
      
      if (categoryError) throw categoryError;
      
      // Get unique market IDs that have this category
      const marketIds = [...new Set(categoryData?.map(c => c.market_id))];
      
      if (marketIds.length === 0) {
        // No markets with this category
        return Response.json({
          markets: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            hasMore: false
          }
        });
      }
      
      // Now fetch markets with those IDs
      const { data: markets, count, error } = await supabase
        .from('markets')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .in('id', marketIds)
        .order('name')
        .range(offset, offset + limit - 1);
      
      if (error) throw error;

      // If we have markets, fetch their categories separately
      if (markets && markets.length > 0) {
        // Get all categories for these markets
        const { data: allCategories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .in('market_id', markets.map(m => m.id));
          
        if (categoriesError) throw categoriesError;
        
        // Attach categories to each market
        const marketsWithCategories = markets.map(market => ({
          ...market,
          categories: allCategories?.filter(cat => cat.market_id === market.id) || []
        }));
        
        const totalPages = Math.ceil((count || 0) / limit);
        
        return Response.json({
          markets: marketsWithCategories,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount: count,
            hasMore: page < totalPages
          }
        });
      }
      
      const totalPages = Math.ceil((count || 0) / limit);
      
      return Response.json({
        markets: markets || [],
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: count,
          hasMore: page < totalPages
        }
      });
    } else {
      // Regular search without category filtering
      let query = supabase
        .from('markets')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // Add search filter if provided
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Add pagination
      const { data: markets, count, error } = await query
        .order('name')
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // If we have markets, fetch their categories separately
      if (markets && markets.length > 0) {
        // Get all categories for these markets
        const { data: allCategories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .in('market_id', markets.map(m => m.id));
          
        if (categoriesError) throw categoriesError;
        
        // Attach categories to each market
        const marketsWithCategories = markets.map(market => ({
          ...market,
          categories: allCategories?.filter(cat => cat.market_id === market.id) || []
        }));
        
        const totalPages = Math.ceil((count || 0) / limit);
        
        return Response.json({
          markets: marketsWithCategories,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount: count,
            hasMore: page < totalPages
          }
        });
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return Response.json({
        markets: markets || [],
        pagination: {
          currentPage: page,
          totalPages,
          totalCount: count,
          hasMore: page < totalPages
        }
      });
    }
  } catch (error) {
    console.error('Error fetching markets:', error);
    return Response.json(
      { error: 'Failed to fetch markets' },
      { status: 500 }
    );
  }
} 