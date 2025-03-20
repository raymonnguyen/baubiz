import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return Response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return Response.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 