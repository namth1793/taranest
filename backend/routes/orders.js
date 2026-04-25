const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

router.post('/', (req, res) => {
  const { customer_name, customer_phone, customer_email, address, note, items, subtotal, shipping_fee, total, payment_method } = req.body;
  if (!customer_name || !customer_phone || !address || !items) {
    return res.status(400).json({ error: 'Thiếu thông tin đơn hàng' });
  }
  const order_code = 'TN' + Date.now().toString().slice(-8);
  const result = db.prepare(`INSERT INTO orders
    (order_code, customer_name, customer_phone, customer_email, address, note, items, subtotal, shipping_fee, total, payment_method)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)`).run(order_code, customer_name, customer_phone, customer_email, address, note,
    JSON.stringify(items), subtotal, shipping_fee || 30000, total, payment_method || 'cod');
  res.status(201).json({ id: result.lastInsertRowid, order_code, message: 'Đặt hàng thành công!' });
});

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM orders ORDER BY id DESC').all());
});

module.exports = router;
