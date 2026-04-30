require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { initDB } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5017;

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : true; // allow all in dev

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

initDB();

app.use('/api/categories', require('./routes/categories'));
app.use('/api/products', require('./routes/products'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/about-content', (req, res) => {
  const { db } = require('./db/database');
  const rows = db.prepare("SELECT key, value FROM site_content WHERE key LIKE 'about_%'").all();
  const result = {};
  rows.forEach(r => { try { result[r.key] = JSON.parse(r.value); } catch { result[r.key] = r.value; } });
  res.json(result);
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'TARA NEST API' }));

app.listen(PORT, () => {
  console.log(`TARA NEST Backend running on port ${PORT}`);
});
