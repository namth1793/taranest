module.exports = function seed(db) {
  console.log('🌱 Seeding TARA NEST database...');

  // Categories
  const cats = db.prepare(`INSERT INTO categories (name, slug, description, image, sort_order) VALUES (?,?,?,?,?)`);
  cats.run('Yến Chưng Tươi', 'yen-chung-tuoi', 'Yến chưng tươi mỗi ngày, giữ trọn dưỡng chất từ thiên nhiên', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80', 1);
  cats.run('Yến Chưng Sẵn', 'yen-chung-san', 'Yến đã chưng sẵn đóng lọ tiện lợi, dùng ngay không cần nấu', 'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=600&q=80', 2);
  cats.run('Yến Khô', 'yen-kho', 'Tổ yến thô và tinh chế nguyên chất, hàng tuyển chọn từ Khánh Hòa', 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80', 3);
  cats.run('Set Quà Tặng', 'set-qua-tang', 'Hộp quà yến sào cao cấp, lý tưởng cho mọi dịp lễ tết', 'https://images.unsplash.com/photo-1607344645866-009c320b5d5a?w=600&q=80', 4);
  cats.run('Sản Phẩm Khác', 'san-pham-khac', 'Saffron, đông trùng hạ thảo và các sản phẩm bổ dưỡng khác', 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80', 5);

  // Products
  const prod = db.prepare(`INSERT INTO products
    (name, slug, category_id, price, original_price, image, images, description, short_desc, unit, stock, rating, reviews_count, is_featured, is_bestseller, tags)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

  // Yến Chưng Tươi (cat 1)
  prod.run('Yến Chưng Tươi Đường Phèn', 'yen-chung-tuoi-duong-phen', 1, 65000, 75000,
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80','https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800&q=80']),
    'Yến chưng tươi với đường phèn nguyên chất, không chất bảo quản. Được chưng cách thủy theo phương pháp truyền thống, giữ nguyên dưỡng chất protein, axit amin và khoáng chất. Thích hợp cho mọi lứa tuổi, bổ dưỡng hàng ngày.',
    'Yến tươi chưng đường phèn, bổ dưỡng tự nhiên', 'hộp', 200, 4.9, 142, 1, 1,
    JSON.stringify(['bán chạy', 'yến chưng', 'đường phèn']));

  prod.run('Yến Chưng Tươi Saffron', 'yen-chung-tuoi-saffron', 1, 79000, 95000,
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80']),
    'Sự kết hợp hoàn hảo giữa yến sào cao cấp và nhụy hoa nghệ tây (saffron) nhập khẩu Iran. Saffron chứa crocin giúp làm đẹp da, chống oxy hóa, tăng cường miễn dịch. Hương vị thơm ngon, màu sắc đẹp mắt.',
    'Yến tươi kết hợp nhụy hoa nghệ tây cao cấp Iran', 'hộp', 150, 4.9, 98, 1, 1,
    JSON.stringify(['saffron', 'yến chưng', 'cao cấp']));

  prod.run('Yến Chưng Tươi Hạt Sen', 'yen-chung-tuoi-hat-sen', 1, 72000, 82000,
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80']),
    'Yến sào kết hợp hạt sen tươi Việt Nam, giúp an thần, dưỡng tâm, cải thiện giấc ngủ. Hạt sen được chọn lọc kỹ càng, bùi ngậy kết hợp với yến sào mềm mại tạo nên món ăn vừa ngon vừa bổ.',
    'Yến tươi với hạt sen an thần dưỡng tâm', 'hộp', 180, 4.8, 76, 1, 0,
    JSON.stringify(['hạt sen', 'yến chưng', 'an thần']));

  prod.run('Yến Chưng Tươi Táo Đỏ', 'yen-chung-tuoi-tao-do', 1, 72000, 82000,
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80']),
    'Yến sào chưng cùng táo đỏ (hồng táo) Trung Hoa – vị thuốc bổ huyết, dưỡng da nổi tiếng. Táo đỏ kết hợp yến sào tạo nên thức uống bổ dưỡng đặc biệt cho phụ nữ muốn làm đẹp từ bên trong.',
    'Yến tươi táo đỏ bổ huyết dưỡng da', 'hộp', 160, 4.8, 65, 0, 0,
    JSON.stringify(['táo đỏ', 'yến chưng', 'bổ huyết']));

  prod.run('Yến Chưng Tươi Đông Trùng Hạ Thảo', 'yen-chung-tuoi-dong-trung', 1, 89000, 105000,
    'https://images.unsplash.com/photo-1571942676516-bcab84649e44?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1571942676516-bcab84649e44?w=800&q=80']),
    'Tổ hợp "Tứ đại bổ dược" gồm yến sào + đông trùng hạ thảo. Đông trùng hạ thảo giúp tăng cường sinh lực, cải thiện sức đề kháng, hỗ trợ thận và phổi. Sản phẩm cao cấp, lý tưởng cho người cần hồi phục sức khỏe.',
    'Siêu phẩm yến + đông trùng hạ thảo tăng sinh lực', 'hộp', 120, 5.0, 54, 1, 0,
    JSON.stringify(['đông trùng', 'yến chưng', 'tăng lực']));

  prod.run('Yến Chưng Tươi Nhãn Nhục', 'yen-chung-tuoi-nhan', 1, 68000, 78000,
    'https://images.unsplash.com/photo-1564894809611-1742fc40ed80?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1564894809611-1742fc40ed80?w=800&q=80']),
    'Yến sào chưng với nhãn nhục (long nhãn) – vị thuốc bổ tâm tỳ, an thần dưỡng huyết trong Đông y. Nhãn nhục ngọt thanh, mềm dẻo hòa quyện cùng yến sào tạo vị ngọt tự nhiên dễ chịu.',
    'Yến tươi nhãn nhục bổ tâm an thần', 'hộp', 140, 4.8, 48, 0, 0,
    JSON.stringify(['nhãn nhục', 'yến chưng']));

  prod.run('Yến Chưng Tươi Baby (Cho Bé)', 'yen-chung-tuoi-baby', 1, 55000, 65000,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80']),
    'Dòng yến chưng đặc biệt dành cho trẻ em từ 18 tháng tuổi trở lên. Được chưng với lượng đường thấp, không phụ gia, dễ tiêu hóa. Giúp bé phát triển trí não, tăng đề kháng và ăn ngon miệng hơn.',
    'Yến tươi dành riêng cho bé từ 18 tháng', 'hộp', 200, 4.9, 87, 1, 1,
    JSON.stringify(['baby', 'yến chưng', 'cho bé']));

  // Yến Chưng Sẵn (cat 2)
  prod.run('Yến Chưng Sẵn Đường Phèn (Lọ 150ml)', 'yen-chung-san-duong-phen-lo', 2, 125000, 145000,
    'https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=800&q=80']),
    'Yến chưng đóng lọ thủy tinh cao cấp, tiệt trùng theo công nghệ hiện đại, hạn sử dụng 12 tháng. Mở ra là dùng ngay, tiện lợi khi đi công tác hoặc làm quà. Giữ nguyên dưỡng chất và hương vị như mới chưng.',
    'Yến đóng lọ tiện lợi, dùng ngay không cần nấu', 'lọ', 150, 4.8, 63, 1, 1,
    JSON.stringify(['đóng lọ', 'tiện lợi', 'đường phèn']));

  prod.run('Yến Chưng Sẵn Saffron (Lọ 150ml)', 'yen-chung-san-saffron-lo', 2, 148000, 168000,
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80']),
    'Yến chưng saffron đóng lọ tiệt trùng. Nhụy hoa nghệ tây hòa quyện cùng yến sào tạo màu vàng óng đẹp mắt, hương thơm đặc trưng. Sản phẩm cao cấp được khách hàng yêu thích nhất.',
    'Yến saffron đóng lọ cao cấp, hương vị tuyệt hảo', 'lọ', 100, 4.9, 41, 1, 0,
    JSON.stringify(['saffron', 'đóng lọ', 'cao cấp']));

  prod.run('Yến Chưng Sẵn Táo Đỏ (Lọ 150ml)', 'yen-chung-san-tao-do-lo', 2, 136000, 155000,
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80']),
    'Yến chưng táo đỏ đóng lọ thủy tinh, tiệt trùng an toàn. Kết hợp hồng táo bổ huyết cùng yến sào tạo nên thức uống tuyệt vời cho phụ nữ bổ sung dinh dưỡng mỗi ngày.',
    'Yến táo đỏ bổ huyết đóng lọ tiện lợi', 'lọ', 120, 4.8, 36, 0, 0,
    JSON.stringify(['táo đỏ', 'đóng lọ', 'bổ huyết']));

  // Yến Khô (cat 3)
  prod.run('Yến Thô Khánh Hòa (100g)', 'yen-tho-khanh-hoa-100g', 3, 850000, 1000000,
    'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80']),
    'Tổ yến thô khai thác trực tiếp từ đảo Khánh Hòa – vùng yến sào nổi tiếng nhất Việt Nam. Yến thô còn lông tơ, hình dạng tự nhiên, màu trắng ngà đến vàng nhạt. Khách hàng tự sơ chế theo nhu cầu.',
    'Yến thô đảo Khánh Hòa nguyên chất, khai thác tự nhiên', 'hộp', 50, 4.9, 29, 0, 0,
    JSON.stringify(['yến thô', 'Khánh Hòa', 'nguyên chất']));

  prod.run('Yến Tinh Chế Loại 1 (100g)', 'yen-tinh-che-loai-1-100g', 3, 1250000, 1450000,
    'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80']),
    'Tổ yến đã qua tinh chế loại 1 – nhặt lông kỹ càng, hình dạng tổ nguyên vẹn, màu trắng sáng. Được kiểm định chất lượng nghiêm ngặt, đạt tiêu chuẩn xuất khẩu. Thích hợp nấu súp, chưng đường phèn, làm quà biếu cao cấp.',
    'Tổ yến tinh chế nguyên tổ, sạch đẹp loại thượng hạng', 'hộp', 30, 5.0, 18, 1, 0,
    JSON.stringify(['tinh chế', 'loại 1', 'xuất khẩu']));

  prod.run('Yến Vụn - Yến Sợi (100g)', 'yen-vun-yen-soi-100g', 3, 480000, 560000,
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80']),
    'Yến vụn (yến sợi) từ tổ yến chính hãng, giữ đầy đủ dưỡng chất như yến nguyên tổ. Dễ sử dụng, nhanh ngâm nở, phù hợp để chưng, nấu cháo, làm kem hoặc bánh. Tiết kiệm chi phí hơn yến nguyên tổ.',
    'Yến vụn chính hãng, dưỡng chất nguyên vẹn, tiết kiệm', 'hộp', 80, 4.7, 45, 0, 0,
    JSON.stringify(['yến vụn', 'tiết kiệm']));

  // Set Quà Tặng (cat 4)
  prod.run('Set Quà Tặng Hảo Hạng (6 Lọ)', 'set-qua-tang-hao-hang-6-lo', 4, 780000, 900000,
    'https://images.unsplash.com/photo-1607344645866-009c320b5d5a?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1607344645866-009c320b5d5a?w=800&q=80']),
    'Hộp quà sang trọng gồm 6 lọ yến chưng sẵn (3 đường phèn + 2 saffron + 1 táo đỏ). Hộp thiếc cao cấp, in logo TARA NEST, kèm ruy băng và thiệp chúc mừng. Thích hợp biếu tặng dịp lễ Tết, sinh nhật, khai trương.',
    'Hộp quà 6 lọ sang trọng cho mọi dịp', 'hộp', 60, 4.9, 34, 1, 1,
    JSON.stringify(['quà tặng', '6 lọ', 'sang trọng']));

  prod.run('Set Quà Tặng Cao Cấp (12 Lọ)', 'set-qua-tang-cao-cap-12-lo', 4, 1480000, 1700000,
    'https://images.unsplash.com/photo-1607344645866-009c320b5d5a?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1607344645866-009c320b5d5a?w=800&q=80']),
    'Hộp quà cực kỳ sang trọng với 12 lọ yến chưng sẵn đa dạng vị, hộp gỗ tự nhiên lót nhung đỏ. Phù hợp biếu đối tác kinh doanh, sếp, người thân cao tuổi. Đi kèm túi xách cao cấp và thiệp.',
    'Bộ quà 12 lọ hộp gỗ sang trọng đẳng cấp', 'hộp', 30, 5.0, 22, 1, 0,
    JSON.stringify(['quà tặng', '12 lọ', 'hộp gỗ', 'VIP']));

  prod.run('Set Quà Mừng Thọ (8 Lọ)', 'set-qua-mung-tho-8-lo', 4, 980000, 1150000,
    'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=800&q=80']),
    'Bộ quà mừng thọ đặc biệt gồm 8 lọ yến chưng sẵn đa vị kết hợp với gói đông trùng hạ thảo. Hộp đỏ truyền thống mang ý nghĩa trường thọ, an khang. Lý tưởng tặng ông bà, cha mẹ dịp sinh nhật, mừng thọ.',
    'Bộ quà mừng thọ ý nghĩa cho người cao tuổi', 'hộp', 40, 4.9, 19, 1, 0,
    JSON.stringify(['mừng thọ', 'quà tặng', 'người cao tuổi']));

  prod.run('Set Quà Tặng Mini (3 Lọ)', 'set-qua-tang-mini-3-lo', 4, 380000, 420000,
    'https://images.unsplash.com/photo-1607344645866-009c320b5d5a?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1607344645866-009c320b5d5a?w=800&q=80']),
    'Set quà mini gồm 3 lọ yến chưng sẵn (đường phèn, saffron, táo đỏ). Hộp thiếc nhỏ gọn xinh xắn, phù hợp làm quà tặng ngày 8/3, Valentine, hoặc cảm ơn khách hàng với ngân sách vừa phải.',
    'Set quà mini 3 lọ dễ thương, giá hợp lý', 'hộp', 80, 4.8, 27, 0, 0,
    JSON.stringify(['mini', 'quà tặng', '3 lọ']));

  // Sản Phẩm Khác (cat 5)
  prod.run('Saffron Iran Chính Hãng (1g)', 'saffron-iran-chinh-hang-1g', 5, 185000, 220000,
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80']),
    'Nhụy hoa nghệ tây (saffron) nhập khẩu trực tiếp từ Iran – vùng sản xuất saffron lớn nhất thế giới. Sợi dài đỏ thẫm, hàm lượng crocin cao, kiểm định COA. Chống oxy hóa, làm đẹp da, cải thiện tâm trạng.',
    'Saffron Iran chính hãng, sợi dài đỏ thẫm cao cấp', 'hộp', 100, 4.9, 56, 1, 1,
    JSON.stringify(['saffron', 'Iran', 'chống oxy hóa']));

  prod.run('Saffron Iran Premium (3g)', 'saffron-iran-premium-3g', 5, 520000, 620000,
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&q=80']),
    'Hộp saffron Iran 3g – tiết kiệm hơn khi mua số lượng lớn. Hộp thiếc bảo quản sang trọng, bảo toàn hương thơm và màu sắc đặc trưng. Dùng pha trà, nấu ăn, ngâm nước uống hoặc pha với yến sào.',
    'Saffron Iran 3g hộp thiếc sang trọng tiết kiệm', 'hộp', 60, 4.9, 31, 0, 0,
    JSON.stringify(['saffron', 'Iran', '3g']));

  prod.run('Đông Trùng Hạ Thảo Khô (50g)', 'dong-trung-ha-thao-kho-50g', 5, 290000, 350000,
    'https://images.unsplash.com/photo-1571942676516-bcab84649e44?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1571942676516-bcab84649e44?w=800&q=80']),
    'Đông trùng hạ thảo khô tự nhiên, nguồn gốc rõ ràng. Chứa Cordycepin và Adenosine giúp tăng cường sinh lực, cải thiện chức năng thận và phổi, hỗ trợ miễn dịch. Ngâm rượu, hầm gà hoặc nấu cháo đều tốt.',
    'Đông trùng hạ thảo tự nhiên, tăng cường sinh lực', 'hộp', 70, 4.8, 24, 0, 0,
    JSON.stringify(['đông trùng', 'sinh lực', 'thận phổi']));

  // Blog posts
  const blog = db.prepare(`INSERT INTO blog_posts (title, slug, excerpt, content, image, author) VALUES (?,?,?,?,?,?)`);

  blog.run(
    'Tác Dụng Của Yến Sào Đối Với Sức Khỏe Con Người',
    'tac-dung-cua-yen-sao-doi-voi-suc-khoe',
    'Yến sào từ lâu đã được mệnh danh là "vàng trắng" của thiên nhiên, với vô số lợi ích sức khỏe đã được khoa học chứng minh...',
    `<h2>Yến Sào - Báu Vật Từ Thiên Nhiên</h2>
<p>Yến sào (tổ chim yến) từ lâu đã được mệnh danh là "vàng trắng" của thiên nhiên. Trong y học cổ truyền phương Đông, yến sào được sử dụng hàng nghìn năm như một thực phẩm bổ dưỡng cao cấp, đặc biệt phổ biến tại Trung Quốc, Việt Nam và các nước Đông Nam Á.</p>

<h2>Thành Phần Dinh Dưỡng</h2>
<p>Yến sào chứa hàm lượng cao protein (lên đến 50%), nhiều axit amin thiết yếu, glycoprotein, khoáng chất (canxi, sắt, kali, phốt pho) và vitamin nhóm B. Đặc biệt, glycoprotein trong yến sào có khả năng kích thích tăng trưởng tế bào, giúp phục hồi và tái tạo tổ chức cơ thể.</p>

<h2>Lợi Ích Đối Với Sức Khỏe</h2>
<ul>
<li><strong>Tăng cường hệ miễn dịch:</strong> Các polysaccharide trong yến sào giúp kích hoạt tế bào miễn dịch, tăng khả năng chống bệnh tật của cơ thể.</li>
<li><strong>Cải thiện tiêu hóa:</strong> Yến sào hỗ trợ tiêu hóa, giảm viêm loét dạ dày và cải thiện hấp thu dinh dưỡng.</li>
<li><strong>Làm đẹp da:</strong> Glycoprotein kích thích sản sinh collagen, giúp da mềm mịn, giảm nếp nhăn và làm chậm quá trình lão hóa.</li>
<li><strong>Bổ não, tăng trí nhớ:</strong> Đặc biệt tốt cho trẻ em đang phát triển và người cao tuổi cần cải thiện trí nhớ.</li>
<li><strong>Phục hồi sức khỏe:</strong> Lý tưởng cho người ốm dậy, phụ nữ sau sinh, người cao tuổi cần bồi bổ cơ thể.</li>
</ul>

<h2>Cách Dùng Hiệu Quả</h2>
<p>Để đạt hiệu quả tốt nhất, nên dùng yến sào vào buổi sáng khi đói, hoặc tối trước khi ngủ. Mỗi ngày 1 lọ yến chưng (khoảng 30-50ml). Nên dùng liên tục ít nhất 1 tháng để thấy rõ hiệu quả.</p>`,
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    'TARA NEST'
  );

  blog.run(
    'Cách Phân Biệt Yến Sào Thật Và Yến Giả Trên Thị Trường',
    'cach-phan-biet-yen-sao-that-va-yen-gia',
    'Với giá trị cao trên thị trường, yến sào thường bị làm giả bằng nhiều nguyên liệu khác nhau. Bài viết này hướng dẫn bạn cách nhận biết yến thật...',
    `<h2>Tình Trạng Yến Giả Trên Thị Trường</h2>
<p>Với giá trị kinh tế cao, yến sào đang bị làm giả tràn lan trên thị trường. Yến giả thường được làm từ rong biển, thạch agar, nước đường pha màu hoặc các nguyên liệu rẻ tiền khác. Việc phân biệt yến thật - giả không dễ với người tiêu dùng thông thường.</p>

<h2>Dấu Hiệu Nhận Biết Yến Thật</h2>
<h3>1. Kiểm tra bằng mắt</h3>
<p>Yến thật có màu trắng ngà đến vàng nhạt tự nhiên, hình dạng tổ cuộn, sợi yến mảnh và rõ nét. Bề mặt hơi bóng nhẹ, không quá trắng bất thường (dấu hiệu tẩy trắng bằng hóa chất).</p>

<h3>2. Kiểm tra khi ngâm nước</h3>
<p>Yến thật khi ngâm nước lạnh sẽ nở ra từ từ, sợi yến dài và dai, không tan rã. Yến giả thường tan nhanh hoặc không nở đều.</p>

<h3>3. Kiểm tra khi nấu</h3>
<p>Yến thật khi chưng có mùi thơm đặc trưng nhẹ nhàng, nước chưng trong, không có mùi lạ. Yến giả thường có mùi tanh hoặc mùi hóa chất.</p>

<h3>4. Kiểm tra vị</h3>
<p>Yến thật có vị ngọt thanh tự nhiên, sợi yến dai nhẹ khi nhai. Yến giả thường nhạt nhẽo hoặc có vị lạ.</p>

<h2>Cách Mua Yến An Toàn</h2>
<p>Chỉ mua tại các cửa hàng uy tín có giấy chứng nhận vệ sinh an toàn thực phẩm. Yêu cầu xem giấy tờ xuất xứ sản phẩm. Tránh mua yến quá rẻ so với thị trường vì yến thật chưa bao giờ rẻ.</p>`,
    'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    'TARA NEST'
  );

  blog.run(
    'Thời Điểm Tốt Nhất Để Ăn Yến Sào Và Những Lưu Ý Quan Trọng',
    'thoi-diem-tot-nhat-an-yen-sao',
    'Nhiều người dùng yến sào nhưng chưa biết thời điểm ăn nào sẽ mang lại hiệu quả tốt nhất. Hãy cùng TARA NEST tìm hiểu...',
    `<h2>Ăn Yến Sào Lúc Nào Tốt Nhất?</h2>
<p>Câu hỏi này được rất nhiều khách hàng hỏi chúng tôi. Thực tế, thời điểm ăn yến sào có ảnh hưởng đáng kể đến khả năng hấp thu dinh dưỡng của cơ thể.</p>

<h2>Buổi Sáng - Thời Điểm Vàng</h2>
<p>Ăn yến sào vào buổi sáng khi bụng còn rỗng (khoảng 7-8 giờ) được xem là thời điểm tốt nhất. Lúc này hệ tiêu hóa đã nghỉ ngơi qua đêm, sẵn sàng hấp thu dinh dưỡng tối đa. Các protein và axit amin trong yến sẽ được hấp thu nhanh và hiệu quả hơn.</p>

<h2>Buổi Tối Trước Khi Ngủ</h2>
<p>Đây là lựa chọn tốt thứ hai. Ăn yến trước khi ngủ 1-2 tiếng giúp cơ thể có thời gian hấp thu dưỡng chất trong khi ngủ - giai đoạn cơ thể tăng trưởng và phục hồi mạnh nhất.</p>

<h2>Những Lưu Ý Quan Trọng</h2>
<ul>
<li>Không ăn cùng thức ăn nhiều dầu mỡ vì sẽ cản trở hấp thu protein yến</li>
<li>Người bị cảm cúm, sốt không nên ăn yến vì sẽ làm triệu chứng nặng hơn</li>
<li>Trẻ em dưới 18 tháng không nên dùng yến sào</li>
<li>Phụ nữ mang thai tháng đầu nên hỏi bác sĩ trước khi dùng</li>
<li>Mỗi ngày chỉ cần 1 lọ yến (30-50ml), không nên ăn quá nhiều</li>
</ul>

<h2>Thực Đơn Kết Hợp Hiệu Quả</h2>
<p>Yến sào kết hợp tốt với: saffron (tăng chống oxy hóa), hạt sen (an thần), táo đỏ (bổ huyết), đông trùng (tăng sinh lực). Tránh kết hợp với thực phẩm chứa nhiều axit (nước chanh, giấm) vì có thể làm biến tính protein yến.</p>`,
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    'TARA NEST'
  );

  blog.run(
    'Yến Sào Cho Bà Bầu - Lợi Ích Và Những Điều Cần Biết',
    'yen-sao-cho-ba-bau',
    'Yến sào có tốt cho bà bầu không? Ăn yến sào khi mang thai tháng mấy là an toàn? TARA NEST giải đáp chi tiết cho các mẹ...',
    `<h2>Yến Sào Có Tốt Cho Bà Bầu Không?</h2>
<p>Đây là câu hỏi được rất nhiều mẹ bầu quan tâm. Câu trả lời là CÓ - yến sào rất tốt cho phụ nữ mang thai, nhưng cần lưu ý thời điểm và liều lượng phù hợp.</p>

<h2>Lợi Ích Của Yến Sào Với Mẹ Bầu</h2>
<p>Protein và axit amin trong yến sào hỗ trợ sự phát triển của thai nhi, đặc biệt là hệ thần kinh và não bộ. Các khoáng chất giúp bổ sung canxi, sắt cho mẹ. Glycoprotein giúp mẹ duy trì làn da đẹp trong thai kỳ.</p>

<h2>Nên Ăn Yến Từ Tháng Thứ Mấy?</h2>
<p>Các chuyên gia dinh dưỡng khuyên nên bắt đầu ăn yến từ tháng thứ 4 của thai kỳ trở đi, khi thai nhi đã ổn định. Tránh dùng trong 3 tháng đầu do cơ thể chưa ổn định.</p>`,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'TARA NEST'
  );

  // Testimonials
  const test = db.prepare(`INSERT INTO testimonials (name, avatar, content, rating, location) VALUES (?,?,?,?,?)`);
  test.run('Chị Nguyễn Thị Lan', 'https://i.pravatar.cc/150?img=47', 'Mình dùng yến TARA NEST được 3 tháng rồi, da mình sáng lên thấy rõ và ngủ ngon hơn nhiều. Yến chưng tươi saffron là yêu thích nhất của mình, vừa thơm vừa ngon. Sẽ tiếp tục mua dài dài!', 5, 'TP. Hồ Chí Minh');
  test.run('Anh Trần Minh Khoa', 'https://i.pravatar.cc/150?img=12', 'Mua set quà tặng cho ba tôi nhân dịp sinh nhật 70 tuổi. Hộp quà rất sang trọng, ba tôi rất thích. Dịch vụ giao hàng nhanh, đóng gói cẩn thận. Chắc chắn sẽ quay lại mua cho dịp tết!', 5, 'Hà Nội');
  test.run('Chị Phạm Hoàng Yến', 'https://i.pravatar.cc/150?img=32', 'Sau khi sinh, mình được người thân giới thiệu TARA NEST để bồi bổ. Uống yến chưng tươi đều đặn mỗi sáng, cơ thể phục hồi nhanh hơn, sữa cũng nhiều hơn. Bé trai 6 tháng cũng dùng yến baby, ăn ngon ngủ được. Cảm ơn TARA NEST!', 5, 'Đà Nẵng');
  test.run('Chị Lê Thu Hường', 'https://i.pravatar.cc/150?img=25', 'Lần đầu mua thử yến thô Khánh Hòa về tự chưng. Chất lượng rất tốt, yến to đẹp, sợi dài không bị vụn. Giá cả hợp lý so với chất lượng. Shop tư vấn nhiệt tình, hướng dẫn cách ngâm và chưng rất chi tiết.', 5, 'Cần Thơ');
  test.run('Bà Vũ Thị Minh', 'https://i.pravatar.cc/150?img=45', 'Tôi 65 tuổi, dùng yến TARA NEST theo lời khuyên của con. Sau 2 tháng, tôi thấy người khỏe hơn, ngủ ngon, ăn được. Bác sĩ cũng nói chỉ số sức khỏe của tôi cải thiện. Tôi đặc biệt thích yến chưng đông trùng, bổ lắm!', 5, 'Hải Phòng');
  test.run('Anh Nguyễn Văn Bình', 'https://i.pravatar.cc/150?img=8', 'Làm việc văn phòng căng thẳng, mua saffron và yến về kết hợp uống buổi sáng. Thấy tinh thần tỉnh táo hơn, bớt mệt mỏi. Chất lượng saffron rất tốt, đỏ đẹp, thơm. Đáng đồng tiền bát gạo!', 4, 'Hà Nội');

  console.log('✅ Seeding hoàn tất!');
};
