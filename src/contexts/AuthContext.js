const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Thêm JWT
const { sql } = require('../db'); // Import sql từ db.js

const router = express.Router();
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Sử dụng biến môi trường cho secret key

// Middleware kiểm tra pool
const ensurePool = (req, res, next) => {
  if (!req.app.locals.pool) {
    return res.status(503).json({ message: 'Dịch vụ không sẵn sàng, lỗi kết nối database' });
  }
  next();
};

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Không có token, truy cập bị từ chối!' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token không hợp lệ!' });
  }
};

// API đăng nhập
router.post('/login', ensurePool, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc!' });
    }

    // Tìm tài khoản theo email
    const result = await req.app.locals.pool.request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT id, username, email, full_name AS fullName, role, status, password
        FROM dbo.accounts
        WHERE email = @email
      `);

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Email không tồn tại!' });
    }

    const account = result.recordset[0];

    // Kiểm tra mật khẩu
    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Mật khẩu không đúng!' });
    }

    // Kiểm tra trạng thái tài khoản
    if (account.status !== 'Hoạt động') {
      return res.status(403).json({ error: 'Tài khoản không hoạt động!' });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: account.id, email: account.email, role: account.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Trả về thông tin tài khoản và token (không bao gồm mật khẩu)
    const { password: _, ...userData } = account;
    res.json({ ...userData, token });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API lấy danh sách tài khoản (yêu cầu xác thực)
router.get('/', ensurePool, authenticateToken, async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = `SELECT id, username, email, full_name AS fullName, role, status FROM dbo.accounts WHERE 1=1`;
    const request = req.app.locals.pool.request();

    // Xử lý tham số tìm kiếm
    if (search) {
      query += ` AND (username LIKE @search OR email LIKE @search OR full_name LIKE @search)`;
      request.input('search', sql.NVarChar, `%${search}%`);
    }

    // Xử lý tham số trạng thái
    if (status) {
      query += ` AND status = @status`;
      request.input('status', sql.NVarChar, status);
    }

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi lấy danh sách tài khoản:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API lấy chi tiết một tài khoản (yêu cầu xác thực)
router.get('/:id', ensurePool, authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra id hợp lệ
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ!' });
    }

    const result = await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        SELECT id, username, email, full_name AS fullName, role, status
        FROM dbo.accounts
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Tài khoản không tồn tại!' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Lỗi lấy chi tiết tài khoản:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API tạo tài khoản mới (yêu cầu xác thực)
router.post('/', ensurePool, authenticateToken, async (req, res) => {
  try {
    const { username, email, password, fullName, role, status } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || !fullName || !role || !status) {
      return res.status(400).json({ error: 'Tất cả các trường là bắt buộc!' });
    }

    // Kiểm tra email đã tồn tại
    const emailCheck = await req.app.locals.pool.request()
      .input('email', sql.NVarChar, email)
      .query(`SELECT id FROM dbo.accounts WHERE email = @email`);

    if (emailCheck.recordset.length > 0) {
      return res.status(400).json({ error: 'Email đã tồn tại!' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await req.app.locals.pool.request()
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .input('fullName', sql.NVarChar, fullName)
      .input('role', sql.NVarChar, role)
      .input('status', sql.NVarChar, status)
      .query(`
        INSERT INTO dbo.accounts (username, email, password, full_name, role, status)
        VALUES (@username, @email, @password, @fullName, @role, @status);
        SELECT SCOPE_IDENTITY() as id;
      `);

    const newId = result.recordset[0].id;
    res.status(201).json({ id: newId, message: 'Tài khoản đã được tạo thành công!' });
  } catch (err) {
    console.error('Lỗi tạo tài khoản:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API cập nhật tài khoản (yêu cầu xác thực)
router.put('/:id', ensurePool, authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, fullName, role, status } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ!' });
    }
    if (!username || !email || !fullName || !role || !status) {
      return res.status(400).json({ error: 'Tất cả các trường là bắt buộc!' });
    }

    // Kiểm tra email đã tồn tại (trừ tài khoản hiện tại)
    const emailCheck = await req.app.locals.pool.request()
      .input('email', sql.NVarChar, email)
      .input('id', sql.Int, parseInt(id))
      .query(`SELECT id FROM dbo.accounts WHERE email = @email AND id != @id`);

    if (emailCheck.recordset.length > 0) {
      return res.status(400).json({ error: 'Email đã tồn tại!' });
    }

    const result = await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('username', sql.NVarChar, username)
      .input('email', sql.NVarChar, email)
      .input('fullName', sql.NVarChar, fullName)
      .input('role', sql.NVarChar, role)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE dbo.accounts
        SET username = @username, email = @email, full_name = @fullName, role = @role, status = @status
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Tài khoản không tồn tại!' });
    }

    res.json({ message: 'Tài khoản đã được cập nhật thành công!' });
  } catch (err) {
    console.error('Lỗi cập nhật tài khoản:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API đặt lại mật khẩu (yêu cầu xác thực)
router.post('/:id/reset-password', ensurePool, authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ!' });
    }
    if (!newPassword) {
      return res.status(400).json({ error: 'Mật khẩu mới là bắt buộc!' });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const result = await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
        UPDATE dbo.accounts
        SET password = @password
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Tài khoản không tồn tại!' });
    }

    res.json({ message: 'Mật khẩu đã được đặt lại thành công!' });
  } catch (err) {
    console.error('Lỗi đặt lại mật khẩu:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API xóa tài khoản (yêu cầu xác thực)
router.delete('/:id', ensurePool, authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra dữ liệu đầu vào
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ!' });
    }

    const result = await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(`DELETE FROM dbo.accounts WHERE id = @id`);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Tài khoản không tồn tại!' });
    }

    res.json({ message: 'Tài khoản đã được xóa thành công!' });
  } catch (err) {
    console.error('Lỗi xóa tài khoản:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;