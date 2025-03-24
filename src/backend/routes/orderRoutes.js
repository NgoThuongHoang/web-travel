const express = require('express');
const { sql } = require('../db');

const router = express.Router();

// Middleware kiểm tra pool
const ensurePool = (req, res, next) => {
  if (!req.app.locals.pool) {
    return res.status(503).json({ message: 'Dịch vụ không sẵn sàng, lỗi kết nối database' });
  }
  next();
};

// API lấy danh sách orders
router.get('/', ensurePool, async (req, res) => {
    try {
      const result = await req.app.locals.pool.request()
        .query(`
          SELECT o.*, t.name as tour_name, t.tour_code
          FROM [web_travel].[dbo].[orders] o
          LEFT JOIN [web_travel].[dbo].[tours] t ON o.tour_id = t.id
        `);
      const orders = result.recordset;
  
      // Lấy thông tin travelers cho từng order
      for (let order of orders) {
        const travelersResult = await req.app.locals.pool.request()
          .input('order_id', sql.Int, order.id)
          .query(`
            SELECT * FROM [web_travel].[dbo].[order_travelers]
            WHERE order_id = @order_id
          `);
        order.travelers = travelersResult.recordset;
      }
  
      res.json(orders);
    } catch (err) {
      console.error('Lỗi lấy danh sách orders:', err);
      res.status(500).json({ error: 'Lỗi server: ' + err.message });
    }
});

// API duyệt đơn hàng
router.put('/:orderId/confirm', ensurePool, async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderCheck = await req.app.locals.pool.request()
      .input('order_id', sql.Int, parseInt(orderId))
      .query(`
        SELECT tour_id, total_booked_tickets, status
        FROM [web_travel].[dbo].[orders]
        WHERE id = @order_id
      `);

    if (orderCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    const order = orderCheck.recordset[0];
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Đơn hàng không ở trạng thái chờ xác nhận!' });
    }

    const tourCheck = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, order.tour_id)
      .query(`
        SELECT remaining_tickets
        FROM [web_travel].[dbo].[tours]
        WHERE id = @tour_id
      `);

    if (tourCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Tour không tồn tại!' });
    }

    const remaining_tickets = tourCheck.recordset[0].remaining_tickets;
    const total_booked_tickets = order.total_booked_tickets;

    if (remaining_tickets < total_booked_tickets) {
      return res.status(400).json({ error: `Không đủ vé! Chỉ còn ${remaining_tickets} vé.` });
    }

    await req.app.locals.pool.request()
      .input('order_id', sql.Int, parseInt(orderId))
      .input('status', sql.NVarChar, 'confirmed')
      .query(`
        UPDATE [web_travel].[dbo].[orders]
        SET status = @status
        WHERE id = @order_id
      `);

    await req.app.locals.pool.request()
      .input('tour_id', sql.Int, order.tour_id)
      .input('total_booked_tickets', sql.Int, total_booked_tickets)
      .query(`
        UPDATE [web_travel].[dbo].[tours]
        SET remaining_tickets = remaining_tickets - @total_booked_tickets
        WHERE id = @tour_id
      `);

    const updatedTour = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, order.tour_id)
      .query(`
        SELECT remaining_tickets
        FROM [web_travel].[dbo].[tours]
        WHERE id = @tour_id
      `);

    res.status(200).json({
      message: 'Duyệt đơn hàng thành công!',
      updated_remaining_tickets: updatedTour.recordset[0].remaining_tickets,
    });
  } catch (err) {
    console.error('Lỗi duyệt đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API cập nhật đơn hàng
router.put('/:id', ensurePool, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      phone,
      email,
      birth_date,
      id_number,
      start_date,
      end_date,
      adults,
      children_under_5,
      children_5_11,
      single_rooms,
      pickup_point,
      special_requests,
      payment_method,
      total_amount,
      status,
      tour_id,
      order_date,
    } = req.body;

    const total_booked_tickets = (adults || 0) + (children_under_5 || 0) + (children_5_11 || 0);

    // Kiểm tra đơn hàng tồn tại
    const orderCheck = await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM [web_travel].[dbo].[orders] WHERE id = @id');

    if (orderCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    // Kiểm tra tour
    const tourCheck = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, parseInt(tour_id))
      .query('SELECT remaining_tickets FROM [web_travel].[dbo].[tours] WHERE id = @tour_id');

    if (tourCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Tour không tồn tại!' });
    }

    // Cập nhật đơn hàng
    await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('tour_id', sql.Int, parseInt(tour_id))
      .input('full_name', sql.NVarChar, full_name)
      .input('phone', sql.NVarChar, phone)
      .input('email', sql.NVarChar, email)
      .input('birth_date', sql.DateTime, birth_date ? new Date(birth_date) : null)
      .input('id_number', sql.NVarChar, id_number)
      .input('start_date', sql.DateTime, start_date ? new Date(start_date) : null)
      .input('end_date', sql.DateTime, end_date ? new Date(end_date) : null)
      .input('adults', sql.Int, adults || 0)
      .input('children_under_5', sql.Int, children_under_5 || 0)
      .input('children_5_11', sql.Int, children_5_11 || 0)
      .input('single_rooms', sql.Int, single_rooms || 0)
      .input('pickup_point', sql.NVarChar, pickup_point)
      .input('special_requests', sql.NVarChar, special_requests)
      .input('payment_method', sql.NVarChar, payment_method)
      .input('total_booked_tickets', sql.Int, total_booked_tickets)
      .input('total_amount', sql.Float, total_amount || 0)
      .input('status', sql.NVarChar, status)
      .input('order_date', sql.DateTime, order_date ? new Date(order_date) : new Date())
      .query(`
        UPDATE [web_travel].[dbo].[orders]
        SET tour_id = @tour_id, full_name = @full_name, phone = @phone, email = @email, 
            birth_date = @birth_date, id_number = @id_number, start_date = @start_date, 
            end_date = @end_date, adults = @adults, children_under_5 = @children_under_5, 
            children_5_11 = @children_5_11, single_rooms = @single_rooms, 
            pickup_point = @pickup_point, special_requests = @special_requests, 
            payment_method = @payment_method, total_booked_tickets = @total_booked_tickets, 
            total_amount = @total_amount, status = @status, order_date = @order_date
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Cập nhật đơn hàng thành công!' });
  } catch (err) {
    console.error('Lỗi cập nhật đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API xóa đơn hàng
router.delete('/:id', ensurePool, async (req, res) => {
  try {
    const { id } = req.params;

    const orderCheck = await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM [web_travel].[dbo].[orders] WHERE id = @id');

    if (orderCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM [web_travel].[dbo].[orders] WHERE id = @id');

    res.status(200).json({ message: 'Xóa đơn hàng thành công!' });
  } catch (err) {
    console.error('Lỗi xóa đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;