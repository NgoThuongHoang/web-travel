const express = require("express");
const { sql } = require("../db");

const router = express.Router();

// Middleware kiểm tra pool
const ensurePool = (req, res, next) => {
    if (!req.app.locals.pool) {
        return res
            .status(503)
            .json({ message: "Dịch vụ không sẵn sàng, lỗi kết nối database" });
    }
    next();
};

// API lấy danh sách khách hàng (hỗ trợ tìm kiếm, phân trang)
router.get("/", ensurePool, async (req, res) => {
    try {
        const { search, page = 1, pageSize = 5 } = req.query;

        let whereClause = "";
        const params = {};

        // Tìm kiếm theo full_name, email hoặc phone
        if (search) {
            whereClause = ` WHERE (c.full_name LIKE @search OR c.email LIKE @search OR c.phone LIKE @search)`;
            params.search = `%${search}%`;
        }

        // Đếm tổng số khách hàng
        const countQuery = `
      SELECT COUNT(*) as total 
      FROM [web_travel].[dbo].[customers] c
      ${whereClause}
    `;
        const countResult = await req.app.locals.pool
            .request()
            .input("search", sql.NVarChar, params.search)
            .query(countQuery);

        const total = countResult.recordset[0].total;

        // Truy vấn chính với phân trang, JOIN với orders và tours để lấy thông tin tour
        const offset = (page - 1) * pageSize;
        const query = `
      SELECT 
        c.id,
        c.full_name,
        c.phone,
        c.email,
        c.address,
        c.created_at,
        t.id as tour_id,
        t.name as tour_name,
        t.tour_code,
        o.id as order_id,
        o.customer_id as order_customer_id -- Lấy customer_id của người đặt tour
      FROM [web_travel].[dbo].[customers] c
      LEFT JOIN [web_travel].[dbo].[orders] o ON c.order_id = o.id
      LEFT JOIN [web_travel].[dbo].[tours] t ON o.tour_id = t.id
      ${whereClause}
      ORDER BY c.id 
      OFFSET ${offset} ROWS 
      FETCH NEXT ${pageSize} ROWS ONLY
    `;

        const result = await req.app.locals.pool
            .request()
            .input("search", sql.NVarChar, params.search)
            .query(query);

        // Chuẩn hóa dữ liệu trả về
        const customers = result.recordset.reduce((acc, customer) => {
            const existingCustomer = acc.find((c) => c.id === customer.id);
            const tour = customer.tour_id
                ? {
                      tour_id: customer.tour_id,
                      name: customer.tour_name,
                      tour_code: customer.tour_code,
                      order_id: customer.order_id,
                      order_customer_id: customer.order_customer_id, // Lưu customer_id của người đặt tour
                  }
                : null;

            if (existingCustomer) {
                if (tour) {
                    existingCustomer.tours = existingCustomer.tours || [];
                    existingCustomer.tours.push(tour);
                }
            } else {
                acc.push({
                    id: customer.id,
                    fullName: customer.full_name,
                    phone: customer.phone,
                    email: customer.email,
                    address: customer.address,
                    created_at: customer.created_at,
                    tours: tour ? [tour] : [],
                });
            }
            return acc;
        }, []);

        // Lấy thông tin người đặt tour và các khách hàng trong cùng đơn đặt tour
        for (let customer of customers) {
            if (customer.tours && customer.tours.length > 0) {
                for (let tour of customer.tours) {
                    // Lấy thông tin người đặt tour (chủ đơn đặt tour)
                    const orderCustomerQuery = `
            SELECT 
              c.id,
              c.full_name AS fullName
            FROM [web_travel].[dbo].[customers] c
            WHERE c.id = @orderCustomerId
          `;
                    const orderCustomerResult = await req.app.locals.pool
                        .request()
                        .input(
                            "orderCustomerId",
                            sql.Int,
                            tour.order_customer_id
                        )
                        .query(orderCustomerQuery);

                    // Lấy tất cả khách hàng trong cùng đơn đặt tour (ngoài khách hàng hiện tại nếu không phải người đặt tour)
                    const participantsQuery = `
            SELECT 
              c.id,
              c.full_name AS fullName
            FROM [web_travel].[dbo].[customers] c
            WHERE c.order_id = @orderId AND c.id != @customerId
          `;
                    const participantsResult = await req.app.locals.pool
                        .request()
                        .input("orderId", sql.Int, tour.order_id)
                        .input("customerId", sql.Int, customer.id)
                        .query(participantsQuery);

                    tour.orderCustomer =
                        orderCustomerResult.recordset[0] || null; // Người đặt tour
                    tour.participants = participantsResult.recordset; // Các khách hàng trong cùng đơn đặt tour
                }
            }
        }

        res.json({ customers, total });
    } catch (err) {
        console.error("Lỗi lấy danh sách khách hàng:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API lấy thông tin chi tiết khách hàng theo ID
router.get("/:id", ensurePool, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await req.app.locals.pool
            .request()
            .input("id", sql.Int, parseInt(id)).query(`
        SELECT 
          c.id,
          c.full_name,
          c.phone,
          c.email,
          c.address,
          c.created_at,
          t.id as tour_id,
          t.name as tour_name,
          t.tour_code,
          o.id as order_id,
          o.customer_id as order_customer_id
        FROM [web_travel].[dbo].[customers] c
        LEFT JOIN [web_travel].[dbo].[orders] o ON c.order_id = o.id
        LEFT JOIN [web_travel].[dbo].[tours] t ON o.tour_id = t.id
        WHERE c.id = @id
      `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Khách hàng không tồn tại!" });
        }

        // Chuẩn hóa dữ liệu trả về
        const customerData = result.recordset[0];
        const customer = {
            id: customerData.id,
            fullName: customerData.full_name,
            phone: customerData.phone,
            email: customerData.email,
            address: customerData.address,
            created_at: customerData.created_at,
            tours: [],
        };

        // Thêm thông tin tour vào mảng tours
        result.recordset.forEach((row) => {
            if (row.tour_id) {
                customer.tours.push({
                    tour_id: row.tour_id,
                    name: row.tour_name,
                    tour_code: row.tour_code,
                    order_id: row.order_id,
                    order_customer_id: row.order_customer_id,
                });
            }
        });

        // Lấy thông tin người đặt tour và các khách hàng trong cùng đơn đặt tour
        for (let tour of customer.tours) {
            // Lấy thông tin người đặt tour (chủ đơn đặt tour)
            const orderCustomerQuery = `
        SELECT 
          c.id,
          c.full_name AS fullName
        FROM [web_travel].[dbo].[customers] c
        WHERE c.id = @orderCustomerId
      `;
            const orderCustomerResult = await req.app.locals.pool
                .request()
                .input("orderCustomerId", sql.Int, tour.order_customer_id)
                .query(orderCustomerQuery);

            // Lấy tất cả khách hàng trong cùng đơn đặt tour (ngoài khách hàng hiện tại nếu không phải người đặt tour)
            const participantsQuery = `
        SELECT 
          c.id,
          c.full_name AS fullName
        FROM [web_travel].[dbo].[customers] c
        WHERE c.order_id = @orderId AND c.id != @customerId
      `;
            const participantsResult = await req.app.locals.pool
                .request()
                .input("orderId", sql.Int, tour.order_id)
                .input("customerId", sql.Int, customer.id)
                .query(participantsQuery);

            tour.orderCustomer = orderCustomerResult.recordset[0] || null; // Người đặt tour
            tour.participants = participantsResult.recordset; // Các khách hàng trong cùng đơn đặt tour
        }

        res.json(customer);
    } catch (err) {
        console.error("Lỗi lấy thông tin khách hàng:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API thêm khách hàng mới
router.post("/", ensurePool, async (req, res) => {
    try {
        const { fullName, phone, email, address } = req.body;

        await req.app.locals.pool
            .request()
            .input("full_name", sql.NVarChar, fullName)
            .input("phone", sql.NVarChar, phone)
            .input("email", sql.NVarChar, email)
            .input("address", sql.NVarChar, address)
            .input("created_at", sql.DateTime, new Date()).query(`
        INSERT INTO [web_travel].[dbo].[customers] (
          full_name, phone, email, address, created_at
        )
        VALUES (
          @full_name, @phone, @email, @address, @created_at
        )
      `);

        res.status(201).json({ message: "Thêm khách hàng thành công!" });
    } catch (err) {
        console.error("Lỗi thêm khách hàng:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API cập nhật thông tin khách hàng
router.put("/:id", ensurePool, async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, phone, email, address } = req.body;

        const customerCheck = await req.app.locals.pool
            .request()
            .input("id", sql.Int, parseInt(id))
            .query(
                "SELECT * FROM [web_travel].[dbo].[customers] WHERE id = @id"
            );

        if (customerCheck.recordset.length === 0) {
            return res.status(404).json({ error: "Khách hàng không tồn tại!" });
        }

        await req.app.locals.pool
            .request()
            .input("id", sql.Int, parseInt(id))
            .input("full_name", sql.NVarChar, fullName)
            .input("phone", sql.NVarChar, phone)
            .input("email", sql.NVarChar, email)
            .input("address", sql.NVarChar, address).query(`
    UPDATE [web_travel].[dbo].[customers]
    SET full_name = @full_name, 
        phone = @phone, 
        email = @email, 
        address = @address
    WHERE id = @id
  `);

        res.status(200).json({ message: "Cập nhật khách hàng thành công!" });
    } catch (err) {
        console.error("Lỗi cập nhật khách hàng:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API xóa khách hàng
router.delete("/:id", ensurePool, async (req, res) => {
    try {
        const { id } = req.params;

        const customerCheck = await req.app.locals.pool
            .request()
            .input("id", sql.Int, parseInt(id))
            .query(
                "SELECT * FROM [web_travel].[dbo].[customers] WHERE id = @id"
            );

        if (customerCheck.recordset.length === 0) {
            return res.status(404).json({ error: "Khách hàng không tồn tại!" });
        }

        await req.app.locals.pool
            .request()
            .input("id", sql.Int, parseInt(id))
            .query("DELETE FROM [web_travel].[dbo].[customers] WHERE id = @id");

        res.status(200).json({ message: "Xóa khách hàng thành công!" });
    } catch (err) {
        console.error("Lỗi xóa khách hàng:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

module.exports = router;
