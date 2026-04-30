const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = process.env.NODE_ENV === 'production'
  ? '/app/data'
  : path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'taranest.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category_id INTEGER NOT NULL,
      price INTEGER NOT NULL,
      original_price INTEGER,
      image TEXT,
      images TEXT DEFAULT '[]',
      description TEXT,
      short_desc TEXT,
      unit TEXT DEFAULT 'hộp',
      stock INTEGER DEFAULT 100,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      tags TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT,
      image TEXT,
      author TEXT DEFAULT 'TARA NEST',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      location TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      message TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      address TEXT NOT NULL,
      note TEXT,
      items TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      shipping_fee INTEGER DEFAULT 30000,
      total INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT DEFAULT 'cod',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (count.c === 0) {
    require('./seed')(db);
  }

  const contentCount = db.prepare('SELECT COUNT(*) as c FROM site_content').get();
  if (contentCount.c === 0) {
    const defaults = {
      about_story: {
        heading: 'Từ Đam Mê Đến Sứ Mệnh',
        para1: 'TARA NEST được thành lập năm 2019 bởi một nhóm những người yêu sức khỏe và trân trọng các giá trị tự nhiên. Xuất phát từ câu chuyện cá nhân của người sáng lập – khi chứng kiến sức khỏe của cha mẹ được cải thiện rõ rệt nhờ yến sào – chúng tôi quyết tâm xây dựng một thương hiệu yến sào đáng tin cậy, minh bạch và chất lượng.',
        para2: 'Chúng tôi tin rằng thiên nhiên có đủ những gì cơ thể cần. Sứ mệnh của TARA NEST là kết nối nguồn dưỡng chất quý giá từ tổ yến tự nhiên đến tay từng gia đình Việt, với quy trình kiểm soát chất lượng nghiêm ngặt và giá cả minh bạch.',
        para3: 'Hơn 5 năm xây dựng và phát triển, TARA NEST tự hào đã phục vụ hơn 10.000 khách hàng trên toàn quốc với tỷ lệ hài lòng 4.9/5 sao.',
      },
      about_stats: [
        { num: '10.000+', label: 'Khách hàng tin dùng' },
        { num: '5+', label: 'Năm kinh nghiệm' },
        { num: '20+', label: 'Sản phẩm đa dạng' },
        { num: '4.9/5', label: 'Đánh giá trung bình' },
      ],
      about_team: [
        { name: 'Nguyễn Thành Đạt', role: 'Nhà Sáng Lập & CEO', img: 'https://i.pravatar.cc/200?img=68', desc: 'Hơn 10 năm kinh nghiệm trong ngành thực phẩm cao cấp và yến sào. Tốt nghiệp Đại học Kinh tế TP.HCM.' },
        { name: 'Trần Thị Minh Anh', role: 'Giám Đốc Chất Lượng', img: 'https://i.pravatar.cc/200?img=47', desc: 'Chuyên gia dinh dưỡng với 8 năm nghiên cứu về yến sào và thực phẩm chức năng. Thạc sĩ Công nghệ Thực phẩm.' },
        { name: 'Lê Văn Phúc', role: 'Quản Lý Khai Thác', img: 'https://i.pravatar.cc/200?img=12', desc: 'Người con của Khánh Hòa với 15 năm kinh nghiệm khai thác và sơ chế yến sào từ các đảo tự nhiên.' },
      ],
      about_milestones: [
        { year: '2019', event: 'TARA NEST ra đời tại Hà Nội với cửa hàng đầu tiên' },
        { year: '2020', event: 'Mở rộng sang TP.HCM, đạt 1.000 khách hàng thân thiết' },
        { year: '2021', event: 'Ra mắt dòng sản phẩm yến chưng tươi và website bán hàng online' },
        { year: '2022', event: 'Đạt chứng nhận VSATTP, hợp tác với 5 trang trại yến lớn tại Khánh Hòa' },
        { year: '2023', event: 'Đạt mốc 5.000 đơn/tháng, ra mắt dòng sản phẩm Baby và Set Quà Tặng' },
        { year: '2024', event: 'Mở rộng toàn quốc, 10.000+ khách hàng tin dùng trên cả nước' },
      ],
    };
    const ins = db.prepare('INSERT OR IGNORE INTO site_content (key, value) VALUES (?, ?)');
    Object.entries(defaults).forEach(([k, v]) => ins.run(k, JSON.stringify(v)));
  }

  const adminCount = db.prepare('SELECT COUNT(*) as c FROM admins').get();
  if (adminCount.c === 0) {
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO admins (username, password) VALUES (?,?)').run('admin', hash);
  }
}

module.exports = { db, initDB };
