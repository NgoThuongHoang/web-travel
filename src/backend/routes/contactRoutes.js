const express = require('express');
const sql = require('mssql');
const router = express.Router(); // Tạo một router riêng

// API endpoint để lưu thông tin liên hệ
router.post('/', async (req, res) => {
    const { ten, dienthoai, diachi, email, noidung } = req.body;

    if (!ten || !dienthoai || !diachi || !email || !noidung) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    try {
        // Sử dụng pool từ app.locals được thiết lập trong server.js
        const pool = await req.app.locals.pool;
        const query = `
            INSERT INTO contacts (ten, dienthoai, diachi, email, noidung)
            VALUES (@ten, @dienthoai, @diachi, @email, @noidung)
        `;
        await pool.request()
            .input('ten', sql.NVarChar, ten)
            .input('dienthoai', sql.VarChar, dienthoai)
            .input('diachi', sql.NVarChar, diachi)
            .input('email', sql.VarChar, email)
            .input('noidung', sql.NVarChar, noidung)
            .query(query);

        res.status(200).json({ success: true, message: 'Thông tin đã được lưu' });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

module.exports = router; // Xuất router thay vì hàm