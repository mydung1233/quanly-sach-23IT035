// Stateless session: luu tap trung tren MongoDB Atlas
require('dotenv').config();   // phải ở dòng đầu, trước khi require config/db
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const MongoStoreModule = require('connect-mongo');
const MongoStore = MongoStoreModule.default || MongoStoreModule;
const path = require('path');
const settings = require('./config/settings');

const app = express();
app.set('trust proxy', 1);   // Render nằm sau proxy HTTPS

// Dữ liệu dùng chung cho footer ở mọi trang
app.locals.STUDENT_NAME = settings.STUDENT_NAME;
app.locals.STUDENT_ID = settings.STUDENT_ID;
app.locals.VAT_PERCENT = settings.VAT_PERCENT;

app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: { formatMoney: (n) => Number(n).toLocaleString('vi-VN') }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// SESSION STATELESS: lưu tập trung trên MongoDB Atlas, KHÔNG dùng RAM (MemoryStore)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI_WRITE,   // user writer có quyền trên "sessions"
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use('/', require('./routes/books'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy cổng ${PORT}`));