const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');
const auth = require('../middleware/auth');

const SECRET = process.env.JWT_SECRET || 'taranest_admin_secret_2024';

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Thiếu thông tin' });
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password))
    return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
  const token = jwt.sign({ id: admin.id, username: admin.username }, SECRET, { expiresIn: '7d' });
  res.json({ token, username: admin.username });
});

// GET /api/admin/verify
router.get('/verify', auth, (req, res) => {
  res.json({ ok: true, username: req.admin.username });
});

// ── ORDERS ──────────────────────────────────────────────
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

// ── CONTACTS ────────────────────────────────────────────
router.get('/contacts', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM contacts ORDER BY id DESC').all());
});

router.delete('/contacts/:id', auth, (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── PRODUCTS ────────────────────────────────────────────
router.get('/products', auth, (req, res) => {
  res.json(db.prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC').all());
});

router.patch('/products/:id', auth, (req, res) => {
  const { name, price, original_price, stock, is_featured, is_bestseller } = req.body;
  db.prepare(`UPDATE products SET name=?, price=?, original_price=?, stock=?, is_featured=?, is_bestseller=? WHERE id=?`)
    .run(name, price, original_price, stock, is_featured ? 1 : 0, is_bestseller ? 1 : 0, req.params.id);
  res.json({ ok: true });
});

// ── BLOG ────────────────────────────────────────────────
router.get('/blog', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM blog_posts ORDER BY id DESC').all());
});

module.exports = router;
