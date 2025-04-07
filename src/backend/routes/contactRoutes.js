const express = require('express');
const sql = require('mssql');
const router = express.Router();

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

// Middleware để quản lý pool kết nối
const getPool = async () => {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

// GET: Lấy tất cả contacts
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM contacts');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST: Tạo contact mới
router.post('/', async (req, res) => {
  const { ten, dienthoai, diachi, email, noidung, status = 'in_progress' } = req.body;
  if (!ten || !dienthoai || !diachi || !email || !noidung) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('ten', sql.NVarChar, ten)
      .input('dienthoai', sql.VarChar, dienthoai)
      .input('diachi', sql.NVarChar, diachi)
      .input('email', sql.VarChar, email)
      .input('noidung', sql.NVarChar, noidung)
      .input('status', sql.NVarChar, status)
      .query(`
        INSERT INTO contacts (ten, dienthoai, diachi, email, noidung, status)
        VALUES (@ten, @dienthoai, @diachi, @email, @noidung, @status);
        SELECT SCOPE_IDENTITY() as id
      `);
    res.status(201).json({
      success: true,
      message: 'Thông tin đã được lưu',
      id: result.recordset[0].id
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PUT: Cập nhật contact
router.put('/', async (req, res) => {
  const { id, name, phone, address, email, content, status } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'ID là bắt buộc' });
  }
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, id)
      .input('ten', sql.NVarChar, name)
      .input('dienthoai', sql.VarChar, phone)
      .input('diachi', sql.NVarChar, address)
      .input('email', sql.VarChar, email)
      .input('noidung', sql.NVarChar, content)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE contacts SET 
          ten = @ten,
          dienthoai = @dienthoai,
          diachi = @diachi,
          email = @email,
          noidung = @noidung,
          status = @status
        WHERE id = @id
      `);
    res.status(200).json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// DELETE: Xóa contact
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM contacts WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
    }
    res.status(200).json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// PUT: Bulk update status
router.put('/bulk-update', async (req, res) => {
  const { ids, status } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Danh sách ID không hợp lệ' });
  }
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('status', sql.NVarChar, status)
      .query(`UPDATE contacts SET status = @status WHERE id IN (${ids.join(',')})`);
    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái hàng loạt thành công',
      affectedRows: result.rowsAffected[0]
    });
  } catch (err) {
    console.error('Error bulk updating:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;