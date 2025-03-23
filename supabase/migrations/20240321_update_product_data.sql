-- Update seller descriptions for some products
UPDATE products
SET seller_description = CASE
    WHEN id = '123e4567-e89b-12d3-a456-426614174101' THEN 
        '<h3>About Our Organic Cotton Onesies</h3>
        <p>As a parent-owned business, we understand the importance of choosing the right clothing for your little one. Our organic cotton onesies are carefully selected to ensure maximum comfort and safety for your baby.</p>
        <h4>Product Features:</h4>
        <ul>
            <li>100% GOTS certified organic cotton</li>
            <li>Snap closures for easy diaper changes</li>
            <li>Expandable shoulders for easy dressing</li>
            <li>Pre-washed and pre-shrunk</li>
        </ul>'
    WHEN id = '123e4567-e89b-12d3-a456-426614174105' THEN
        '<h3>Convertible Crib Details</h3>
        <p>This modern convertible crib is designed to grow with your child from infancy through the toddler years. Made with sustainable materials and rigorous safety standards.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>Converts to toddler bed and daybed</li>
            <li>Made from sustainable New Zealand pine</li>
            <li>Non-toxic finish</li>
            <li>Adjustable mattress height</li>
        </ul>
        <p>All hardware and conversion kit included.</p>'
    WHEN id = '123e4567-e89b-12d3-a456-426614174108' THEN
        '<h3>Safety-First Car Seat</h3>
        <p>Our infant car seat is designed with the latest safety technology and comfort features to give you peace of mind during every journey.</p>
        <h4>Safety Features:</h4>
        <ul>
            <li>5-point harness system</li>
            <li>Side-impact protection</li>
            <li>Energy-absorbing foam</li>
            <li>Easy-to-read level indicator</li>
        </ul>
        <p>Meets or exceeds all federal safety standards.</p>'
    END
WHERE id IN (
    '123e4567-e89b-12d3-a456-426614174101',
    '123e4567-e89b-12d3-a456-426614174105',
    '123e4567-e89b-12d3-a456-426614174108'
);

-- Insert product properties
INSERT INTO product_properties (id, product_id, attr_name, attr_value, property_type, created_at, updated_at)
VALUES
    -- Organic Cotton Onesie Set Properties
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174101', 'Material', '100% Organic Cotton', 'material', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174101', 'Size Range', '0-3 months', 'basic', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174101', 'Pack Count', '5 pieces', 'basic', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174101', 'Care Instructions', 'Machine wash cold', 'basic', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174101', 'GOTS Certified', 'Yes', 'certification', NOW(), NOW()),
    
    -- Convertible Crib Properties
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174105', 'Material', 'New Zealand Pine', 'material', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174105', 'Dimensions', '54.5"L x 30.5"W x 44"H', 'technical', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174105', 'Weight Capacity', 'Up to 50 lbs', 'technical', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174105', 'Convertible Options', '4-in-1 (Crib, Toddler, Daybed, Full)', 'feature', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174105', 'Safety Certification', 'JPMA Certified', 'certification', NOW(), NOW()),
    
    -- Infant Car Seat Properties
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174108', 'Weight Range', '4-35 lbs', 'technical', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174108', 'Height Range', 'Up to 32 inches', 'technical', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174108', 'Base Type', 'Stay-in-Car Safety Base', 'basic', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174108', 'Safety Features', '5-point harness, Side-impact protection', 'feature', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174108', 'Safety Standards', 'FMVSS 213 Certified', 'certification', NOW(), NOW()),
    
    -- Glass Baby Bottles Set Properties
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174103', 'Material', 'Borosilicate Glass', 'material', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174103', 'Bottle Size', '8 oz each', 'technical', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174103', 'Nipple Material', 'Natural Rubber', 'material', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174103', 'Anti-Colic', 'Yes', 'feature', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174103', 'Package Contents', '4 bottles, 4 nipples, 4 caps', 'packaging', NOW(), NOW()),
    
    -- Baby Monitor Properties
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174112', 'Range', 'Up to 1000 ft', 'technical', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174112', 'Screen Size', '5 inch LCD', 'technical', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174112', 'Battery Life', '12 hours', 'technical', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174112', 'Night Vision', 'Infrared LED', 'feature', NOW(), NOW()),
    (uuid_generate_v4(), '123e4567-e89b-12d3-a456-426614174112', 'Additional Features', 'Temperature monitoring, Lullabies', 'feature', NOW(), NOW()); 