const mongoose = require('mongoose');
const { readConn, writeConn } = require('../config/db');

const bookSchema = new mongoose.Schema({
  code:          { type: String, required: true },
  title:         { type: String, required: true },
  author:        { type: String, required: true },
  price:         { type: Number, required: true },
  vatPercent:    { type: Number, required: true },
  priceAfterVat: { type: Number, required: true },
  createdAt:     { type: Date, default: Date.now }
}, { collection: 'books', autoIndex: false, autoCreate: false });

const BookRead  = readConn.model('Book', bookSchema);   // chỉ dùng find
const BookWrite = writeConn.model('Book', bookSchema);  // chỉ dùng create

module.exports = { BookRead, BookWrite };