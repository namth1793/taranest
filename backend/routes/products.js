const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.get('/', (req, res) => {
  const { category, featured, bestseller, search, limit, offset } = req.query;
  let sql = `SELECT p.*, c.name as category_name, c.slug as category_slug
             FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1`;
  const params = [];

  if (category) { sql += ' AND c.slug = ?'; params.push(category); }
  if (featured === '1') { sql += ' AND p.is_featured = 1'; }
  if (bestseller === '1') { sql += ' AND p.is_bestseller = 1'; }
  if (search) { sql += ' AND p.name LIKE ?'; params.push(`%${search}%`); }

  sql += ' ORDER BY p.is_featured DESC, p.id DESC';
  if (limit) { sql += ' LIMIT ?'; params.push(parseInt(limit)); }
  if (offset) { sql += ' OFFSET ?'; params.push(parseInt(offset)); }

  const products = db.prepare(sql).all(...params);
  res.json(products);
});

router.get('/:slug', (req, res) => {
  const product = db.prepare(`SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p JOIN categories c ON p.category_id = c.id WHERE p.slug = ?`).get(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });

  const related = db.prepare(`SELECT * FROM products WHERE category_id = ? AND id != ? LIMIT 4`)
    .all(product.category_id, product.id);

  res.json({ ...product, related });
});

module.exports = router;
