import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  
  // Pagination parameters
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;
  const offset = (page - 1) * limit;
  
  // Sorting and filtering
  const sortBy = searchParams.get('sortBy') || 'created_at'; // Default sort by creation date
  const sortOrder = searchParams.get('sortOrder') || 'desc'; // Default newest first
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
  const condition = searchParams.get('condition');
  const search = searchParams.get('search');
  
  try {
    // First, get the marketplace by slug
    const { data: market, error: marketError } = await supabase
      .from('markets')
      .select('id, name')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (marketError) {
      if (marketError.code === 'PGRST116') {
        return Response.json(
          { error: 'Marketplace not found' },
          { status: 404 }
        );
      }
      throw marketError;
    }
    
    // Build the query for products
    let query = supabase
      .from('products')
      .select('*, profiles!seller_id(*)', { count: 'exact' })
      .eq('market_id', market.id)
      .eq('status', 'active'); // Only get active products
    
    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    if (minPrice !== null) {
      query = query.gte('price', minPrice);
    }
    
    if (maxPrice !== null) {
      query = query.lte('price', maxPrice);
    }
    
    if (condition) {
      query = query.eq('condition', condition);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Apply sorting
    if (sortBy === 'price' && sortOrder === 'asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price' && sortOrder === 'desc') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'created_at' && sortOrder === 'asc') {
      query = query.order('created_at', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false }); // Default: newest first
    }
    
    // Apply pagination
    const { data: products, count, error: productsError } = await query
      .range(offset, offset + limit - 1);
    
    if (productsError) throw productsError;
    
    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit);
    
    // Format the products to include the seller information
    const formattedProducts = products?.map(product => {
      const { profiles, ...productDetails } = product;
      return {
        ...productDetails,
        seller: {
          id: profiles.id,
          name: profiles.name,
          avatar_url: profiles.avatar_url,
          business_type: profiles.business_type,
          seller_verification_status: profiles.verification_status,
          created_at: profiles.created_at
        }
      };
    });
    
    return Response.json({
      marketplace: {
        id: market.id,
        name: market.name,
        slug
      },
      products: formattedProducts || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount: count,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace products:', error);
    return Response.json(
      { error: 'Failed to fetch marketplace products' },
      { status: 500 }
    );
  }
} 