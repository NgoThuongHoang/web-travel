const express = require('express');
const { sql } = require('../db');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const router = express.Router();

// Middleware kiểm tra pool
const ensurePool = (req, res, next) => {
  if (!req.app.locals.pool) {
    return res.status(503).json({ message: 'Dịch vụ không sẵn sàng, lỗi kết nối database' });
  }
  next();
};

// Cấu hình Nodemailer với Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'skytraveldntu@gmail.com',
    pass: 'pwzqsuufuqvyxska', // Nếu 2FA bật, thay bằng mật khẩu ứng dụng (xem phần lưu ý)
  },
});

// API lấy danh sách orders
router.get('/', ensurePool, async (req, res) => {
  try {
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
          o.created_at AS order_date,
          t.tour_code,
          t.name AS tour_name
        FROM [web_travel].[dbo].[orders] o
        LEFT JOIN [web_travel].[dbo].[tours] t ON o.tour_id = t.id
      `);

    const orders = ordersResult.recordset;

    for (let order of orders) {
      let leadCustomerResult = await req.app.locals.pool.request()
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

      let leadCustomer = leadCustomerResult.recordset[0];
      if (!leadCustomer) {
        const fallbackCustomerResult = await req.app.locals.pool.request()
          .input('order_id', sql.Int, order.id)
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
            WHERE c.order_id = @order_id AND c.traveler_type = 'Lead'
          `);

        leadCustomer = fallbackCustomerResult.recordset[0];
        if (leadCustomer) {
          await req.app.locals.pool.request()
            .input('order_id', sql.Int, order.id)
            .input('customer_id', sql.Int, leadCustomer.id)
            .query(`
              UPDATE [web_travel].[dbo].[orders]
              SET customer_id = @customer_id
              WHERE id = @order_id
            `);
          order.customer_id = leadCustomer.id;
        }
      }

      if (leadCustomer) {
        order.full_name = leadCustomer.full_name;
        order.phone = leadCustomer.phone;
        order.email = leadCustomer.email || '';
        order.gender = leadCustomer.gender;
        order.birth_date = leadCustomer.birth_date;
      } else {
        order.full_name = 'N/A';
        order.phone = 'N/A';
        order.email = 'N/A';
        order.gender = 'N/A';
        order.birth_date = null;
      }

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

// API lấy chi tiết một đơn hàng theo ID
router.get('/:id', ensurePool, async (req, res) => {
  try {
    const { id } = req.params;

    const orderResult = await req.app.locals.pool.request()
      .input('order_id', sql.Int, parseInt(id))
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
          o.created_at AS order_date,
          o.email_sent, -- Thêm cột email_sent
          t.tour_code,
          t.name AS tour_name
        FROM [web_travel].[dbo].[orders] o
        LEFT JOIN [web_travel].[dbo].[tours] t ON o.tour_id = t.id
        WHERE o.id = @order_id
      `);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    const order = orderResult.recordset[0];

    // Lấy thông tin khách hàng chính (Lead)
    let leadCustomerResult = await req.app.locals.pool.request()
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

    let leadCustomer = leadCustomerResult.recordset[0];
    if (!leadCustomer) {
      const fallbackCustomerResult = await req.app.locals.pool.request()
        .input('order_id', sql.Int, order.id)
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
          WHERE c.order_id = @order_id AND c.traveler_type = 'Lead'
        `);

      leadCustomer = fallbackCustomerResult.recordset[0];
      if (leadCustomer) {
        await req.app.locals.pool.request()
          .input('order_id', sql.Int, order.id)
          .input('customer_id', sql.Int, leadCustomer.id)
          .query(`
            UPDATE [web_travel].[dbo].[orders]
            SET customer_id = @customer_id
            WHERE id = @order_id
          `);
        order.customer_id = leadCustomer.id;
      }
    }

    if (leadCustomer) {
      order.full_name = leadCustomer.full_name;
      order.phone = leadCustomer.phone;
      order.email = leadCustomer.email || '';
      order.gender = leadCustomer.gender;
      order.birth_date = leadCustomer.birth_date;
    } else {
      order.full_name = 'N/A';
      order.phone = 'N/A';
      order.email = 'N/A';
      order.gender = 'N/A';
      order.birth_date = null;
    }

    // Lấy danh sách khách hàng đi cùng
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

    // Lấy lịch trình từ bảng tour_itineraries
    const itineraryResult = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, order.tour_id)
      .query(`
        SELECT 
          id,
          tour_id,
          day_number,
          title,
          details
        FROM [web_travel].[dbo].[tour_itineraries]
        WHERE tour_id = @tour_id
        ORDER BY day_number ASC
      `);

    // Tổng hợp lịch trình với định dạng "Ngày X: [title]" và bôi đen "Ngày X"
    const itinerary = itineraryResult.recordset.length > 0
      ? itineraryResult.recordset
          .map(item => `<strong>Ngày ${item.day_number}</strong>: ${item.title}`)
          .join('<br><br>')
      : 'TP.HCM   -   ' + (order.tour_name || 'Điểm đến') + '   -   TP.HCM';

    order.itinerary = itinerary;

    // Lấy giá từ bảng tour_prices
    const pricesResult = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, order.tour_id)
      .query(`
        SELECT 
          age_group,
          price,
          single_room_price
        FROM [web_travel].[dbo].[tour_prices]
        WHERE tour_id = @tour_id
      `);

    const prices = {};
    pricesResult.recordset.forEach(price => {
      prices[price.age_group] = {
        price: price.price,
        single_room_price: price.single_room_price || 0,
      };
    });

    order.prices = prices;

    // Tính thời gian tour
    order.duration = order.start_date && order.end_date
      ? (() => {
          const start = new Date(order.start_date);
          const end = new Date(order.end_date);
          const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          return `${diffDays} ngày ${diffDays - 1} đêm`;
        })()
      : 'N/A';

    res.status(200).json(order);
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
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
      customers
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

    // Logic cập nhật remaining_tickets chỉ thực hiện 1 lần
    let ticketAdjustment = 0; // Số vé cần điều chỉnh (cộng hoặc trừ)

    if (status === 'confirmed') {
      if (order.status === 'confirmed') {
        // Trường hợp 1: Đơn hàng đã confirmed, và vẫn confirmed sau khi cập nhật
        ticketAdjustment = newTotalTickets - oldTotalTickets; // Tính sự thay đổi số vé
        if (ticketAdjustment > 0 && remainingTickets < ticketAdjustment) {
          await transaction.rollback();
          return res.status(400).json({ error: `Không đủ vé! Chỉ còn ${remainingTickets} vé.` });
        }
      } else {
        // Trường hợp 2: Đơn hàng từ pending/cancelled chuyển sang confirmed
        ticketAdjustment = newTotalTickets; // Trừ toàn bộ số vé mới
        if (remainingTickets < ticketAdjustment) {
          await transaction.rollback();
          return res.status(400).json({ error: `Không đủ vé! Chỉ còn ${remainingTickets} vé.` });
        }
      }
    } else if (order.status === 'confirmed') {
      // Trường hợp 3: Đơn hàng từ confirmed chuyển sang pending/cancelled
      ticketAdjustment = -oldTotalTickets; // Hoàn lại số vé cũ
    }

    // Cập nhật remaining_tickets (chỉ 1 lần)
    if (ticketAdjustment !== 0) {
      await transaction.request()
        .input('tour_id', sql.Int, parseInt(tour_id))
        .input('ticket_adjustment', sql.Int, ticketAdjustment)
        .query(`
          UPDATE [web_travel].[dbo].[tours]
          SET remaining_tickets = remaining_tickets - @ticket_adjustment
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

    // Thêm khách hàng chính (Lead)
    const leadCustomer = {
      full_name,
      phone,
      email,
      gender,
      birth_date,
      address: pickup_point,
      single_room: false,
      traveler_type: 'Lead',
    };

    const leadCustomerResult = await transaction.request()
      .input('full_name', sql.NVarChar, leadCustomer.full_name)
      .input('gender', sql.NVarChar, leadCustomer.gender)
      .input('birth_date', sql.Date, leadCustomer.birth_date ? new Date(leadCustomer.birth_date) : null)
      .input('phone', sql.NVarChar, leadCustomer.phone || null)
      .input('email', sql.NVarChar, leadCustomer.email || null)
      .input('order_id', sql.Int, parseInt(id))
      .input('tour_id', sql.Int, parseInt(tour_id))
      .input('single_room', sql.Bit, leadCustomer.single_room ? 1 : 0)
      .input('traveler_type', sql.NVarChar, leadCustomer.traveler_type)
      .input('address', sql.NVarChar, leadCustomer.address || null)
      .query(`
        INSERT INTO [web_travel].[dbo].[customers] (full_name, gender, birth_date, phone, email, order_id, tour_id, single_room, traveler_type, address)
        OUTPUT INSERTED.id
        VALUES (@full_name, @gender, @birth_date, @phone, @email, @order_id, @tour_id, @single_room, @traveler_type, @address)
      `);

    const newCustomerId = leadCustomerResult.recordset[0].id;

    // Thêm danh sách người đi cùng
    for (const customer of customers || []) {
      await transaction.request()
        .input('full_name', sql.NVarChar, customer.full_name)
        .input('gender', sql.NVarChar, customer.gender)
        .input('birth_date', sql.Date, customer.birth_date ? new Date(customer.birth_date) : null)
        .input('phone', sql.NVarChar, customer.phone || null)
        .input('email', sql.NVarChar, customer.email || null)
        .input('order_id', sql.Int, parseInt(id))
        .input('tour_id', sql.Int, parseInt(tour_id))
        .input('single_room', sql.Bit, customer.single_room ? 1 : 0)
        .input('traveler_type', sql.NVarChar, customer.traveler_type || 'Người lớn')
        .input('address', sql.NVarChar, customer.address || null)
        .query(`
          INSERT INTO [web_travel].[dbo].[customers] (full_name, gender, birth_date, phone, email, order_id, tour_id, single_room, traveler_type, address)
          VALUES (@full_name, @gender, @birth_date, @phone, @email, @order_id, @tour_id, @single_room, @traveler_type, @address)
        `);
    }

    // Cập nhật đơn hàng
    await transaction.request()
      .input('id', sql.Int, parseInt(id))
      .input('tour_id', sql.Int, parseInt(tour_id))
      .input('customer_id', sql.Int, newCustomerId)
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
        SET tour_id = @tour_id, customer_id = @customer_id, start_date = @start_date, end_date = @end_date, 
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

// Hàm tạo HTML cho vé (dựa trên dữ liệu order)
const generateTicketHTML = (order) => {
  const itinerary = order.itinerary || 'N/A';
  const passengers = order.customers.map((customer, index) => {
    let type = customer.traveler_type === 'Lead' ? 'Người đặt tour' : customer.traveler_type;
    let price = '0đ';
    let surcharge = '0đ';

    // Ánh xạ đúng với age_group từ tour_prices
    if (customer.traveler_type === 'Người lớn' || customer.traveler_type === 'Lead') {
      price = order.prices['Adult']?.price ? `${order.prices['Adult'].price.toLocaleString('vi-VN')}đ` : '0đ';
      surcharge = customer.single_room && order.prices['Adult']?.single_room_price
        ? `${order.prices['Adult'].single_room_price.toLocaleString('vi-VN')}đ`
        : '0đ';
    } else if (customer.traveler_type === 'Trẻ em') {
      price = order.prices['5-11']?.price ? `${order.prices['5-11'].price.toLocaleString('vi-VN')}đ` : '0đ';
      surcharge = customer.single_room && order.prices['5-11']?.single_room_price
        ? `${order.prices['5-11'].single_room_price.toLocaleString('vi-VN')}đ`
        : '0đ';
    } else if (customer.traveler_type === 'Em bé') {
      price = order.prices['Under 5']?.price ? `${order.prices['Under 5'].price.toLocaleString('vi-VN')}đ` : '0đ';
      surcharge = '0đ'; // Em bé không có phụ thu phòng đơn
    }

    const total = (parseInt(price.replace(/[^0-9]/g, '')) + parseInt(surcharge.replace(/[^0-9]/g, ''))).toLocaleString('vi-VN') + 'đ';

    return `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div class="passenger-info">
            <span class="label">Họ tên:</span>
            <span class="value">${customer.full_name}</span>
          </div>
          <div class="passenger-info">
            <span class="label">Loại khách:</span>
            <span class="value">${type}</span>
          </div>
        </td>
        <td>${price}</td>
        <td>${surcharge}</td>
        <td>${total}</td>
      </tr>
    `;
  }).join('');

  const totalPrice = order.customers.reduce((total, customer) => {
    let price = 0;
    let surcharge = 0;
    if (customer.traveler_type === 'Người lớn' || customer.traveler_type === 'Lead') {
      price = order.prices['Adult']?.price || 0;
      surcharge = customer.single_room && order.prices['Adult']?.single_room_price ? order.prices['Adult'].single_room_price : 0;
    } else if (customer.traveler_type === 'Trẻ em') {
      price = order.prices['5-11']?.price || 0;
      surcharge = customer.single_room && order.prices['5-11']?.single_room_price ? order.prices['5-11'].single_room_price : 0;
    } else if (customer.traveler_type === 'Em bé') {
      price = order.prices['Under 5']?.price || 0;
      surcharge = 0; // Em bé không có phụ thu phòng đơn
    }
    return total + price + surcharge;
  }, 0).toLocaleString('vi-VN') + 'đ';

  // Generate QR Code URL
  const qrCodeValue = `https://skytravel.com/verify?ticket=${order.tour_code || 'N/A'}&customer=${order.email || 'N/A'}`;

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #ffffff;
          }
          .ticket-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
          }
          .ticket {
            width: 900px;
            background: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 30px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            position: relative;
          }
          .ticket-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
          }
          .logo {
            height: 50px;
          }
          .tour-title-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .tour-name {
            font-size: 18px;
            font-weight: bold;
            color: #e58703;
            margin: 0;
          }
          .tour-code {
            font-size: 16px;
            font-weight: bold;
            color: #e58703;
          }
          .section {
            margin: 20px 0;
          }
          .section h3 {
            font-size: 18px;
            font-weight: bold;
            color: #e58703;
            margin-bottom: 15px;
            text-transform: uppercase;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
          }
          .info-row {
            display: flex;
            flex-wrap: nowrap;
            gap: 20px;
            align-items: center;
          }
          .info-item {
            display: flex;
            align-items: center;
            gap: 5px;
            flex: 1 1 30%;
          }
          .label {
            font-weight: bold;
            color: #333;
          }
          .value {
            color: #666;
          }
          .itinerary {
            margin-top: 15px;
            display: flex;
            gap: 5px;
          }
          .passenger-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          .passenger-table th,
          .passenger-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
          }
          .passenger-table th {
            background: #f8f8f8;
            font-weight: bold;
            color: #333;
            font-size: 14px;
          }
          .passenger-table td {
            color: #666;
            font-size: 14px;
          }
          .passenger-table .passenger-info {
            display: flex;
            gap: 5px;
          }
          .passenger-table .total-row td {
            font-weight: bold;
            color: #e74c3c;
          }
          .ticket-footer {
            text-align: center;
            padding-top: 20px;
          }
          .qr-code {
            margin-bottom: 15px;
          }
          .note {
            font-size: 13px;
            color: #666;
            margin: 5px 0;
          }
          .note.warning {
            color: #e58703;
            font-style: normal;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="ticket-container">
          <div class="ticket">
            <div class="ticket-header">
              <img src="https://drive.google.com/uc?export=view&id=1AJt6gW1lTXHBq6ml9jLixIXZRvq1yLoP" alt="Sky Travel Logo" class="logo" />
            </div>

            <div class="section">
              <div class="tour-title-section">
                <h3 class="tour-name">${order.tour_name || 'N/A'}</h3>
                <div class="tour-code">Mã đặt tour: ${order.id || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">Ngày khởi hành:</span>
                  <span class="value">${order.start_date ? new Date(order.start_date).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="label">Thời gian:</span>
                  <span class="value">${order.duration || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="label">Số khách:</span>
                  <span class="value">${order.adults || 0} người lớn, ${order.children_5_11 || 0} trẻ em, ${order.children_under_5 || 0} em bé</span>
                </div>
              </div>
              <div class="itinerary">
                <span class="label">Lịch trình:</span>
                <span class="value">${itinerary}</span>
              </div>
            </div>

            <div class="section">
              <h3>Thông tin hành khách</h3>
              <div class="info-row">
                <div class="info-item">
                  <span class="label">Họ tên:</span>
                  <span class="value">${order.full_name || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="label">Số điện thoại:</span>
                  <span class="value">${order.phone || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="label">Email:</span>
                  <span class="value">${order.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>Danh sách khách đi tour</h3>
              <table class="passenger-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Thông tin hành khách</th>
                    <th>Giá vé</th>
                    <th>Phụ thu phòng đơn</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  ${passengers}
                  <tr class="total-row">
                    <td colspan="4">Tổng tiền</td>
                    <td>${totalPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="ticket-footer">
              <p class="note">Vui lòng xuất trình vé này cho nhân viên</p>
              <p class="note warning">Chúc quý khách có một chuyến đi vui vẻ và an toàn!</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Hàm giả lập tạo QR code (trong thực tế nên dùng thư viện chuyên dụng)
function generateQRCodeSVG(text) {
  return `
    <rect width="120" height="120" fill="#FFFFFF"/>
    <text x="60" y="65" font-family="Arial" font-size="14" text-anchor="middle" fill="#0072ff">QR Code</text>
    <text x="60" y="85" font-family="Arial" font-size="10" text-anchor="middle" fill="#888">${text.substring(0, 20)}...</text>
  `;
}

// API gửi email với PDF
router.post('/send-email/:id', ensurePool, async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra trạng thái email_sent
    const checkEmailSent = await req.app.locals.pool.request()
      .input('order_id', sql.Int, parseInt(id))
      .query(`
        SELECT email_sent
        FROM [web_travel].[dbo].[orders]
        WHERE id = @order_id
      `);

    if (checkEmailSent.recordset.length === 0) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    if (checkEmailSent.recordset[0].email_sent) {
      return res.status(400).json({ error: 'Email đã được gửi trước đó!', emailSent: true });
    }

    // Lấy thông tin đơn hàng
    const orderResult = await req.app.locals.pool.request()
      .input('order_id', sql.Int, parseInt(id))
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
          o.created_at AS order_date,
          t.tour_code,
          t.name AS tour_name
        FROM [web_travel].[dbo].[orders] o
        LEFT JOIN [web_travel].[dbo].[tours] t ON o.tour_id = t.id
        WHERE o.id = @order_id
      `);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Đơn hàng không tồn tại!' });
    }

    const order = orderResult.recordset[0];

    let leadCustomerResult = await req.app.locals.pool.request()
      .input('customer_id', sql.Int, order.customer_id)
      .query(`
        SELECT full_name, phone, email
        FROM [web_travel].[dbo].[customers]
        WHERE id = @customer_id
      `);

    let leadCustomer = leadCustomerResult.recordset[0] || {};
    order.full_name = leadCustomer.full_name || 'N/A';
    order.phone = leadCustomer.phone || 'N/A';
    order.email = leadCustomer.email || 'N/A';

    const customersResult = await req.app.locals.pool.request()
      .input('order_id', sql.Int, order.id)
      .query(`
        SELECT full_name, single_room, traveler_type
        FROM [web_travel].[dbo].[customers]
        WHERE order_id = @order_id
      `);

    order.customers = customersResult.recordset || [];

    const itineraryResult = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, order.tour_id)
      .query(`
        SELECT day_number, title
        FROM [web_travel].[dbo].[tour_itineraries]
        WHERE tour_id = @tour_id
        ORDER BY day_number ASC
      `);

    order.itinerary = itineraryResult.recordset.length > 0
      ? itineraryResult.recordset.map(item => `<strong>Ngày ${item.day_number}</strong>: ${item.title}`).join('                ')
      : 'TP.HCM   -   ' + (order.tour_name || 'Điểm đến') + '   -   TP.HCM';

    order.duration = order.start_date && order.end_date
      ? (() => {
          const start = new Date(order.start_date);
          const end = new Date(order.end_date);
          const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          return `${diffDays} ngày ${diffDays - 1} đêm`;
        })()
      : 'N/A';

    const pricesResult = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, order.tour_id)
      .query(`
        SELECT age_group, price, single_room_price
        FROM [web_travel].[dbo].[tour_prices]
        WHERE tour_id = @tour_id
      `);

    const prices = {};
    pricesResult.recordset.forEach(price => {
      prices[price.age_group] = {
        price: price.price,
        single_room_price: price.single_room_price || 0,
      };
    });
    order.prices = prices;

    const ticketHTML = generateTicketHTML(order);
    const pdfOptions = { format: 'A4' };
    const pdfBuffer = await new Promise((resolve, reject) => {
      pdf.create(ticketHTML, pdfOptions).toBuffer((err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      });
    });

    const mailOptions = {
      from: 'skytraveldntu@gmail.com',
      to: order.email,
      subject: `Vé Tour - Mã ${order.tour_code || 'N/A'}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #000000;">
          <p>Kính gửi Quý khách,</p>
          <p>Cảm ơn Quý khách đã tin tưởng và lựa chọn Sky Travel đồng hành trong hành trình sắp tới.</p>
          <p>Chúng tôi xin gửi kèm vé tour của Quý khách. Vui lòng kiểm tra lại thông tin để đảm bảo chính xác.</p>
          <p>Nếu cần hỗ trợ thêm, Quý khách vui lòng liên hệ với bộ phận chăm sóc khách hàng của chúng tôi.</p>
          <p>Kính chúc Quý khách một chuyến đi thật trọn vẹn và đáng nhớ!</p>
          <p>Trân trọng,<br>Sky Travel</p>
        </div>
      `,
      attachments: [
        {
          filename: `ve-tour-${order.tour_code || 'unknown'}.pdf`,
          content: pdfBuffer,
        },
      ],
    };
    
    await transporter.sendMail(mailOptions);

    // Cập nhật trạng thái email_sent
    await req.app.locals.pool.request()
      .input('order_id', sql.Int, parseInt(id))
      .query(`
        UPDATE [web_travel].[dbo].[orders]
        SET email_sent = 1
        WHERE id = @order_id
      `);

    res.status(200).json({ message: 'Email đã được gửi thành công!', emailSent: true });
  } catch (err) {
    console.error('Lỗi khi gửi email:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;