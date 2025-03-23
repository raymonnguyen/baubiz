-- Drop existing tables if they exist
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS verification_requests CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS product_properties CASCADE;

-- Create enum types
CREATE TYPE seller_verification_status AS ENUM ('not_applied', 'pending', 'verified', 'rejected');
CREATE TYPE business_type AS ENUM ('individual', 'business');
CREATE TYPE product_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');
CREATE TYPE product_status AS ENUM ('active', 'sold', 'archived');
CREATE TYPE property_type AS ENUM ('basic', 'technical', 'material', 'feature', 'packaging', 'certification');

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user',
  seller_verification_status seller_verification_status DEFAULT 'not_applied',
  business_type business_type,
  business_name TEXT,
  business_address TEXT,
  business_phone TEXT,
  business_website TEXT,
  business_registration_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  seller_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  condition product_condition NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  images TEXT[],
  status product_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create product_properties table
CREATE TABLE product_properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attr_name TEXT NOT NULL,
  attr_name_id INTEGER,
  attr_value TEXT NOT NULL,
  attr_value_id INTEGER,
  property_type property_type NOT NULL DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for product_properties
CREATE INDEX idx_product_properties_product_id ON product_properties(product_id);
CREATE INDEX idx_product_properties_type ON product_properties(property_type);

-- Create verification_requests table
CREATE TABLE verification_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  business_type business_type NOT NULL,
  business_name TEXT NOT NULL,
  business_address TEXT NOT NULL,
  business_phone TEXT NOT NULL,
  business_website TEXT,
  business_registration_number TEXT,
  verification_status seller_verification_status DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Create policies for products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  USING (auth.uid() = seller_id);

-- Create policies for verification_requests
CREATE POLICY "Users can view their own verification requests"
  ON verification_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own verification requests"
  ON verification_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_verification_requests_updated_at
  BEFORE UPDATE ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at(); 