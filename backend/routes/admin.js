const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { db } = require('../db/database');
const auth = require('../middleware/auth');

const SECRET = process.env.JWT_SECRET || 'taranest_admin_secret_2024';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'taranest', resource_type: 'image' },
      (err, result) => { if (err) reject(err); else resolve(result); }
    );
    stream.end(buffer);
  });
}

// ── AUTH ─────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Thiếu thông tin' });
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password))
    return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET, { expiresIn: '7d' });
  res.json({ token, username: admin.username });
});

router.get('/verify', auth, (req, res) => {
  res.json({ ok: true, username: req.admin.username });
});

// ── UPLOAD ───────────────────────────────────────────────
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Không có file ảnh' });
  try {
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Upload thất bại: ' + err.message });
  }
});

// ── ORDERS ───────────────────────────────────────────────
router.get('/orders', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM orders ORDER BY id DESC').all());
});

router.patch('/orders/:id/status', auth, (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'shipping', 'done', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

router.delete('/orders/:id', auth, (req, res) => {
  db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── CONTACTS ─────────────────────────────────────────────
router.get('/contacts', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM contacts ORDER BY id DESC').all());
});

router.delete('/contacts/:id', auth, (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── PRODUCTS ─────────────────────────────────────────────
router.get('/products', auth, (req, res) => {
  const rows = db.prepare(`
    SELECT p.*, c.name as category_name
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id ASC
  `).all();
  res.json(rows);
});

router.put('/products/:id', auth, (req, res) => {
  const { name, short_desc, description, price, original_price, stock, is_featured, is_bestseller, image } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Thiếu tên hoặc giá' });
  db.prepare(`
    UPDATE products
    SET name=?, short_desc=?, description=?, price=?, original_price=?, stock=?, is_featured=?, is_bestseller=?, image=?
    WHERE id=?
  `).run(name, short_desc || '', description || '', Number(price), Number(original_price) || null,
     Number(stock) || 0, is_featured ? 1 : 0, is_bestseller ? 1 : 0, image || '', req.params.id);
  res.json({ ok: true });
});

// ── CATEGORIES (for product form) ────────────────────────
router.get('/categories', auth, (req, res) => {
  res.json(db.prepare('SELECT id, name FROM categories ORDER BY sort_order ASC').all());
});

// ── PRODUCTS (create) ─────────────────────────────────────
router.post('/products', auth, (req, res) => {
  const { name, category_id, short_desc, description, price, original_price, stock, is_featured, is_bestseller, image } = req.body;
  if (!name || !price || !category_id) return res.status(400).json({ error: 'Thiếu tên, giá hoặc danh mục' });
  const slug = makeSlug(name);
  const r = db.prepare(`
    INSERT INTO products (name, slug, category_id, price, original_price, stock, is_featured, is_bestseller, image, short_desc, description)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
  `).run(name, slug, Number(category_id), Number(price), Number(original_price)||null,
    Number(stock)||0, is_featured?1:0, is_bestseller?1:0, image||'', short_desc||'', description||'');
  res.status(201).json({ id: r.lastInsertRowid, slug });
});

// ── ABOUT CONTENT ─────────────────────────────────────────
router.get('/about', auth, (req, res) => {
  const rows = db.prepare("SELECT key, value FROM site_content WHERE key LIKE 'about_%'").all();
  const result = {};
  rows.forEach(r => { try { result[r.key] = JSON.parse(r.value); } catch { result[r.key] = r.value; } });
  res.json(result);
});

router.put('/about', auth, (req, res) => {
  const upsert = db.prepare('INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)');
  Object.entries(req.body).forEach(([k, v]) => {
    if (k.startsWith('about_')) upsert.run(k, JSON.stringify(v));
  });
  res.json({ ok: true });
});

// ── BLOG ─────────────────────────────────────────────────
router.get('/blog', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM blog_posts ORDER BY id DESC').all());
});

function makeSlug(title) {
  return title.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .trim().replace(/\s+/g, '-')
    .slice(0, 80) + '-' + Date.now().toString().slice(-5);
}

router.post('/blog', auth, (req, res) => {
  const { title, excerpt, content, image, author } = req.body;
  if (!title) return res.status(400).json({ error: 'Thiếu tiêu đề' });
  const slug = makeSlug(title);
  const r = db.prepare('INSERT INTO blog_posts (title, slug, excerpt, content, image, author) VALUES (?,?,?,?,?,?)')
    .run(title, slug, excerpt || '', content || '', image || '', author || 'TARA NEST');
  res.status(201).json({ id: r.lastInsertRowid, slug });
});

router.put('/blog/:id', auth, (req, res) => {
  const { title, excerpt, content, image, author } = req.body;
  if (!title) return res.status(400).json({ error: 'Thiếu tiêu đề' });
  db.prepare('UPDATE blog_posts SET title=?, excerpt=?, content=?, image=?, author=? WHERE id=?')
    .run(title, excerpt || '', content || '', image || '', author || 'TARA NEST', req.params.id);
  res.json({ ok: true });
});

router.delete('/blog/:id', auth, (req, res) => {
  db.prepare('DELETE FROM blog_posts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
