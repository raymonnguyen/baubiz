-- Insert markets
INSERT INTO markets (id, name, description, slug, logo_url, banner_url, status) VALUES
(gen_random_uuid(), 'Máy Hút Sữa Market', 'Chợ chuyên về máy hút sữa và phụ kiện cho mẹ', 'may-hut-sua', 'https://example.com/logos/may-hut-sua.png', 'https://example.com/banners/may-hut-sua.jpg', 'active'),
(gen_random_uuid(), 'Bình Sữa Market', 'Chợ chuyên về bình sữa và phụ kiện', 'binh-sua', 'https://example.com/logos/binh-sua.png', 'https://example.com/banners/binh-sua.jpg', 'active'),
(gen_random_uuid(), 'Quần Áo Trẻ Em Market', 'Chợ chuyên về quần áo trẻ em', 'quan-ao', 'https://example.com/logos/quan-ao.png', 'https://example.com/banners/quan-ao.jpg', 'active'),
(gen_random_uuid(), 'Tã Market', 'Chợ chuyên về tã và bỉm cho bé', 'ta-bim', 'https://example.com/logos/ta-bim.png', 'https://example.com/banners/ta-bim.jpg', 'active'),
(gen_random_uuid(), 'Sữa Công Thức Market', 'Chợ chuyên về sữa công thức cho bé', 'sua-cong-thuc', 'https://example.com/logos/sua.png', 'https://example.com/banners/sua.jpg', 'active'),
(gen_random_uuid(), 'Xe Đẩy Market', 'Chợ chuyên về xe đẩy và đồ đi kèm', 'xe-day', 'https://example.com/logos/xe-day.png', 'https://example.com/banners/xe-day.jpg', 'active'),
(gen_random_uuid(), 'Đồ Chơi Market', 'Chợ chuyên về đồ chơi trẻ em', 'do-choi', 'https://example.com/logos/do-choi.png', 'https://example.com/banners/do-choi.jpg', 'active'),
(gen_random_uuid(), 'Giấc Ngủ Market', 'Chợ chuyên về các sản phẩm hỗ trợ giấc ngủ cho bé', 'giac-ngu', 'https://example.com/logos/giac-ngu.png', 'https://example.com/banners/giac-ngu.jpg', 'active'),
(gen_random_uuid(), 'Mẹ Sau Sinh Market', 'Chợ chuyên về vật dụng cho mẹ sau sinh', 'me-sau-sinh', 'https://example.com/logos/me-sau-sinh.png', 'https://example.com/banners/me-sau-sinh.jpg', 'active'),
(gen_random_uuid(), 'Sách Mẹ và Bé Market', 'Chợ chuyên về sách cho mẹ và bé', 'sach', 'https://example.com/logos/sach.png', 'https://example.com/banners/sach.jpg', 'active');

-- Store market UUIDs in variables for reference
DO $$
DECLARE
    may_hut_sua_id UUID;
    binh_sua_id UUID;
    quan_ao_id UUID;
    ta_id UUID;
    sua_id UUID;
    xe_day_id UUID;
    do_choi_id UUID;
    giac_ngu_id UUID;
    me_sau_sinh_id UUID;
    sach_id UUID;
BEGIN
    -- Get the generated UUIDs
    SELECT id INTO may_hut_sua_id FROM markets WHERE slug = 'may-hut-sua';
    SELECT id INTO binh_sua_id FROM markets WHERE slug = 'binh-sua';
    SELECT id INTO quan_ao_id FROM markets WHERE slug = 'quan-ao';
    SELECT id INTO ta_id FROM markets WHERE slug = 'ta-bim';
    SELECT id INTO sua_id FROM markets WHERE slug = 'sua-cong-thuc';
    SELECT id INTO xe_day_id FROM markets WHERE slug = 'xe-day';
    SELECT id INTO do_choi_id FROM markets WHERE slug = 'do-choi';
    SELECT id INTO giac_ngu_id FROM markets WHERE slug = 'giac-ngu';
    SELECT id INTO me_sau_sinh_id FROM markets WHERE slug = 'me-sau-sinh';
    SELECT id INTO sach_id FROM markets WHERE slug = 'sach';

    -- Insert categories using the market UUIDs
    -- Máy hút sữa categories
    INSERT INTO categories (id, market_id, name, description, slug, icon_url, parent_id) VALUES
    (gen_random_uuid(), may_hut_sua_id, 'Máy Hút Sữa Điện Đôi', 'Máy hút sữa điện đôi các loại', 'may-hut-sua-dien-doi', 'https://example.com/icons/may-hut-sua-dien-doi.png', NULL),
    (gen_random_uuid(), may_hut_sua_id, 'Máy Hút Sữa Điện Đơn', 'Máy hút sữa điện đơn các loại', 'may-hut-sua-dien-don', 'https://example.com/icons/may-hut-sua-dien-don.png', NULL),
    (gen_random_uuid(), may_hut_sua_id, 'Phụ Kiện Máy Hút Sữa', 'Phụ kiện cho máy hút sữa', 'phu-kien-may-hut-sua', 'https://example.com/icons/phu-kien-may-hut-sua.png', NULL);

    -- Bình sữa categories
    INSERT INTO categories (id, market_id, name, description, slug, icon_url, parent_id) VALUES
    (gen_random_uuid(), binh_sua_id, 'Bình Sữa Cổ Rộng', 'Bình sữa cổ rộng các loại', 'binh-sua-co-rong', 'https://example.com/icons/binh-sua-co-rong.png', NULL),
    (gen_random_uuid(), binh_sua_id, 'Bình Sữa Cổ Hẹp', 'Bình sữa cổ hẹp các loại', 'binh-sua-co-hep', 'https://example.com/icons/binh-sua-co-hep.png', NULL),
    (gen_random_uuid(), binh_sua_id, 'Phụ Kiện Bình Sữa', 'Phụ kiện cho bình sữa', 'phu-kien-binh-sua', 'https://example.com/icons/phu-kien-binh-sua.png', NULL);

    -- Store category UUIDs for products
    -- Continue with similar pattern for other categories and products...
END $$;

-- Note: The rest of the categories and products would follow the same pattern
-- using gen_random_uuid() for IDs and referencing the parent IDs through variables
-- I can continue with the full implementation if you'd like

-- Insert sample products
INSERT INTO products (id, seller_id, category_id, name, description, price, condition, images, status) VALUES
-- Máy hút sữa products
('p001', 's001', 'c001', 'Máy Hút Sữa Medela Freestyle Flex', 'Máy hút sữa điện đôi không dây, nhỏ gọn, tiện lợi', 8990000, 'new', ARRAY['https://example.com/products/medela-freestyle-flex-1.jpg', 'https://example.com/products/medela-freestyle-flex-2.jpg'], 'active'),
('p002', 's002', 'c001', 'Máy Hút Sữa Spectra S1 Plus', 'Máy hút sữa điện đôi có pin sạc, màn hình LED', 6990000, 'new', ARRAY['https://example.com/products/spectra-s1-1.jpg', 'https://example.com/products/spectra-s1-2.jpg'], 'active'),
('p003', 's003', 'c002', 'Máy Hút Sữa Medela Swing Flex', 'Máy hút sữa điện đơn nhỏ gọn', 4990000, 'new', ARRAY['https://example.com/products/medela-swing-flex-1.jpg'], 'active'),

-- Bình sữa products
('p004', 's001', 'c004', 'Bình Sữa Pigeon Natural PPSU 240ml', 'Bình sữa cổ rộng chất liệu PPSU cao cấp', 290000, 'new', ARRAY['https://example.com/products/pigeon-natural-1.jpg'], 'active'),
('p005', 's002', 'c004', 'Bình Sữa Dr Brown Options+ 270ml', 'Bình sữa chống sặc với hệ thống thông khí', 350000, 'new', ARRAY['https://example.com/products/dr-brown-1.jpg'], 'active'),
('p006', 's003', 'c005', 'Bình Sữa Philips Avent Natural 260ml', 'Bình sữa cổ hẹp với núm ty mềm tự nhiên', 270000, 'new', ARRAY['https://example.com/products/philips-avent-1.jpg'], 'active'),

-- Quần áo products
('p007', 's001', 'c007', 'Set 5 Bodysuit Cotton Organic', 'Bộ bodysuit cotton hữu cơ cho bé sơ sinh', 399000, 'new', ARRAY['https://example.com/products/bodysuit-set-1.jpg'], 'active'),
('p008', 's002', 'c008', 'Bodysuit Dài Tay Hello Baby', 'Bodysuit dài tay cotton mềm mại', 159000, 'new', ARRAY['https://example.com/products/bodysuit-hello-1.jpg'], 'active'),
('p009', 's003', 'c009', 'Đồ Bộ Pijama Cho Bé', 'Bộ đồ ngủ cotton thoáng mát', 199000, 'new', ARRAY['https://example.com/products/pijama-1.jpg'], 'active');

-- Insert more categories for remaining markets
INSERT INTO categories (id, market_id, name, description, slug, icon_url, parent_id) VALUES
-- Tã categories
('c010', 'm004', 'Tã Dán', 'Tã dán các loại', 'ta-dan', 'https://example.com/icons/ta-dan.png', NULL),
('c011', 'm004', 'Tã Quần', 'Tã quần các loại', 'ta-quan', 'https://example.com/icons/ta-quan.png', NULL),

-- Sữa công thức categories
('c012', 'm005', 'Sữa 0-6 Tháng', 'Sữa công thức cho bé 0-6 tháng', 'sua-0-6-thang', 'https://example.com/icons/sua-0-6.png', NULL),
('c013', 'm005', 'Sữa 6-12 Tháng', 'Sữa công thức cho bé 6-12 tháng', 'sua-6-12-thang', 'https://example.com/icons/sua-6-12.png', NULL),

-- Xe đẩy categories
('c014', 'm006', 'Xe Đẩy Cao Cấp', 'Xe đẩy cao cấp các loại', 'xe-day-cao-cap', 'https://example.com/icons/xe-day-cao-cap.png', NULL),
('c015', 'm006', 'Xe Đẩy Du Lịch', 'Xe đẩy du lịch gọn nhẹ', 'xe-day-du-lich', 'https://example.com/icons/xe-day-du-lich.png', NULL);

-- Insert more products
INSERT INTO products (id, seller_id, category_id, name, description, price, condition, images, status) VALUES
-- Tã products
('p010', 's001', 'c010', 'Tã Dán Huggies Platinum Size NB', 'Tã dán cao cấp cho bé sơ sinh', 299000, 'new', ARRAY['https://example.com/products/huggies-platinum-1.jpg'], 'active'),
('p011', 's002', 'c011', 'Tã Quần Merries Size L', 'Tã quần cao cấp size L (9-14kg)', 359000, 'new', ARRAY['https://example.com/products/merries-l-1.jpg'], 'active'),

-- Sữa công thức products
('p012', 's001', 'c012', 'Sữa Enfamil A+ 1 (0-6 tháng)', 'Sữa công thức cao cấp cho bé 0-6 tháng', 489000, 'new', ARRAY['https://example.com/products/enfamil-1.jpg'], 'active'),
('p013', 's002', 'c013', 'Sữa Similac IQ 2 (6-12 tháng)', 'Sữa công thức cho bé 6-12 tháng', 459000, 'new', ARRAY['https://example.com/products/similac-2.jpg'], 'active'),

-- Xe đẩy products
('p014', 's001', 'c014', 'Xe Đẩy Bugaboo Fox 3', 'Xe đẩy cao cấp đa năng', 29900000, 'new', ARRAY['https://example.com/products/bugaboo-fox-1.jpg'], 'active'),
('p015', 's002', 'c015', 'Xe Đẩy Du Lịch Babyzen YOYO2', 'Xe đẩy gọn nhẹ, tiện lợi khi di chuyển', 15900000, 'new', ARRAY['https://example.com/products/babyzen-yoyo-1.jpg'], 'active');

-- Insert remaining categories
INSERT INTO categories (id, market_id, name, description, slug, icon_url, parent_id) VALUES
-- Đồ chơi categories
('c016', 'm007', 'Đồ Chơi Phát Triển', 'Đồ chơi phát triển kỹ năng', 'do-choi-phat-trien', 'https://example.com/icons/do-choi-phat-trien.png', NULL),
('c017', 'm007', 'Đồ Chơi Giáo Dục', 'Đồ chơi giáo dục cho bé', 'do-choi-giao-duc', 'https://example.com/icons/do-choi-giao-duc.png', NULL),

-- Giấc ngủ categories
('c018', 'm008', 'Nôi Cũi', 'Nôi và cũi cho bé', 'noi-cui', 'https://example.com/icons/noi-cui.png', NULL),
('c019', 'm008', 'Chăn Ga Gối', 'Chăn ga gối cho bé', 'chan-ga-goi', 'https://example.com/icons/chan-ga-goi.png', NULL),

-- Mẹ sau sinh categories
('c020', 'm009', 'Đồ Dùng Vệ Sinh', 'Đồ dùng vệ sinh cho mẹ', 'do-dung-ve-sinh', 'https://example.com/icons/do-dung-ve-sinh.png', NULL),
('c021', 'm009', 'Quần Áo Sau Sinh', 'Quần áo cho mẹ sau sinh', 'quan-ao-sau-sinh', 'https://example.com/icons/quan-ao-sau-sinh.png', NULL),

-- Sách categories
('c022', 'm010', 'Sách Cho Mẹ', 'Sách dành cho mẹ', 'sach-cho-me', 'https://example.com/icons/sach-cho-me.png', NULL),
('c023', 'm010', 'Sách Cho Bé', 'Sách dành cho bé', 'sach-cho-be', 'https://example.com/icons/sach-cho-be.png', NULL);

-- Insert remaining products
INSERT INTO products (id, seller_id, category_id, name, description, price, condition, images, status) VALUES
-- Đồ chơi products
('p016', 's001', 'c016', 'Thảm Chơi Fisher-Price', 'Thảm chơi nhiều hoạt động cho bé', 899000, 'new', ARRAY['https://example.com/products/fisher-price-mat-1.jpg'], 'active'),
('p017', 's002', 'c017', 'Bộ Xếp Hình Gỗ Montessori', 'Đồ chơi giáo dục Montessori', 399000, 'new', ARRAY['https://example.com/products/montessori-blocks-1.jpg'], 'active'),

-- Giấc ngủ products
('p018', 's001', 'c018', 'Nôi Điện Tự Động Mastela', 'Nôi điện đa chức năng', 2990000, 'new', ARRAY['https://example.com/products/mastela-cradle-1.jpg'], 'active'),
('p019', 's002', 'c019', 'Set Chăn Ga Gối Organic', 'Bộ chăn ga gối cotton hữu cơ', 899000, 'new', ARRAY['https://example.com/products/bedding-set-1.jpg'], 'active'),

-- Mẹ sau sinh products
('p020', 's001', 'c020', 'Băng Vệ Sinh Sau Sinh', 'Băng vệ sinh dành riêng cho mẹ sau sinh', 199000, 'new', ARRAY['https://example.com/products/maternity-pads-1.jpg'], 'active'),
('p021', 's002', 'c021', 'Váy Cho Con Bú', 'Váy thiết kế tiện lợi cho con bú', 459000, 'new', ARRAY['https://example.com/products/nursing-dress-1.jpg'], 'active'),

-- Sách products
('p022', 's001', 'c022', 'Sách "Chăm Sóc Mẹ và Bé"', 'Cẩm nang chăm sóc toàn diện', 189000, 'new', ARRAY['https://example.com/products/mom-baby-care-book-1.jpg'], 'active'),
('p023', 's002', 'c023', 'Bộ Sách Ehon Nhật Bản', 'Bộ sách Ehon cho bé 0-3 tuổi', 299000, 'new', ARRAY['https://example.com/products/ehon-set-1.jpg'], 'active'); 