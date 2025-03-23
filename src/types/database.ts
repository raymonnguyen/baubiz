import { VerificationType } from "@/components/seller/VerifiedBadge";
import type { VerificationType as VerifiedBadgeVerificationType } from '@/components/seller/VerifiedBadge';

export type UserRole = 'parent' | 'business' | 'seller' | 'admin';
export type SellerVerificationStatus = 'not_applied' | 'pending' | 'verified' | 'rejected';
export type BusinessType = 'individual' | 'company' | 'non_profit';

export interface Profile {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  seller_verification_status: SellerVerificationStatus;
  business_type: BusinessType | null;
  business_name: string | null;
  business_registration_number: string | null;
  business_address: string | null;
  business_phone: string | null;
  business_email: string | null;
  business_website: string | null;
  business_logo: string | null;
  business_documents: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  role: UserRole;
  business_type: BusinessType | null;
  business_name: string | null;
  business_registration_number: string | null;
  business_address: string | null;
  business_phone: string | null;
  business_email: string | null;
  business_website: string | null;
  business_logo: string | null;
  business_documents: string[] | null;
  verification_status: SellerVerificationStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SellerMetrics {
  id: string;
  seller_id: string;
  total_sales: number;
  total_orders: number;
  average_rating: number;
  total_reviews: number;
  response_rate: number;
  response_time: number;
  created_at: string;
  updated_at: string;
}

export interface SellerReview {
  id: string;
  seller_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface SellerBadge {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  requirements: Record<string, any>;
  created_at: string;
}

export interface SellerBadgeAssignment {
  id: string;
  seller_id: string;
  badge_id: string;
  assigned_at: string;
  expires_at: string | null;
}

export interface SellerSpecialization {
  id: string;
  seller_id: string;
  category: string;
  description: string | null;
  created_at: string;
}

export interface SellerAvailability {
  id: string;
  seller_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface SellerPaymentSetting {
  id: string;
  seller_id: string;
  payment_method: string;
  account_details: Record<string, any>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  seller_description: string | null;
  price: number;
  originalPrice?: number;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  category: string;
  category_id: string;
  seller_id: string;
  images: string[];
  status: 'active' | 'sold' | 'archived';
  created_at: string;
  updated_at: string;
  seller_name: string;
  seller_business_type: VerificationType;
  properties?: ProductProperty[];
  isNew?: boolean;
  rating?: number;
  totalSales?: number;
  features?: string[];
  details?: Record<string, string>;
  shippingInfo?: {
    methods: Array<{
      name: string;
      price: number;
      estimatedDelivery: string;
    }>;
    returns?: string;
  };
  seller?: {
    id: string;
    name: string;
    avatar_url: string | null;
    business_type: VerificationType;
    seller_verification_status: string;
    created_at: string;
  };
  relatedProducts?: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
    condition: string;
  }>;
  quantity?: number;
  slug: string;
}

export interface ProductProperty {
  id: string;
  product_id: string;
  attr_name: string;
  attr_name_id?: number;
  attr_value: string;
  attr_value_id?: number;
  property_type: 'basic' | 'technical' | 'material' | 'feature' | 'packaging' | 'certification';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  seller_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      verification_requests: {
        Row: VerificationRequest;
        Insert: Omit<VerificationRequest, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<VerificationRequest, 'id' | 'created_at' | 'updated_at'>>;
      };
      seller_metrics: {
        Row: SellerMetrics;
        Insert: Omit<SellerMetrics, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SellerMetrics, 'id' | 'created_at' | 'updated_at'>>;
      };
      seller_reviews: {
        Row: SellerReview;
        Insert: Omit<SellerReview, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SellerReview, 'id' | 'created_at' | 'updated_at'>>;
      };
      seller_badges: {
        Row: SellerBadge;
        Insert: Omit<SellerBadge, 'id' | 'created_at'>;
        Update: Partial<Omit<SellerBadge, 'id' | 'created_at'>>;
      };
      seller_badge_assignments: {
        Row: SellerBadgeAssignment;
        Insert: Omit<SellerBadgeAssignment, 'id' | 'assigned_at'>;
        Update: Partial<Omit<SellerBadgeAssignment, 'id' | 'assigned_at'>>;
      };
      seller_specializations: {
        Row: SellerSpecialization;
        Insert: Omit<SellerSpecialization, 'id' | 'created_at'>;
        Update: Partial<Omit<SellerSpecialization, 'id' | 'created_at'>>;
      };
      seller_availability: {
        Row: SellerAvailability;
        Insert: Omit<SellerAvailability, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SellerAvailability, 'id' | 'created_at' | 'updated_at'>>;
      };
      seller_payment_settings: {
        Row: SellerPaymentSetting;
        Insert: Omit<SellerPaymentSetting, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SellerPaymentSetting, 'id' | 'created_at' | 'updated_at'>>;
      };
      cart_items: {
        Row: CartItem;
        Insert: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CartItem, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export interface Seller {
  id: string;
  name: string;
  business_type?: string;
  created_at?: string;
  avatar_url?: string;
  verification_status?: 'unverified' | 'verified' | 'rejected';
} 