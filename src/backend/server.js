const express = require('express');
const { connectDB } = require('./db');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// Import routes
const tourRoutes = require('./routes/tourRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
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

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});