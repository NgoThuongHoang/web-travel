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
    // Lấy tất cả đơn hàng từ bảng orders
    const ordersResult = await req.app.locals.pool.request()
      .query(`
        SELECT 
          o.id,
          o.tour_id,
          o.customer_id,
          o.start_date,
          o.end_date,
          o.adults,
          o.children_under_5,
          o.children_5_11,
          o.single_rooms,
          o.pickup_point,
          o.special_requests,
          o.payment_method,
          o.total_amount,
          o.status,
          o.created_at AS order_date
        FROM [web_travel].[dbo].[orders] o
      `);

    const orders = ordersResult.recordset;

    // Lấy thông tin khách hàng (người đặt tour và người đi cùng) từ bảng customers
    for (let order of orders) {
      // Lấy thông tin khách hàng chính (lead customer) dựa trên customer_id từ bảng orders
      const leadCustomerResult = await req.app.locals.pool.request()
        .input('customer_id', sql.Int, order.customer_id)
        .query(`
          SELECT 
            c.id,
            c.full_name,
            c.phone,
            c.email,
            c.gender,
            c.birth_date,
            c.address
          FROM [web_travel].[dbo].[customers] c
          WHERE c.id = @customer_id
        `);

      const leadCustomer = leadCustomerResult.recordset[0];
      if (leadCustomer) {
        order.full_name = leadCustomer.full_name;
        order.phone = leadCustomer.phone;
        order.email = leadCustomer.email || '';
        order.gender = leadCustomer.gender;
        order.birth_date = leadCustomer.birth_date;
      } else {
        // Nếu không tìm thấy lead customer, gán giá trị mặc định
        order.full_name = 'N/A';
        order.phone = 'N/A';
        order.email = 'N/A';
        order.gender = 'N/A';
        order.birth_date = null;
      }

      // Lấy tất cả khách hàng liên quan đến đơn hàng (bao gồm cả lead customer và người đi cùng)
      const customersResult = await req.app.locals.pool.request()
        .input('order_id', sql.Int, order.id)
        .query(`
          SELECT 
            c.id,
            c.full_name,
            c.phone,
            c.email,
            c.gender,
            c.birth_date,
            c.address,
            c.single_room,
            c.traveler_type
          FROM [web_travel].[dbo].[customers] c
          WHERE c.order_id = @order_id
        `);

      order.customers = customersResult.recordset || [];
    }

    res.status(200).json(orders);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API duyệt đơn hàng
router.put('/:orderId/confirm', ensurePool, async (req, res) => {
  const transaction = new sql.Transaction(req.app.locals.pool);

  try {
    await transaction.begin();

    const { orderId } = req.params;

    // Kiểm tra đơn hàng tồn tại và trạng thái hiện tại
    const orderCheck = await transaction.request()
      .input('order_id', sql.Int, parseInt(orderId))
      .query(`
        SELECT o.*, t.remaining_tickets
        FROM [web_travel].[dbo].[orders] o
        JOIN [web_travel].[dbo].[tours] t ON o.tour_id = t.id
        WHERE o.id = @order_id
      `);

    if (orderCheck.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    const order = orderCheck.recordset[0];
    if (order.status !== 'pending') {
      await transaction.rollback();
      return res.status(400).json({ error: 'Đơn hàng không ở trạng thái pending, không thể xác nhận!' });
    }

    const total_booked_tickets = (order.adults || 0) + (order.children_under_5 || 0) + (order.children_5_11 || 0);
    const remaining_tickets = order.remaining_tickets;

    // Kiểm tra số vé còn lại
    if (remaining_tickets < total_booked_tickets) {
      await transaction.rollback();
      return res.status(400).json({ error: `Không đủ vé để xác nhận! Chỉ còn ${remaining_tickets} vé.` });
    }

    // Trừ remaining_tickets
    const newRemainingTickets = remaining_tickets - total_booked_tickets;
    await transaction.request()
      .input('tour_id', sql.Int, order.tour_id)
      .input('remaining_tickets', sql.Int, newRemainingTickets)
      .query(`
        UPDATE [web_travel].[dbo].[tours]
        SET remaining_tickets = @remaining_tickets
        WHERE id = @tour_id
      `);

    // Cập nhật trạng thái đơn hàng thành confirmed
    await transaction.request()
      .input('order_id', sql.Int, parseInt(orderId))
      .query(`
        UPDATE [web_travel].[dbo].[orders]
        SET status = 'confirmed'
        WHERE id = @order_id
      `);

    await transaction.commit();

    // Lấy remaining_tickets sau khi cập nhật để trả về
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
    await transaction.rollback();
    console.error('Lỗi duyệt đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API hủy đơn hàng (không xóa, chỉ cập nhật trạng thái)
router.put('/:orderId/cancel', ensurePool, async (req, res) => {
  const transaction = new sql.Transaction(req.app.locals.pool);

  try {
    await transaction.begin();

    const { orderId } = req.params;

    // Kiểm tra đơn hàng tồn tại và trạng thái hiện tại
    const orderCheck = await transaction.request()
      .input('order_id', sql.Int, parseInt(orderId))
      .query(`
        SELECT o.*, t.remaining_tickets
        FROM [web_travel].[dbo].[orders] o
        JOIN [web_travel].[dbo].[tours] t ON o.tour_id = t.id
        WHERE o.id = @order_id
      `);

    if (orderCheck.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    const order = orderCheck.recordset[0];
    if (order.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({ error: 'Đơn hàng đã bị hủy trước đó!' });
    }

    // Nếu đơn hàng đã được xác nhận, hoàn lại số vé
    if (order.status === 'confirmed') {
      const total_booked_tickets = (order.adults || 0) + (order.children_under_5 || 0) + (order.children_5_11 || 0);
      const newRemainingTickets = order.remaining_tickets + total_booked_tickets;

      await transaction.request()
        .input('tour_id', sql.Int, order.tour_id)
        .input('remaining_tickets', sql.Int, newRemainingTickets)
        .query(`
          UPDATE [web_travel].[dbo].[tours]
          SET remaining_tickets = @remaining_tickets
          WHERE id = @tour_id
        `);
    }

    // Cập nhật trạng thái đơn hàng thành cancelled
    await transaction.request()
      .input('order_id', sql.Int, parseInt(orderId))
      .query(`
        UPDATE [web_travel].[dbo].[orders]
        SET status = 'cancelled'
        WHERE id = @order_id
      `);

    await transaction.commit();

    // Lấy remaining_tickets sau khi cập nhật để trả về
    const updatedTour = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, order.tour_id)
      .query(`
        SELECT remaining_tickets
        FROM [web_travel].[dbo].[tours]
        WHERE id = @tour_id
      `);

    res.status(200).json({
      message: 'Hủy đơn hàng thành công!',
      updated_remaining_tickets: updatedTour.recordset[0].remaining_tickets,
    });
  } catch (err) {
    await transaction.rollback();
    console.error('Lỗi khi hủy đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API cập nhật đơn hàng
router.put('/:id', ensurePool, async (req, res) => {
  const transaction = new sql.Transaction(req.app.locals.pool);

  try {
    await transaction.begin();

    const { id } = req.params;
    const {
      full_name,
      phone,
      email,
      gender,
      birth_date,
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
      customers // Danh sách khách hàng (bao gồm người đặt tour và người đi cùng)
    } = req.body;

    // Kiểm tra đơn hàng tồn tại
    const orderCheck = await transaction.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        SELECT customer_id, adults, children_under_5, children_5_11, status, tour_id
        FROM [web_travel].[dbo].[orders]
        WHERE id = @id
      `);

    if (orderCheck.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    const order = orderCheck.recordset[0];
    const customerId = order.customer_id;
    const oldTotalTickets = (order.adults || 0) + (order.children_under_5 || 0) + (order.children_5_11 || 0);
    const newTotalTickets = (adults || 0) + (children_under_5 || 0) + (children_5_11 || 0);

    // Kiểm tra tour
    const tourCheck = await transaction.request()
      .input('tour_id', sql.Int, parseInt(tour_id))
      .query(`
        SELECT remaining_tickets
        FROM [web_travel].[dbo].[tours]
        WHERE id = @tour_id
      `);

    if (tourCheck.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Tour không tồn tại!' });
    }

    const remainingTickets = tourCheck.recordset[0].remaining_tickets;

    // Nếu đơn hàng đã được xác nhận và số vé thay đổi, cần cập nhật remaining_tickets
    if (order.status === 'confirmed') {
      let ticketDifference = newTotalTickets - oldTotalTickets;

      // Nếu số vé tăng, kiểm tra xem có đủ vé không
      if (ticketDifference > 0 && remainingTickets < ticketDifference) {
        await transaction.rollback();
        return res.status(400).json({ error: `Không đủ vé! Chỉ còn ${remainingTickets} vé.` });
      }

      // Cập nhật remaining_tickets
      await transaction.request()
        .input('tour_id', sql.Int, parseInt(tour_id))
        .input('ticket_difference', sql.Int, ticketDifference)
        .query(`
          UPDATE [web_travel].[dbo].[tours]
          SET remaining_tickets = remaining_tickets - @ticket_difference
          WHERE id = @tour_id
        `);
    } else if (status === 'confirmed' && order.status !== 'confirmed') {
      // Nếu trạng thái thay đổi từ pending sang confirmed, trừ vé
      if (remainingTickets < newTotalTickets) {
        await transaction.rollback();
        return res.status(400).json({ error: `Không đủ vé! Chỉ còn ${remainingTickets} vé.` });
      }

      await transaction.request()
        .input('tour_id', sql.Int, parseInt(tour_id))
        .input('total_tickets', sql.Int, newTotalTickets)
        .query(`
          UPDATE [web_travel].[dbo].[tours]
          SET remaining_tickets = remaining_tickets - @total_tickets
          WHERE id = @tour_id
        `);
    } else if (status !== 'confirmed' && order.status === 'confirmed') {
      // Nếu trạng thái thay đổi từ confirmed sang pending/cancelled, hoàn lại vé
      await transaction.request()
        .input('tour_id', sql.Int, parseInt(tour_id))
        .input('total_tickets', sql.Int, oldTotalTickets)
        .query(`
          UPDATE [web_travel].[dbo].[tours]
          SET remaining_tickets = remaining_tickets + @total_tickets
          WHERE id = @tour_id
        `);
    }

    // Xóa tất cả khách hàng hiện tại của đơn hàng
    await transaction.request()
      .input('order_id', sql.Int, parseInt(id))
      .query(`
        DELETE FROM [web_travel].[dbo].[customers]
        WHERE order_id = @order_id
      `);

    // Thêm lại danh sách khách hàng mới (bao gồm cả người đặt tour và người đi cùng)
    for (const customer of customers) {
      await transaction.request()
        .input('full_name', sql.NVarChar, customer.full_name)
        .input('gender', sql.NVarChar, customer.gender)
        .input('birth_date', sql.Date, customer.birth_date ? new Date(customer.birth_date) : null)
        .input('phone', sql.NVarChar, customer.phone || null)
        .input('email', sql.NVarChar, customer.email || null)
        .input('order_id', sql.Int, parseInt(id))
        .input('tour_id', sql.Int, parseInt(tour_id))
        .input('single_room', sql.Bit, customer.single_room ? 1 : 0)
        .input('traveler_type', sql.NVarChar, customer.traveler_type)
        .input('address', sql.NVarChar, customer.address || null)
        .query(`
          INSERT INTO [web_travel].[dbo].[customers] (full_name, gender, birth_date, phone, email, order_id, tour_id, single_room, traveler_type, address)
          VALUES (@full_name, @gender, @birth_date, @phone, @email, @order_id, @tour_id, @single_room, @traveler_type, @address)
        `);
    }

    // Cập nhật thông tin đơn hàng trong bảng orders
    await transaction.request()
      .input('id', sql.Int, parseInt(id))
      .input('tour_id', sql.Int, parseInt(tour_id))
      .input('start_date', sql.Date, start_date ? new Date(start_date) : null)
      .input('end_date', sql.Date, end_date ? new Date(end_date) : null)
      .input('adults', sql.Int, adults || 0)
      .input('children_under_5', sql.Int, children_under_5 || 0)
      .input('children_5_11', sql.Int, children_5_11 || 0)
      .input('single_rooms', sql.Int, single_rooms || 0)
      .input('pickup_point', sql.NVarChar, pickup_point)
      .input('special_requests', sql.NVarChar, special_requests)
      .input('payment_method', sql.NVarChar, payment_method)
      .input('total_amount', sql.Int, total_amount || 0)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE [web_travel].[dbo].[orders]
        SET tour_id = @tour_id, start_date = @start_date, end_date = @end_date, 
            adults = @adults, children_under_5 = @children_under_5, children_5_11 = @children_5_11, 
            single_rooms = @single_rooms, pickup_point = @pickup_point, 
            special_requests = @special_requests, payment_method = @payment_method, 
            total_amount = @total_amount, status = @status
        WHERE id = @id
      `);

    await transaction.commit();

    res.status(200).json({ message: 'Cập nhật đơn hàng thành công!' });
  } catch (err) {
    await transaction.rollback();
    console.error('Lỗi cập nhật đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API xóa đơn hàng
router.delete('/:id', ensurePool, async (req, res) => {
  const transaction = new sql.Transaction(req.app.locals.pool);

  try {
    await transaction.begin();

    const { id } = req.params;

    // Kiểm tra đơn hàng tồn tại
    const orderCheck = await transaction.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        SELECT o.*, t.remaining_tickets
        FROM [web_travel].[dbo].[orders] o
        JOIN [web_travel].[dbo].[tours] t ON o.tour_id = t.id
        WHERE o.id = @id
      `);

    if (orderCheck.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    const order = orderCheck.recordset[0];
    const totalTickets = (order.adults || 0) + (order.children_under_5 || 0) + (order.children_5_11 || 0);

    // Nếu đơn hàng ở trạng thái "confirmed", cập nhật lại số vé trong bảng tours
    if (order.status === 'confirmed') {
      await transaction.request()
        .input('tour_id', sql.Int, order.tour_id)
        .input('total_tickets', sql.Int, totalTickets)
        .query(`
          UPDATE [web_travel].[dbo].[tours]
          SET remaining_tickets = remaining_tickets + @total_tickets
          WHERE id = @tour_id
        `);

      console.log(`Đã cập nhật số vé cho tour ${order.tour_id}, tăng thêm ${totalTickets} vé`);
    }

    // Xóa các khách hàng liên quan (cả người đặt tour và người đi cùng) trong bảng customers
    const deleteCustomersResult = await transaction.request()
      .input('order_id', sql.Int, parseInt(id))
      .query('DELETE FROM [web_travel].[dbo].[customers] WHERE order_id = @order_id');

    console.log(`Đã xóa ${deleteCustomersResult.rowsAffected} khách hàng liên quan đến đơn hàng ${id}`);

    // Xóa đơn hàng trong bảng orders
    const deleteOrderResult = await transaction.request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM [web_travel].[dbo].[orders] WHERE id = @id');

    console.log(`Đã xóa đơn hàng ${id}, số bản ghi bị ảnh hưởng: ${deleteOrderResult.rowsAffected}`);

    // Commit giao dịch nếu thành công
    await transaction.commit();

    res.status(200).json({ message: 'Xóa đơn hàng thành công!' });
  } catch (err) {
    // Rollback giao dịch nếu có lỗi
    await transaction.rollback();
    console.error('Lỗi xóa đơn hàng:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;