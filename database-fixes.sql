-- Fix the relationship between markets and categories
DO $$
BEGIN
  -- Check if the foreign key constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'categories_market_id_fkey' 
    AND table_name = 'categories'
  ) THEN
    -- Add the constraint if it doesn't exist
    ALTER TABLE categories
    ADD CONSTRAINT categories_market_id_fkey
    FOREIGN KEY (market_id) REFERENCES markets(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Fix products relationship with markets
DO $$
BEGIN
  -- Check if the foreign key constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_market_id_fkey' 
    AND table_name = 'products'
  ) THEN
    -- Add the constraint if it doesn't exist
    ALTER TABLE products
    ADD CONSTRAINT products_market_id_fkey
    FOREIGN KEY (market_id) REFERENCES markets(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Fix relationship between products and profiles (seller)
DO $$
BEGIN
  -- Check if the foreign key constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'products_seller_id_fkey' 
    AND table_name = 'products'
  ) THEN
    -- Add the constraint if it doesn't exist
    ALTER TABLE products
    ADD CONSTRAINT products_seller_id_fkey
    FOREIGN KEY (seller_id) REFERENCES profiles(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Fix cart_items relationships
DO $$
BEGIN
  -- Check if the foreign key constraint already exists (cart_items to products)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_product_id_fkey' 
    AND table_name = 'cart_items'
  ) THEN
    -- Add the constraint if it doesn't exist
    ALTER TABLE cart_items
    ADD CONSTRAINT cart_items_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE;
  END IF;
  
  -- Check if the foreign key constraint already exists (cart_items to auth.users)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'cart_items_user_id_fkey' 
    AND table_name = 'cart_items'
  ) THEN
    -- Add the constraint if it doesn't exist
    ALTER TABLE cart_items
    ADD CONSTRAINT cart_items_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Add index for market slug for faster lookups
DO $$
BEGIN
  -- Check if the index already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_markets_slug'
  ) THEN
    -- Create the index if it doesn't exist
    CREATE INDEX idx_markets_slug ON markets(slug);
  END IF;
END $$;

-- Add index for products market_id for faster lookups
DO $$
BEGIN
  -- Check if the index already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_products_market_id'
  ) THEN
    -- Create the index if it doesn't exist
    CREATE INDEX idx_products_market_id ON products(market_id);
  END IF;
END $$; 