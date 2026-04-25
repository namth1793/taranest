const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.get('/', (req, res) => {
  const cats = db.prepare('SELECT * FROM categories ORDER BY sort_order').all();
  res.json(cats);
});

router.get('/:slug', (req, res) => {
  const cat = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
  if (!cat) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
  res.json(cat);
});

module.exports = router;
