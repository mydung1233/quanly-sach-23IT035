const express = require('express');
const router = express.Router();
const { BookRead, BookWrite } = require('../models/book');
const { CODE_PREFIX, VAT_PERCENT } = require('../config/settings');

// ĐỌC -> tài khoản reader
router.get('/', async (req, res) => {
  try {
    const books = await BookRead.find().sort({ createdAt: -1 }).lean();
    req.session.views = (req.session.views || 0) + 1;
    res.render('home', { books, views: req.session.views });
  } catch (err) {
    res.status(500).send('Lỗi đọc dữ liệu: ' + err.message);
  }
});

router.get('/add', (req, res) => {
  res.render('add', { prefix: CODE_PREFIX });
});

// GHI -> tài khoản writer
router.post('/add', async (req, res) => {
  try {
    const code = (req.body.code || '').trim();
    const title = (req.body.title || '').trim();
    const author = (req.body.author || '').trim();
    const price = Number(req.body.price);

    // Bộ lọc: mã phải bắt đầu bằng 3 số cuối MSSV
    if (!code.startsWith(CODE_PREFIX)) {
      return res.status(400).render('add', {
        error: `Mã sản phẩm phải bắt đầu bằng "${CODE_PREFIX}". Hệ thống từ chối xử lý.`,
        prefix: CODE_PREFIX
      });
    }
    if (!title || !author || isNaN(price) || price < 0) {
      return res.status(400).render('add', {
        error: 'Dữ liệu không hợp lệ.', prefix: CODE_PREFIX
      });
    }

    // Tính giá sau thuế TRƯỚC khi lưu
    const priceAfterVat = Math.round(price * (1 + VAT_PERCENT / 100));

    await BookWrite.create({
      code, title, author, price,
      vatPercent: VAT_PERCENT,
      priceAfterVat
    });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Lỗi ghi dữ liệu: ' + err.message);
  }
});

module.exports = router;