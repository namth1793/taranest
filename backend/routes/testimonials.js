const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM testimonials ORDER BY id DESC').all();
  res.json(rows);
});

module.exports = router;
