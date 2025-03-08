require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false, // Nếu dùng SSL, có thể đặt thành true
    trustServerCertificate: true, // Tránh lỗi chứng chỉ tự ký
    connectionTimeout: 30000, // Tăng thời gian timeout kết nối lên 30 giây
    requestTimeout: 30000 // Tăng thời gian timeout request lên 30 giây
  }
};

async function connectDB() {
  try {
    let pool = await sql.connect(config);
    console.log("✅ Kết nối SQL Server thành công!");
    return pool;
  } catch (err) {
    console.error("❌ Kết nối thất bại: " + err.message);
  }
}

module.exports = { connectDB, sql };