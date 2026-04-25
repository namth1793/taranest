const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.post('/', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Vui lòng nhập họ tên và số điện thoại' });
  const result = db.prepare('INSERT INTO contacts (name, email, phone, message) VALUES (?,?,?,?)').run(name, email, phone, message);
  res.status(201).json({ id: result.lastInsertRowid, message: 'Gửi thành công! Chúng tôi sẽ liên hệ bạn sớm.' });
});

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM contacts ORDER BY id DESC').all());
});

module.exports = router;
