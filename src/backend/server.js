const express = require('express');
const { connectDB } = require('./db');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// Import routes
const tourRoutes = require('./routes/tourRoutes');
const accountRoutes = require('./routes/accountRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
app.use('/images', express.static('public/images')); // Phục vụ file tĩnh từ thư mục public/images
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Kết nối database
connectDB()
  .then(pool => {
    app.locals.pool = pool;
    console.log('✅ Kết nối SQL Server thành công!');
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối SQL Server:', err);
    process.exit(1);
  });

// Sử dụng routes
app.use('/api/tours', tourRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/contact', contactRoutes);

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});