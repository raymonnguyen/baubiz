-- Create enum types first
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_condition') THEN
    CREATE TYPE product_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_status') THEN
    CREATE TYPE product_status AS ENUM ('active', 'sold', 'archived');
  END IF;
END $$;

-- Update enum types
ALTER TYPE business_type ADD VALUE IF NOT EXISTS 'business';
ALTER TYPE seller_verification_status ADD VALUE IF NOT EXISTS 'not_applied';

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS business_email text,
ADD COLUMN IF NOT EXISTS business_logo text,
ADD COLUMN IF NOT EXISTS business_documents text[];

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  parent_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on categories if not already enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for categories if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Categories are viewable by everyone'
  ) THEN
    CREATE POLICY "Categories are viewable by everyone"
      ON categories FOR SELECT
      USING (true);
  END IF;
END $$;

-- Create trigger for categories if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_categories_updated_at'
  ) THEN
    CREATE TRIGGER handle_categories_updated_at
      BEFORE UPDATE ON categories
      FOR EACH ROW
      EXECUTE FUNCTION handle_updated_at();
  END IF;
END $$;

-- Update products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
ADD COLUMN IF NOT EXISTS condition product_condition,
ADD COLUMN IF NOT EXISTS status product_status DEFAULT 'active';

-- Update verification_requests table
ALTER TABLE verification_requests
ADD COLUMN IF NOT EXISTS business_email text,
ADD COLUMN IF NOT EXISTS business_logo text,
ADD COLUMN IF NOT EXISTS business_documents text[],
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Add admin policy for verification requests if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'verification_requests' AND policyname = 'Admins can view all verification requests'
  ) THEN
    CREATE POLICY "Admins can view all verification requests"
      ON verification_requests FOR SELECT
      USING ( EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      ));
  END IF;
END $$;

-- Update existing products to use new status field
UPDATE products 
SET status = CASE 
  WHEN is_active = true THEN 'active'::product_status
  ELSE 'archived'::product_status
END;

-- Drop is_active column from products if it exists
ALTER TABLE products DROP COLUMN IF EXISTS is_active;

-- Update existing products to use new condition field
UPDATE products 
SET condition = 'good'::product_condition 
WHERE condition IS NULL;

-- Make condition field NOT NULL
ALTER TABLE products 
ALTER COLUMN condition SET NOT NULL; 