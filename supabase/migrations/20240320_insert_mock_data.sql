-- Insert mock market
INSERT INTO markets (id, seller_id, name, description, location, created_at, updated_at) VALUES
  ('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174201', 'New York Baby Market', 'A vibrant marketplace for baby products in New York City', 'New York, NY', NOW(), NOW());

-- Insert categories
INSERT INTO categories (id, name, slug, description, icon_url, parent_id) VALUES
  ('123e4567-e89b-12d3-a456-426614174001', 'Clothing', 'clothing', 'Baby clothes and accessories', 'https://example.com/icons/clothing.png', NULL),
  ('123e4567-e89b-12d3-a456-426614174002', 'Feeding', 'feeding', 'Baby feeding supplies and accessories', 'https://example.com/icons/feeding.png', NULL),
  ('123e4567-e89b-12d3-a456-426614174003', 'Sleep', 'sleep', 'Sleep-related items for babies', 'https://example.com/icons/sleep.png', NULL),
  ('123e4567-e89b-12d3-a456-426614174004', 'Travel', 'travel', 'Travel gear for babies and parents', 'https://example.com/icons/travel.png', NULL),
  ('123e4567-e89b-12d3-a456-426614174005', 'Toys & Books', 'toys-books', 'Educational toys and baby books', 'https://example.com/icons/toys.png', NULL),
  ('123e4567-e89b-12d3-a456-426614174006', 'Health & Safety', 'health-safety', 'Baby health and safety products', 'https://example.com/icons/health.png', NULL),
  ('123e4567-e89b-12d3-a456-426614174007', 'Bath & Grooming', 'bath-grooming', 'Bath and grooming supplies', 'https://example.com/icons/bath.png', NULL),
  ('123e4567-e89b-12d3-a456-426614174008', 'Diapering', 'diapering', 'Diapering supplies and accessories', 'https://example.com/icons/diaper.png', NULL);

-- Insert subcategories
INSERT INTO categories (id, name, slug, description, icon_url, parent_id) VALUES
  ('123e4567-e89b-12d3-a456-426614174011', 'Onesies', 'onesies', 'Baby onesies and bodysuits', 'https://example.com/icons/onesies.png', '123e4567-e89b-12d3-a456-426614174001'),
  ('123e4567-e89b-12d3-a456-426614174012', 'Sleepwear', 'sleepwear', 'Baby sleepwear and pajamas', 'https://example.com/icons/sleepwear.png', '123e4567-e89b-12d3-a456-426614174001'),
  ('123e4567-e89b-12d3-a456-426614174013', 'Outerwear', 'outerwear', 'Baby jackets, coats, and outerwear', 'https://example.com/icons/outerwear.png', '123e4567-e89b-12d3-a456-426614174001'),
  ('123e4567-e89b-12d3-a456-426614174021', 'Bottles', 'bottles', 'Baby bottles and accessories', 'https://example.com/icons/bottles.png', '123e4567-e89b-12d3-a456-426614174002'),
  ('123e4567-e89b-12d3-a456-426614174022', 'Breastfeeding', 'breastfeeding', 'Breastfeeding supplies and accessories', 'https://example.com/icons/breastfeeding.png', '123e4567-e89b-12d3-a456-426614174002'),
  ('123e4567-e89b-12d3-a456-426614174031', 'Cribs', 'cribs', 'Baby cribs and bassinets', 'https://example.com/icons/cribs.png', '123e4567-e89b-12d3-a456-426614174003'),
  ('123e4567-e89b-12d3-a456-426614174032', 'Bedding', 'bedding', 'Baby bedding and sleep accessories', 'https://example.com/icons/bedding.png', '123e4567-e89b-12d3-a456-426614174003'),
  ('123e4567-e89b-12d3-a456-426614174041', 'Strollers', 'strollers', 'Baby strollers and travel systems', 'https://example.com/icons/strollers.png', '123e4567-e89b-12d3-a456-426614174004'),
  ('123e4567-e89b-12d3-a456-426614174042', 'Car Seats', 'car-seats', 'Baby car seats and accessories', 'https://example.com/icons/car-seats.png', '123e4567-e89b-12d3-a456-426614174004');

-- Insert mock products
INSERT INTO products (id, market_id, seller_id, name, description, price, condition, category_id, images, status) VALUES
  -- Clothing
  ('123e4567-e89b-12d3-a456-426614174101', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174201', 'Organic Cotton Onesie Set', 'Set of 5 organic cotton onesies in various colors. Size 0-3 months.', 29.99, 'new', '123e4567-e89b-12d3-a456-426614174011', ARRAY['https://example.com/images/onesie1.jpg', 'https://example.com/images/onesie2.jpg'], 'active'),
  ('123e4567-e89b-12d3-a456-426614174102', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174202', 'Winter Baby Jacket', 'Warm and cozy winter jacket for babies. Size 6-12 months.', 39.99, 'like_new', '123e4567-e89b-12d3-a456-426614174013', ARRAY['https://example.com/images/jacket1.jpg'], 'active'),
  
  -- Feeding
  ('123e4567-e89b-12d3-a456-426614174103', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174201', 'Glass Baby Bottles Set', 'Set of 4 anti-colic glass baby bottles with natural rubber nipples.', 49.99, 'new', '123e4567-e89b-12d3-a456-426614174021', ARRAY['https://example.com/images/bottles1.jpg'], 'active'),
  ('123e4567-e89b-12d3-a456-426614174104', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174203', 'Nursing Pillow', 'Ergonomic nursing pillow with removable cover. Machine washable.', 34.99, 'good', '123e4567-e89b-12d3-a456-426614174022', ARRAY['https://example.com/images/pillow1.jpg'], 'active'),
  
  -- Sleep
  ('123e4567-e89b-12d3-a456-426614174105', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174202', 'Convertible Crib', 'Modern convertible crib that grows with your baby. Converts to toddler bed.', 299.99, 'new', '123e4567-e89b-12d3-a456-426614174031', ARRAY['https://example.com/images/crib1.jpg'], 'active'),
  ('123e4567-e89b-12d3-a456-426614174106', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174201', 'Organic Cotton Crib Sheets', 'Set of 3 organic cotton crib sheets. Fits standard crib mattress.', 49.99, 'new', '123e4567-e89b-12d3-a456-426614174032', ARRAY['https://example.com/images/sheets1.jpg'], 'active'),
  
  -- Travel
  ('123e4567-e89b-12d3-a456-426614174107', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174203', 'Lightweight Stroller', 'Compact and lightweight stroller perfect for travel. Folds easily.', 199.99, 'like_new', '123e4567-e89b-12d3-a456-426614174041', ARRAY['https://example.com/images/stroller1.jpg'], 'active'),
  ('123e4567-e89b-12d3-a456-426614174108', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174202', 'Infant Car Seat', 'Safety-certified infant car seat with base. Suitable from 4-35 lbs.', 159.99, 'new', '123e4567-e89b-12d3-a456-426614174042', ARRAY['https://example.com/images/carseat1.jpg'], 'active'),
  
  -- Toys & Books
  ('123e4567-e89b-12d3-a456-426614174109', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174201', 'Sensory Activity Gym', 'Colorful activity gym with hanging toys for tummy time.', 49.99, 'good', '123e4567-e89b-12d3-a456-426614174005', ARRAY['https://example.com/images/gym1.jpg'], 'active'),
  ('123e4567-e89b-12d3-a456-426614174110', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174203', 'Board Book Set', 'Set of 5 baby-friendly board books with high contrast images.', 24.99, 'new', '123e4567-e89b-12d3-a456-426614174005', ARRAY['https://example.com/images/books1.jpg'], 'active'),
  
  -- Health & Safety
  ('123e4567-e89b-12d3-a456-426614174111', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174202', 'Baby First Aid Kit', 'Comprehensive first aid kit for babies with essential items.', 29.99, 'new', '123e4567-e89b-12d3-a456-426614174006', ARRAY['https://example.com/images/firstaid1.jpg'], 'active'),
  ('123e4567-e89b-12d3-a456-426614174112', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174201', 'Baby Monitor', 'Digital video baby monitor with night vision and two-way audio.', 89.99, 'like_new', '123e4567-e89b-12d3-a456-426614174006', ARRAY['https://example.com/images/monitor1.jpg'], 'active'),
  
  -- Bath & Grooming
  ('123e4567-e89b-12d3-a456-426614174113', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174203', 'Baby Bath Set', 'Complete bath set including tub, towels, and grooming items.', 39.99, 'new', '123e4567-e89b-12d3-a456-426614174007', ARRAY['https://example.com/images/bath1.jpg'], 'active'),
  ('123e4567-e89b-12d3-a456-426614174114', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174202', 'Baby Grooming Kit', 'Set of baby grooming tools including nail clippers and brush.', 19.99, 'new', '123e4567-e89b-12d3-a456-426614174007', ARRAY['https://example.com/images/grooming1.jpg'], 'active'),
  
  -- Diapering
  ('123e4567-e89b-12d3-a456-426614174115', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174201', 'Diaper Bag', 'Spacious diaper bag with multiple compartments and changing pad.', 59.99, 'like_new', '123e4567-e89b-12d3-a456-426614174008', ARRAY['https://example.com/images/diaperbag1.jpg'], 'active'),
  ('123e4567-e89b-12d3-a456-426614174116', '123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174203', 'Cloth Diaper Set', 'Set of 6 reusable cloth diapers with inserts.', 89.99, 'new', '123e4567-e89b-12d3-a456-426614174008', ARRAY['https://example.com/images/clothdiaper1.jpg'], 'active');

-- Insert mock seller profiles
INSERT INTO profiles (id, name, username, avatar_url, bio, role, seller_verification_status, business_type, business_name, business_email, business_phone, business_website) VALUES
  ('123e4567-e89b-12d3-a456-426614174201', 'Sarah Johnson', 'sarahjohnson', 'https://example.com/avatars/sarah.jpg', 'Mom of two, passionate about sustainable baby products', 'seller', 'verified', 'individual', 'Sarah''s Baby Boutique', 'sarah@example.com', '+1234567890', 'https://sarahsbabyboutique.com'),
  ('123e4567-e89b-12d3-a456-426614174202', 'Michael Chen', 'michaelchen', 'https://example.com/avatars/michael.jpg', 'Father of three, specializing in premium baby gear', 'seller', 'verified', 'company', 'Baby Gear Pro', 'michael@babygearpro.com', '+1987654321', 'https://babygearpro.com'),
  ('123e4567-e89b-12d3-a456-426614174203', 'Emma Wilson', 'emmawilson', 'https://example.com/avatars/emma.jpg', 'New mom sharing gently used baby items', 'seller', 'pending', 'individual', NULL, 'emma@example.com', '+1122334455', NULL);

-- Insert mock verification requests
INSERT INTO verification_requests (id, user_id, role, business_type, business_name, business_registration_number, business_address, business_phone, business_email, business_website, status) VALUES
  ('123e4567-e89b-12d3-a456-426614174301', '123e4567-e89b-12d3-a456-426614174201', 'seller', 'individual', 'Sarah''s Baby Boutique', NULL, '123 Main St, City, Country', '+1234567890', 'sarah@example.com', 'https://sarahsbabyboutique.com', 'verified'),
  ('123e4567-e89b-12d3-a456-426614174302', '123e4567-e89b-12d3-a456-426614174202', 'seller', 'company', 'Baby Gear Pro', 'REG123456', '456 Business Ave, City, Country', '+1987654321', 'michael@babygearpro.com', 'https://babygearpro.com', 'verified'),
  ('123e4567-e89b-12d3-a456-426614174303', '123e4567-e89b-12d3-a456-426614174203', 'seller', 'individual', NULL, NULL, '789 Home St, City, Country', '+1122334455', 'emma@example.com', NULL, 'pending');

-- Insert mock seller metrics
INSERT INTO seller_metrics (id, seller_id, total_sales, total_orders, average_rating, total_reviews, response_rate, response_time) VALUES
  ('123e4567-e89b-12d3-a456-426614174401', '123e4567-e89b-12d3-a456-426614174201', 1250.50, 25, 4.8, 20, 0.95, 2),
  ('123e4567-e89b-12d3-a456-426614174402', '123e4567-e89b-12d3-a456-426614174202', 3500.75, 45, 4.9, 35, 0.98, 1),
  ('123e4567-e89b-12d3-a456-426614174403', '123e4567-e89b-12d3-a456-426614174203', 450.25, 8, 4.5, 5, 0.90, 3);

-- Insert mock seller reviews
INSERT INTO seller_reviews (id, seller_id, reviewer_id, rating, comment) VALUES
  ('123e4567-e89b-12d3-a456-426614174501', '123e4567-e89b-12d3-a456-426614174201', '123e4567-e89b-12d3-a456-426614174601', 5, 'Excellent service and high-quality products!'),
  ('123e4567-e89b-12d3-a456-426614174502', '123e4567-e89b-12d3-a456-426614174201', '123e4567-e89b-12d3-a456-426614174602', 4, 'Great communication and fast shipping.'),
  ('123e4567-e89b-12d3-a456-426614174503', '123e4567-e89b-12d3-a456-426614174202', '123e4567-e89b-12d3-a456-426614174603', 5, 'Premium products and professional service.'),
  ('123e4567-e89b-12d3-a456-426614174504', '123e4567-e89b-12d3-a456-426614174202', '123e4567-e89b-12d3-a456-426614174604', 5, 'Best baby gear seller I''ve found!'),
  ('123e4567-e89b-12d3-a456-426614174505', '123e4567-e89b-12d3-a456-426614174203', '123e4567-e89b-12d3-a456-426614174605', 4, 'Good prices and quick responses.');

-- Insert mock seller badges
INSERT INTO seller_badges (id, name, description, icon_url, requirements) VALUES
  ('123e4567-e89b-12d3-a456-426614174701', 'Top Seller', 'Awarded to sellers with high sales volume and ratings', 'https://example.com/badges/top-seller.png', '{"min_sales": 1000, "min_rating": 4.5}'),
  ('123e4567-e89b-12d3-a456-426614174702', 'Fast Responder', 'Awarded to sellers with quick response times', 'https://example.com/badges/fast-responder.png', '{"max_response_time": 4, "min_response_rate": 0.9}'),
  ('123e4567-e89b-12d3-a456-426614174703', 'Verified Seller', 'Awarded to verified business sellers', 'https://example.com/badges/verified.png', '{"business_type": "company", "verification_status": "verified"}');

-- Assign badges to sellers
INSERT INTO seller_badge_assignments (id, seller_id, badge_id, assigned_at) VALUES
  ('123e4567-e89b-12d3-a456-426614174801', '123e4567-e89b-12d3-a456-426614174201', '123e4567-e89b-12d3-a456-426614174701', NOW()),
  ('123e4567-e89b-12d3-a456-426614174802', '123e4567-e89b-12d3-a456-426614174201', '123e4567-e89b-12d3-a456-426614174702', NOW()),
  ('123e4567-e89b-12d3-a456-426614174803', '123e4567-e89b-12d3-a456-426614174202', '123e4567-e89b-12d3-a456-426614174701', NOW()),
  ('123e4567-e89b-12d3-a456-426614174804', '123e4567-e89b-12d3-a456-426614174202', '123e4567-e89b-12d3-a456-426614174702', NOW()),
  ('123e4567-e89b-12d3-a456-426614174805', '123e4567-e89b-12d3-a456-426614174202', '123e4567-e89b-12d3-a456-426614174703', NOW());

-- Insert mock seller specializations
INSERT INTO seller_specializations (id, seller_id, category, description) VALUES
  ('123e4567-e89b-12d3-a456-426614174901', '123e4567-e89b-12d3-a456-426614174201', 'clothing', 'Specializing in organic baby clothing'),
  ('123e4567-e89b-12d3-a456-426614174902', '123e4567-e89b-12d3-a456-426614174202', 'travel', 'Expert in premium baby travel gear'),
  ('123e4567-e89b-12d3-a456-426614174903', '123e4567-e89b-12d3-a456-426614174203', 'toys-books', 'Focusing on educational toys and books');

-- Insert mock seller availability
INSERT INTO seller_availability (id, seller_id, day_of_week, start_time, end_time, is_available) VALUES
  ('123e4567-e89b-12d3-a456-426614175001', '123e4567-e89b-12d3-a456-426614174201', 1, '09:00', '17:00', true),
  ('123e4567-e89b-12d3-a456-426614175002', '123e4567-e89b-12d3-a456-426614174201', 2, '09:00', '17:00', true),
  ('123e4567-e89b-12d3-a456-426614175003', '123e4567-e89b-12d3-a456-426614174201', 3, '09:00', '17:00', true),
  ('123e4567-e89b-12d3-a456-426614175004', '123e4567-e89b-12d3-a456-426614174201', 4, '09:00', '17:00', true),
  ('123e4567-e89b-12d3-a456-426614175005', '123e4567-e89b-12d3-a456-426614174201', 5, '09:00', '17:00', true),
  ('123e4567-e89b-12d3-a456-426614175006', '123e4567-e89b-12d3-a456-426614174202', 1, '10:00', '18:00', true),
  ('123e4567-e89b-12d3-a456-426614175007', '123e4567-e89b-12d3-a456-426614174202', 2, '10:00', '18:00', true),
  ('123e4567-e89b-12d3-a456-426614175008', '123e4567-e89b-12d3-a456-426614174202', 3, '10:00', '18:00', true),
  ('123e4567-e89b-12d3-a456-426614175009', '123e4567-e89b-12d3-a456-426614174202', 4, '10:00', '18:00', true),
  ('123e4567-e89b-12d3-a456-426614175010', '123e4567-e89b-12d3-a456-426614174202', 5, '10:00', '18:00', true);

-- Insert mock seller payment settings
INSERT INTO seller_payment_settings (id, seller_id, payment_method, account_details, is_default) VALUES
  ('123e4567-e89b-12d3-a456-426614176001', '123e4567-e89b-12d3-a456-426614174201', 'bank_transfer', '{"bank_name": "Bank of America", "account_number": "****1234", "routing_number": "****5678"}', true),
  ('123e4567-e89b-12d3-a456-426614176002', '123e4567-e89b-12d3-a456-426614174202', 'paypal', '{"email": "michael@babygearpro.com"}', true),
  ('123e4567-e89b-12d3-a456-426614176003', '123e4567-e89b-12d3-a456-426614174203', 'bank_transfer', '{"bank_name": "Chase", "account_number": "****4321", "routing_number": "****8765"}', true); 