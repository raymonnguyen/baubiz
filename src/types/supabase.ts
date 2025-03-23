export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          price: number;
          seller_id: string;
          category: string;
          subcategory: string | null;
          condition: string;
          images: string[];
          status: string;
          location: string | null;
          features: string[] | null;
          specifications: Record<string, string> | null;
          market_id: string;
          slug: string;
          originalPrice: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          price: number;
          seller_id: string;
          category: string;
          subcategory?: string | null;
          condition: string;
          images: string[];
          status?: string;
          location?: string | null;
          features?: string[] | null;
          specifications?: Record<string, string> | null;
          market_id: string;
          slug?: string;
          originalPrice?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          price?: number;
          seller_id?: string;
          category?: string;
          subcategory?: string | null;
          condition?: string;
          images?: string[];
          status?: string;
          location?: string | null;
          features?: string[] | null;
          specifications?: Record<string, string> | null;
          market_id?: string;
          slug?: string;
          originalPrice?: number | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          avatar_url: string | null;
          phone: string | null;
          city: string | null;
          state: string | null;
          business_type: string | null;
          verification_status: string | null;
          bio: string | null;
          social_links: Record<string, string> | null;
          seller_rating: number | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          name: string;
          email: string;
          avatar_url?: string | null;
          phone?: string | null;
          city?: string | null;
          state?: string | null;
          business_type?: string | null;
          verification_status?: string | null;
          bio?: string | null;
          social_links?: Record<string, string> | null;
          seller_rating?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          email?: string;
          avatar_url?: string | null;
          phone?: string | null;
          city?: string | null;
          state?: string | null;
          business_type?: string | null;
          verification_status?: string | null;
          bio?: string | null;
          social_links?: Record<string, string> | null;
          seller_rating?: number | null;
        };
      };
      cart_items: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          product_id: string;
          quantity: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          product_id: string;
          quantity: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
        };
      };
      markets: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string;
          long_description: string | null;
          slug: string;
          logo_url: string | null;
          banner_url: string | null;
          owner_id: string;
          is_active: boolean;
          established_date: string | null;
          social_links: Record<string, string> | null;
          policies: Record<string, Record<string, string>> | null;
          faqs: Record<string, string>[] | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description: string;
          long_description?: string | null;
          slug: string;
          logo_url?: string | null;
          banner_url?: string | null;
          owner_id: string;
          is_active?: boolean;
          established_date?: string | null;
          social_links?: Record<string, string> | null;
          policies?: Record<string, Record<string, string>> | null;
          faqs?: Record<string, string>[] | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string;
          long_description?: string | null;
          slug?: string;
          logo_url?: string | null;
          banner_url?: string | null;
          owner_id?: string;
          is_active?: boolean;
          established_date?: string | null;
          social_links?: Record<string, string> | null;
          policies?: Record<string, Record<string, string>> | null;
          faqs?: Record<string, string>[] | null;
        };
      };
      categories: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          market_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          market_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          market_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 