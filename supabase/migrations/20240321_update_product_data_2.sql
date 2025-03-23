-- Update more seller descriptions
UPDATE products
SET seller_description = CASE
    WHEN id = '123e4567-e89b-12d3-a456-426614174103' THEN 
        jsonb_build_object(
            'content', '<h3>Premium Glass Baby Bottles</h3>
            <p>Our anti-colic glass baby bottles are designed with both baby and parent in mind. The natural rubber nipples closely mimic breastfeeding, making transitions easier.</p>
            <h4>Why Choose Glass?</h4>
            <ul>
                <li>Free from harmful chemicals (BPA, phthalates, etc.)</li>
                <li>Easier to sterilize and clean</li>
                <li>More durable than plastic</li>
                <li>Better for the environment</li>
            </ul>
            <h4>Anti-Colic System</h4>
            <p>Our innovative venting system helps reduce colic, gas, and fussiness by preventing air bubbles in milk or formula.</p>',
            'lastUpdated', NOW()::text
        )
    WHEN id = '123e4567-e89b-12d3-a456-426614174112' THEN
        jsonb_build_object(
            'content', '<h3>Advanced Baby Monitor Technology</h3>
            <p>Keep a close eye on your little one with our digital video baby monitor. Features crystal-clear video and audio, plus smart alerts for peace of mind.</p>
            <h4>Monitor Features:</h4>
            <ul>
                <li>HD video quality day and night</li>
                <li>Two-way audio communication</li>
                <li>Room temperature monitoring</li>
                <li>Built-in lullabies and white noise</li>
                <li>Movement and sound alerts</li>
            </ul>
            <p>Range up to 1000 feet with out-of-range indicator.</p>',
            'lastUpdated', NOW()::text
        )
    WHEN id = '123e4567-e89b-12d3-a456-426614174115' THEN
        jsonb_build_object(
            'content', '<h3>Ultimate Diaper Bag Organization</h3>
            <p>This thoughtfully designed diaper bag combines style with functionality. Multiple compartments keep everything organized and easily accessible.</p>
            <h4>Bag Features:</h4>
            <ul>
                <li>Insulated bottle pockets</li>
                <li>Waterproof changing pad included</li>
                <li>Laptop/tablet sleeve</li>
                <li>Stroller straps</li>
                <li>Easy-clean material</li>
            </ul>
            <p>Perfect for busy parents who need to carry everything but want to stay organized.</p>',
            'lastUpdated', NOW()::text
        )
    END
WHERE id IN (
    '123e4567-e89b-12d3-a456-426614174103',
    '123e4567-e89b-12d3-a456-426614174112',
    '123e4567-e89b-12d3-a456-426614174115'
); 