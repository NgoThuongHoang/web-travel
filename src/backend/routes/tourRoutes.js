const express = require("express");
const { sql } = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Định nghĩa domain của backend
const IMAGE_PATH = ""; // Đường dẫn đến ảnh, cần cấu hình nếu cần

// Middleware kiểm tra pool
const ensurePool = (req, res, next) => {
    if (!req.app.locals.pool) {
        return res
            .status(503)
            .json({ message: "Dịch vụ không sẵn sàng, lỗi kết nối database" });
    }
    next();
};

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// API upload ảnh
router.post("/upload", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ error: "Không có file được upload!" });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ url: imageUrl });
    } catch (err) {
        console.error("Lỗi upload ảnh:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API lấy danh sách tour
router.get("/", ensurePool, async (req, res) => {
    try {
        const { search, status } = req.query;

        let query = `
      SELECT t.*, tp.age_group, tp.price, tp.single_room_price, tp.description
      FROM [web_travel].[dbo].[tours] t
      LEFT JOIN [web_travel].[dbo].[tour_prices] tp ON t.id = tp.tour_id
    `;
        const params = {};

        // Khởi tạo điều kiện WHERE
        let whereClauses = [];

        // Xử lý tìm kiếm theo tên tour
        if (search) {
            // Tách chuỗi tìm kiếm thành các từ khóa
            const searchTerms = search.trim().split(/\s+/);
            let searchConditions = [];

            if (searchTerms.length > 1) {
                // Nếu có nhiều từ, tìm kiếm từng từ riêng lẻ trong name
                searchTerms.forEach((term, index) => {
                    searchConditions.push(
                        `t.name LIKE '%' + @search${index} + '%'`
                    );
                    params[`search${index}`] = term;
                });
            } else {
                // Nếu chỉ có 1 từ, tìm kiếm trực tiếp trong name
                searchConditions.push(`t.name LIKE '%' + @search + '%'`);
                params.search = searchTerms[0];
            }

            whereClauses.push(`(${searchConditions.join(" AND ")})`);
        }

        // Lọc theo status
        if (status && (status === "active" || status === "pending")) {
            whereClauses.push(`t.status = @status`);
            params.status = status;
        }

        // Kết hợp các điều kiện WHERE
        if (whereClauses.length > 0) {
            query += ` WHERE ${whereClauses.join(" AND ")}`;
        }

        console.log("Query:", query); // Log query để kiểm tra
        console.log("Params:", params); // Log params để kiểm tra

        const request = new sql.Request(req.app.locals.pool);
        // Thêm các tham số tìm kiếm vào request
        Object.keys(params).forEach((key) => {
            request.input(key, sql.NVarChar, params[key]);
        });

        const tourResult = await request.query(query);

        const imageResult = await req.app.locals.pool.request().query(`
      SELECT id, tour_id, image_url, caption
      FROM [web_travel].[dbo].[tour_images]
    `);

        const tours = {};
        tourResult.recordset.forEach((row) => {
            if (!tours[row.id]) {
                tours[row.id] = {
                    id: row.id,
                    name: row.name,
                    start_date: row.start_date,
                    status: row.status,
                    days: row.days,
                    nights: row.nights,
                    transportation: row.transportation,
                    departure_point: row.departure_point,
                    tour_code: row.tour_code,
                    star_rating: row.star_rating,
                    highlights: row.highlights
                        ? JSON.parse(row.highlights)
                        : [],
                    region: row.region,
                    country: row.country, 
                    suggestions: row.suggestions, 
                    total_tickets: row.total_tickets,
                    remaining_tickets: row.remaining_tickets,
                    prices: [],
                    images: [],
                };
            }
            if (row.age_group) {
                tours[row.id].prices.push({
                    age_group: row.age_group,
                    price: row.price,
                    single_room_price: row.single_room_price,
                    description: row.description,
                });
            }
        });

        imageResult.recordset.forEach((image) => {
            if (tours[image.tour_id]) {
                const fullImageUrl = `${IMAGE_PATH}${image.image_url}`;
                tours[image.tour_id].images.push({
                    id: image.id,
                    tour_id: image.tour_id,
                    image_url: fullImageUrl,
                    caption: image.caption,
                });
            }
        });

        const result = Object.values(tours);
        console.log("Tours found:", result); // Log kết quả để kiểm tra

        res.json(result);
    } catch (err) {
        console.error("Lỗi lấy danh sách tour:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API lấy thông tin một tour
router.get("/:id", ensurePool, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "ID không hợp lệ!" });
        }

        const tourResult = await req.app.locals.pool
            .request()
            .input("id", sql.Int, parseInt(id)).query(`
        SELECT t.*, tp.age_group, tp.price, tp.single_room_price, tp.description
        FROM [web_travel].[dbo].[tours] t
        LEFT JOIN [web_travel].[dbo].[tour_prices] tp ON t.id = tp.tour_id
        WHERE t.id = @id
      `);

        if (tourResult.recordset.length === 0) {
            return res.status(404).json({ error: "Tour không tồn tại!" });
        }

        const tour = {
            id: tourResult.recordset[0].id,
            name: tourResult.recordset[0].name,
            start_date: tourResult.recordset[0].start_date,
            status: tourResult.recordset[0].status,
            days: tourResult.recordset[0].days,
            nights: tourResult.recordset[0].nights,
            transportation: tourResult.recordset[0].transportation,
            departure_point: tourResult.recordset[0].departure_point,
            tour_code: tourResult.recordset[0].tour_code,
            star_rating: tourResult.recordset[0].star_rating,
            highlights: tourResult.recordset[0].highlights
                ? JSON.parse(tourResult.recordset[0].highlights)
                : [],
            itinerary: tourResult.recordset[0].itinerary,
            total_tickets: tourResult.recordset[0].total_tickets,
            remaining_tickets: tourResult.recordset[0].remaining_tickets,
            region: tourResult.recordset[0].region,
            country: tourResult.recordset[0].country, 
            suggestions: tourResult.recordset[0].suggestions, 
            prices: [],
            images: [],
        };

        tourResult.recordset.forEach((row) => {
            if (row.age_group) {
                tour.prices.push({
                    age_group: row.age_group,
                    price: row.price,
                    single_room_price: row.single_room_price,
                    description: row.description,
                });
            }
        });

        const imageResult = await req.app.locals.pool
            .request()
            .input("tour_id", sql.Int, parseInt(id)).query(`
        SELECT id, tour_id, image_url, caption
        FROM [web_travel].[dbo].[tour_images]
        WHERE tour_id = @tour_id
      `);

        tour.images = imageResult.recordset.map((image) => {
            const fullImageUrl = `${IMAGE_PATH}${image.image_url}`;
            console.log(`Image URL for tour ${id}: ${fullImageUrl}`);
            return {
                id: image.id,
                tour_id: image.tour_id,
                image_url: fullImageUrl,
                caption: image.caption,
            };
        });

        // Kiểm tra nếu remaining_tickets là null hoặc undefined
        if (
            tour.remaining_tickets === null ||
            tour.remaining_tickets === undefined
        ) {
            console.warn(
                `remaining_tickets is null or undefined for tour ${id}, defaulting to total_tickets`
            );
            tour.remaining_tickets = tour.total_tickets || 0;
        }

        console.log("Tour data being sent:", tour);
        res.json(tour);
    } catch (err) {
        console.error("Lỗi lấy chi tiết tour:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API tạo tour mới
router.post("/", ensurePool, async (req, res) => {
    try {
        const {
            name,
            start_date,
            status: rawStatus,
            days,
            nights,
            transportation,
            departure_point,
            star_rating,
            highlights,
            itinerary,
            prices,
            images,
            region = "Không xác định",
            country, // Thêm country
            suggestions, // Thêm suggestions
            total_tickets, // Thêm total_tickets vào body
        } = req.body;

        // Kiểm tra status
        const status = rawStatus || "active";
        if (status !== "active" && status !== "pending") {
            return res.status(400).json({
                error: "Trạng thái không hợp lệ! Chỉ chấp nhận 'active' hoặc 'pending'.",
            });
        }

        // Kiểm tra các trường bắt buộc
        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!start_date) missingFields.push("start_date");
        if (!status) missingFields.push("status");
        if (!days) missingFields.push("days");
        if (!nights) missingFields.push("nights");
        if (!transportation) missingFields.push("transportation");
        if (!departure_point) missingFields.push("departure_point");
        if (!star_rating) missingFields.push("star_rating");
        if (!highlights) missingFields.push("highlights");
        if (!itinerary) missingFields.push("itinerary");
        if (!total_tickets) missingFields.push("total_tickets"); // Kiểm tra total_tickets

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Thiếu các trường bắt buộc: ${missingFields.join(", ")}`,
            });
        }

        const maxTourCodeResult = await req.app.locals.pool.request().query(`
      SELECT MAX(tour_code) as max_tour_code
      FROM [web_travel].[dbo].[tours]
      WHERE tour_code LIKE 'TOUR-[0-9][0-9]'
    `);

        let newTourCodeNumber = 1;
        const maxTourCode = maxTourCodeResult.recordset[0].max_tour_code;

        if (maxTourCode) {
            const match = maxTourCode.match(/TOUR-(\d+)/);
            if (match) {
                newTourCodeNumber = parseInt(match[1]) + 1;
            }
        }

        const tour_code = `TOUR-${newTourCodeNumber
            .toString()
            .padStart(2, "0")}`;

        const tourResult = await req.app.locals.pool
            .request()
            .input("name", sql.NVarChar, name)
            .input("start_date", sql.DateTime, new Date(start_date))
            .input("status", sql.NVarChar, status)
            .input("days", sql.Int, days)
            .input("nights", sql.Int, nights)
            .input("transportation", sql.NVarChar, transportation)
            .input("departure_point", sql.NVarChar, departure_point)
            .input("tour_code", sql.NVarChar, tour_code)
            .input("star_rating", sql.Int, star_rating)
            .input(
                "highlights",
                sql.NVarChar(sql.MAX),
                JSON.stringify(highlights)
            )
            .input("region", sql.NVarChar, region)
            .input("country", sql.NVarChar, country || null) // Thêm country
            .input("suggestions", sql.NVarChar, suggestions || null) // Thêm suggestions
            .input("total_tickets", sql.Int, total_tickets) // Thêm total_tickets
            .input("remaining_tickets", sql.Int, total_tickets) // Khởi tạo remaining_tickets bằng total_tickets
            .query(`
        INSERT INTO [web_travel].[dbo].[tours] (
          name, start_date, status, days, nights, transportation, departure_point, 
          tour_code, star_rating, highlights, region, country, suggestions, total_tickets, remaining_tickets
        )
        VALUES (
          @name, @start_date, @status, @days, @nights, @transportation, @departure_point, 
          @tour_code, @star_rating, @highlights, @region, @country, @suggestions, @total_tickets, @remaining_tickets
        );
        SELECT SCOPE_IDENTITY() as id;
      `);

        const tourId = tourResult.recordset[0].id;

        if (itinerary && Array.isArray(itinerary)) {
            const itineraryInserts = itinerary.map((day) =>
                req.app.locals.pool
                    .request()
                    .input("tour_id", sql.Int, tourId)
                    .input("day_number", sql.Int, day.day_number)
                    .input("title", sql.NVarChar, day.title)
                    .input(
                        "details",
                        sql.NVarChar(sql.MAX),
                        JSON.stringify(day.details)
                    ).query(`
            INSERT INTO [web_travel].[dbo].[tour_itineraries] (tour_id, day_number, title, details)
            VALUES (@tour_id, @day_number, @title, @details)
          `)
            );
            await Promise.all(itineraryInserts);
        }

        if (prices && Array.isArray(prices)) {
            const priceInserts = prices.map((p) =>
                req.app.locals.pool
                    .request()
                    .input("tour_id", sql.Int, tourId)
                    .input("age_group", sql.NVarChar, p.age_group)
                    .input("price", sql.Decimal(18, 2), p.price)
                    .input(
                        "single_room_price",
                        sql.Decimal(18, 2),
                        p.single_room_price || null
                    )
                    .input("description", sql.NVarChar, p.description || null)
                    .query(`
            INSERT INTO [web_travel].[dbo].[tour_prices] (tour_id, age_group, price, single_room_price, description)
            VALUES (@tour_id, @age_group, @price, @single_room_price, @description)
          `)
            );
            await Promise.all(priceInserts);
        }

        if (images && Array.isArray(images)) {
            const imageInserts = images.map((img) =>
                req.app.locals.pool
                    .request()
                    .input("tour_id", sql.Int, tourId)
                    .input("image_url", sql.NVarChar, img.image_url)
                    .input("caption", sql.NVarChar, img.caption || null).query(`
            INSERT INTO [web_travel].[dbo].[tour_images] (tour_id, image_url, caption)
            VALUES (@tour_id, @image_url, @caption)
          `)
            );
            await Promise.all(imageInserts);
        }

        res.status(201).json({
            id: tourId,
            message: "Tour created successfully",
            tour_code,
        });
    } catch (err) {
        console.error("Lỗi tạo tour:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API cập nhật tour
router.put("/:id", ensurePool, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            start_date,
            status: rawStatus,
            days,
            nights,
            transportation,
            departure_point,
            star_rating,
            highlights,
            itinerary,
            prices,
            images,
            region = "Không xác định",
            country, // Thêm country
            suggestions, // Thêm suggestions
            total_tickets, // Thêm total_tickets vào body
        } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "ID không hợp lệ!" });
        }

        const status = rawStatus || "active";
        if (status !== "active" && status !== "pending") {
            return res.status(400).json({
                error: "Trạng thái không hợp lệ! Chỉ chấp nhận 'active' hoặc 'pending'.",
            });
        }

        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!start_date) missingFields.push("start_date");
        if (!status) missingFields.push("status");
        if (!days) missingFields.push("days");
        if (!nights) missingFields.push("nights");
        if (!transportation) missingFields.push("transportation");
        if (!departure_point) missingFields.push("departure_point");
        if (!star_rating) missingFields.push("star_rating");
        if (!highlights) missingFields.push("highlights");
        if (!itinerary) missingFields.push("itinerary");
        if (!total_tickets) missingFields.push("total_tickets"); // Kiểm tra total_tickets

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Thiếu các trường bắt buộc: ${missingFields.join(", ")}`,
            });
        }

        const tourCheck = await req.app.locals.pool
            .request()
            .input("id", sql.Int, parseInt(id))
            .query(
                "SELECT remaining_tickets FROM [web_travel].[dbo].[tours] WHERE id = @id"
            );

        if (tourCheck.recordset.length === 0) {
            return res.status(404).json({ error: "Tour không tồn tại!" });
        }

        const currentRemainingTickets =
            tourCheck.recordset[0].remaining_tickets;
        const bookedTickets =
            tourCheck.recordset[0].total_tickets - currentRemainingTickets;
        const newRemainingTickets = total_tickets - bookedTickets;

        await req.app.locals.pool
            .request()
            .input("id", sql.Int, parseInt(id))
            .input("name", sql.NVarChar, name)
            .input("start_date", sql.DateTime, new Date(start_date))
            .input("status", sql.NVarChar, status)
            .input("days", sql.Int, days)
            .input("nights", sql.Int, nights)
            .input("transportation", sql.NVarChar, transportation)
            .input("departure_point", sql.NVarChar, departure_point)
            .input("star_rating", sql.Int, star_rating)
            .input(
                "highlights",
                sql.NVarChar(sql.MAX),
                JSON.stringify(highlights)
            )
            .input("region", sql.NVarChar, region)
            .input("country", sql.NVarChar, country || null) // Thêm country
            .input("suggestions", sql.NVarChar, suggestions || null) // Thêm suggestions
            .input("total_tickets", sql.Int, total_tickets)
            .input("remaining_tickets", sql.Int, newRemainingTickets).query(`
        UPDATE [web_travel].[dbo].[tours]
        SET name = @name, start_date = @start_date, status = @status, days = @days, nights = @nights,
            transportation = @transportation, departure_point = @departure_point, star_rating = @star_rating,
            highlights = @highlights, region = @region, country = @country, suggestions = @suggestions, total_tickets = @total_tickets, remaining_tickets = @remaining_tickets
        WHERE id = @id
      `);

        await req.app.locals.pool
            .request()
            .input("tour_id", sql.Int, parseInt(id))
            .query(
                "DELETE FROM [web_travel].[dbo].[tour_itineraries] WHERE tour_id = @tour_id"
            );

        if (itinerary && Array.isArray(itinerary)) {
            const itineraryInserts = itinerary.map((day) =>
                req.app.locals.pool
                    .request()
                    .input("tour_id", sql.Int, parseInt(id))
                    .input("day_number", sql.Int, day.day_number)
                    .input("title", sql.NVarChar, day.title)
                    .input(
                        "details",
                        sql.NVarChar(sql.MAX),
                        JSON.stringify(day.details)
                    ).query(`
            INSERT INTO [web_travel].[dbo].[tour_itineraries] (tour_id, day_number, title, details)
            VALUES (@tour_id, @day_number, @title, @details)
          `)
            );
            await Promise.all(itineraryInserts);
        }

        await req.app.locals.pool
            .request()
            .input("tour_id", sql.Int, parseInt(id))
            .query(
                "DELETE FROM [web_travel].[dbo].[tour_prices] WHERE tour_id = @tour_id"
            );

        if (prices && Array.isArray(prices)) {
            const priceInserts = prices.map((p) =>
                req.app.locals.pool
                    .request()
                    .input("tour_id", sql.Int, parseInt(id))
                    .input("age_group", sql.NVarChar, p.age_group)
                    .input("price", sql.Decimal(18, 2), p.price)
                    .input(
                        "single_room_price",
                        sql.Decimal(18, 2),
                        p.single_room_price || null
                    )
                    .input("description", sql.NVarChar, p.description || null)
                    .query(`
            INSERT INTO [web_travel].[dbo].[tour_prices] (tour_id, age_group, price, single_room_price, description)
            VALUES (@tour_id, @age_group, @price, @single_room_price, @description)
          `)
            );
            await Promise.all(priceInserts);
        }

        await req.app.locals.pool
            .request()
            .input("tour_id", sql.Int, parseInt(id))
            .query(
                "DELETE FROM [web_travel].[dbo].[tour_images] WHERE tour_id = @tour_id"
            );

        if (images && Array.isArray(images)) {
            const imageInserts = images.map((img) =>
                req.app.locals.pool
                    .request()
                    .input("tour_id", sql.Int, parseInt(id))
                    .input("image_url", sql.NVarChar, img.image_url)
                    .input("caption", sql.NVarChar, img.caption || null).query(`
            INSERT INTO [web_travel].[dbo].[tour_images] (tour_id, image_url, caption)
            VALUES (@tour_id, @image_url, @caption)
          `)
            );
            await Promise.all(imageInserts);
        }

        res.status(200).json({ message: "Cập nhật tour thành công!" });
    } catch (err) {
        console.error("Lỗi cập nhật tour:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API lấy lịch trình của tour
router.get("/:tourId/itineraries", ensurePool, async (req, res) => {
    try {
        const { tourId } = req.params;

        if (!tourId || isNaN(tourId)) {
            return res.status(400).json({ error: "Tour ID không hợp lệ!" });
        }

        const result = await req.app.locals.pool
            .request()
            .input("tour_id", sql.Int, parseInt(tourId)).query(`
        SELECT *
        FROM [web_travel].[dbo].[tour_itineraries]
        WHERE tour_id = @tour_id
      `);

        if (result.recordset.length === 0) {
            return res
                .status(404)
                .json({ error: "Không tìm thấy lịch trình cho tour này!" });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy lịch trình:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API lấy khách sạn của tour
router.get("/:tourId/hotels", ensurePool, async (req, res) => {
    try {
        const { tourId } = req.params;

        if (!tourId || isNaN(tourId)) {
            return res.status(400).json({ error: "Tour ID không hợp lệ!" });
        }

        const result = await req.app.locals.pool
            .request()
            .input("tour_id", sql.Int, parseInt(tourId)).query(`
        SELECT th.*, h.name AS hotel_name, h.address
        FROM [web_travel].[dbo].[tour_hotels] th
        JOIN [web_travel].[dbo].[hotels] h ON th.hotel_id = h.id
        WHERE th.tour_id = @tour_id
      `);

        if (result.recordset.length === 0) {
            return res
                .status(404)
                .json({ error: "Không tìm thấy khách sạn cho tour này!" });
        }

        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi lấy khách sạn:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API xóa tour
router.delete("/:id", ensurePool, async (req, res) => {
    const pool = req.app.locals.pool;
    const transaction = new sql.Transaction(pool);

    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "ID không hợp lệ!" });
        }

        const tourId = parseInt(id);

        await transaction.begin();

        const checkRequest = transaction.request();
        const tourCheck = await checkRequest
            .input("id", sql.Int, tourId)
            .query("SELECT 1 FROM [web_travel].[dbo].[tours] WHERE id = @id");

        if (tourCheck.recordset.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ error: "Tour không tồn tại!" });
        }

        const deleteOrdersRequest = transaction.request();
        const deleteOrdersResult = await deleteOrdersRequest
            .input("tour_id", sql.Int, tourId)
            .query(
                "DELETE FROM [web_travel].[dbo].[orders] WHERE tour_id = @tour_id"
            );
        console.log(
            `Deleted ${deleteOrdersResult.rowsAffected} rows from orders for tour_id ${tourId}`
        );

        const itineraryRequest = transaction.request();
        const itineraries = await itineraryRequest
            .input("tour_id", sql.Int, tourId)
            .query(
                "SELECT id FROM [web_travel].[dbo].[tour_itineraries] WHERE tour_id = @tour_id"
            );

        const itineraryIds = itineraries.recordset.map((item) => item.id);
        console.log("Itinerary IDs to delete:", itineraryIds);

        if (itineraryIds.length > 0) {
            for (let i = 0; i < itineraryIds.length; i++) {
                const itineraryId = itineraryIds[i];
                const deleteTicketsRequest = transaction.request();
                const deleteTicketsResult = await deleteTicketsRequest
                    .input(`itinerary_id_${i}`, sql.Int, itineraryId)
                    .query(
                        "DELETE FROM [web_travel].[dbo].[tour_tickets] WHERE itinerary_id = @itinerary_id_" +
                            i
                    );
                console.log(
                    `Deleted ${deleteTicketsResult.rowsAffected} rows from tour_tickets for itinerary_id ${itineraryId}`
                );
            }
        }

        const deleteItinerariesRequest = transaction.request();
        const deleteItinerariesResult = await deleteItinerariesRequest
            .input("tour_id", sql.Int, tourId)
            .query(
                "DELETE FROM [web_travel].[dbo].[tour_itineraries] WHERE tour_id = @tour_id"
            );
        console.log(
            `Deleted ${deleteItinerariesResult.rowsAffected} rows from tour_itineraries for tour_id ${tourId}`
        );

        const deletePricesRequest = transaction.request();
        await deletePricesRequest
            .input("tour_id", sql.Int, tourId)
            .query(
                "DELETE FROM [web_travel].[dbo].[tour_prices] WHERE tour_id = @tour_id"
            );

        const deleteImagesRequest = transaction.request();
        await deleteImagesRequest
            .input("tour_id", sql.Int, tourId)
            .query(
                "DELETE FROM [web_travel].[dbo].[tour_images] WHERE tour_id = @tour_id"
            );

        const deleteHotelsRequest = transaction.request();
        await deleteHotelsRequest
            .input("tour_id", sql.Int, tourId)
            .query(
                "DELETE FROM [web_travel].[dbo].[tour_hotels] WHERE tour_id = @tour_id"
            );

        const deleteTourRequest = transaction.request();
        await deleteTourRequest
            .input("id", sql.Int, tourId)
            .query("DELETE FROM [web_travel].[dbo].[tours] WHERE id = @id");

        await transaction.commit();

        res.status(204).send();
    } catch (err) {
        await transaction.rollback();
        console.error("Lỗi xóa tour:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API đặt tour
router.post("/:tourId/book", ensurePool, async (req, res) => {
    const transaction = new sql.Transaction(req.app.locals.pool);

    try {
        await transaction.begin();

        const { tourId } = req.params;
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
            lead_single_room,
            pickup_point,
            special_requests,
            payment_method,
            total_amount,
            travelers,
        } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!full_name || !phone || !email || !gender || !birth_date) {
            await transaction.rollback();
            return res.status(400).json({
                error: "Thiếu thông tin người đặt tour (full_name, phone, email, gender, birth_date là bắt buộc)!",
            });
        }

        // Kiểm tra tour tồn tại và lấy remaining_tickets mới nhất
        const tourCheck = await transaction
            .request()
            .input("tour_id", sql.Int, parseInt(tourId)).query(`
        SELECT total_tickets, remaining_tickets, name, tour_code
        FROM [web_travel].[dbo].[tours]
        WHERE id = @tour_id
      `);

        if (tourCheck.recordset.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ error: "Tour không tồn tại!" });
        }

        const tour = tourCheck.recordset[0];
        const total_booked_tickets =
            (adults || 0) + (children_under_5 || 0) + (children_5_11 || 0);

        // Kiểm tra số vé còn lại
        if (tour.remaining_tickets < total_booked_tickets) {
            await transaction.rollback();
            return res.status(400).json({
                error: `Không đủ vé! Chỉ còn ${tour.remaining_tickets} vé.`,
            });
        }

        // Thêm khách hàng chính (lead customer) vào bảng customers
        const customerResult = await transaction
            .request()
            .input("full_name", sql.NVarChar, full_name)
            .input("phone", sql.NVarChar, phone)
            .input("email", sql.NVarChar, email || null)
            .input("gender", sql.NVarChar, gender)
            .input(
                "birth_date",
                sql.Date,
                birth_date ? new Date(birth_date) : null
            )
            .input("address", sql.NVarChar, pickup_point)
            .input("tour_id", sql.Int, parseInt(tourId))
            .input("traveler_type", sql.NVarChar, "Lead")
            .input("single_room", sql.Bit, lead_single_room ? 1 : 0).query(`
        INSERT INTO [web_travel].[dbo].[customers] (full_name, phone, email, gender, birth_date, address, tour_id, traveler_type, single_room)
        OUTPUT INSERTED.id
        VALUES (@full_name, @phone, @email, @gender, @birth_date, @address, @tour_id, @traveler_type, @single_room)
      `);

        const customerId = customerResult.recordset[0].id;

        // Thêm đơn hàng vào bảng orders
        const orderResult = await transaction
            .request()
            .input("tour_id", sql.Int, parseInt(tourId))
            .input("customer_id", sql.Int, customerId)
            .input(
                "start_date",
                sql.Date,
                start_date ? new Date(start_date) : null
            )
            .input("end_date", sql.Date, end_date ? new Date(end_date) : null)
            .input("adults", sql.Int, adults || 0)
            .input("children_under_5", sql.Int, children_under_5 || 0)
            .input("children_5_11", sql.Int, children_5_11 || 0)
            .input("single_rooms", sql.Int, single_rooms || 0)
            .input("pickup_point", sql.NVarChar, pickup_point)
            .input("special_requests", sql.NVarChar, special_requests)
            .input("payment_method", sql.NVarChar, payment_method)
            .input("total_amount", sql.Int, total_amount || 0)
            .input("status", sql.NVarChar, "pending").query(`
        INSERT INTO [web_travel].[dbo].[orders] (tour_id, customer_id, start_date, end_date, adults, children_under_5, children_5_11, single_rooms, pickup_point, special_requests, payment_method, total_amount, status)
        OUTPUT INSERTED.id
        VALUES (@tour_id, @customer_id, @start_date, @end_date, @adults, @children_under_5, @children_5_11, @single_rooms, @pickup_point, @special_requests, @payment_method, @total_amount, @status)
      `);

        const orderId = orderResult.recordset[0].id;

        // Cập nhật order_id cho lead customer
        await transaction
            .request()
            .input("order_id", sql.Int, orderId)
            .input("customer_id", sql.Int, customerId).query(`
        UPDATE [web_travel].[dbo].[customers]
        SET order_id = @order_id
        WHERE id = @customer_id
      `);

        // Thêm các khách hàng đi cùng (travelers) vào bảng customers
        if (travelers && Array.isArray(travelers) && travelers.length > 0) {
            for (const traveler of travelers) {
                if (
                    !traveler.full_name ||
                    !traveler.gender ||
                    !traveler.birth_date
                ) {
                    await transaction.rollback();
                    return res.status(400).json({
                        error: "Thiếu thông tin khách hàng đi cùng (full_name, gender, birth_date là bắt buộc)!",
                    });
                }
                await transaction
                    .request()
                    .input(
                        "full_name",
                        sql.NVarChar,
                        traveler.full_name || null
                    )
                    .input("gender", sql.NVarChar, traveler.gender || null)
                    .input(
                        "birth_date",
                        sql.Date,
                        traveler.birth_date
                            ? new Date(traveler.birth_date)
                            : null
                    )
                    .input("phone", sql.NVarChar, traveler.phone || null)
                    .input("address", sql.NVarChar, traveler.address || null)
                    .input("order_id", sql.Int, orderId)
                    .input("tour_id", sql.Int, parseInt(tourId))
                    .input("single_room", sql.Bit, traveler.single_room ? 1 : 0)
                    .input(
                        "traveler_type",
                        sql.NVarChar,
                        traveler.traveler_type || "Người lớn"
                    ).query(`
            INSERT INTO [web_travel].[dbo].[customers] (full_name, gender, birth_date, phone, address, order_id, tour_id, single_room, traveler_type)
            VALUES (@full_name, @gender, @birth_date, @phone, @address, @order_id, @tour_id, @single_room, @traveler_type)
          `);

                console.log(
                    `Đã thêm traveler: ${traveler.full_name} cho order ${orderId}`
                );
            }
        } else {
            console.log(
                "Không có travelers để thêm hoặc travelers không phải mảng:",
                travelers
            );
        }

        // KHÔNG trừ remaining_tickets tại đây

        await transaction.commit();

        res.status(201).json({
            message: "Đặt tour thành công!",
            order_id: orderId,
        });
    } catch (err) {
        await transaction.rollback();
        console.error("Lỗi khi đặt tour:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

// API lấy thông tin tour theo ID
router.get("/:tourId", ensurePool, async (req, res) => {
    try {
        const { tourId } = req.params;

        if (!tourId || isNaN(tourId)) {
            return res.status(400).json({ error: "Tour ID không hợp lệ!" });
        }

        const tourResult = await req.app.locals.pool
            .request()
            .input("tour_id", sql.Int, parseInt(tourId)).query(`
        SELECT t.*
        FROM [web_travel].[dbo].[tours] t
        WHERE t.id = @tour_id
      `);

        if (tourResult.recordset.length === 0) {
            return res.status(404).json({ error: "Tour không tồn tại!" });
        }

        const tour = tourResult.recordset[0];

        // Kiểm tra và log giá trị remaining_tickets
        console.log("Tour data:", tour);
        console.log("Remaining tickets:", tour.remaining_tickets);

        // Kiểm tra nếu remaining_tickets là null hoặc undefined
        if (
            tour.remaining_tickets === null ||
            tour.remaining_tickets === undefined
        ) {
            console.warn(
                `remaining_tickets is null or undefined for tour ${tourId}, defaulting to total_tickets`
            );
            tour.remaining_tickets = tour.total_tickets || 0;
        }

        const pricesResult = await req.app.locals.pool
            .request()
            .input("tour_id", sql.Int, parseInt(tourId)).query(`
        SELECT age_group, price, single_room_price, description
        FROM [web_travel].[dbo].[tour_prices]
        WHERE tour_id = @tour_id
      `);

        const imagesResult = await req.app.locals.pool
            .request()
            .input("tour_id", sql.Int, parseInt(tourId)).query(`
        SELECT id, tour_id, image_url, caption
        FROM [web_travel].[dbo].[tour_images]
        WHERE tour_id = @tour_id
      `);

        const tourData = {
            id: tour.id,
            name: tour.name,
            start_date: tour.start_date,
            status: tour.status,
            days: tour.days,
            nights: tour.nights,
            transportation: tour.transportation,
            departure_point: tour.departure_point,
            tour_code: tour.tour_code,
            star_rating: tour.star_rating,
            highlights: tour.highlights ? JSON.parse(tour.highlights) : [],
            region: tour.region,
            country: tour.country, // Thêm country
            suggestions: tour.suggestions, // Thêm suggestions
            total_tickets: tour.total_tickets,
            remaining_tickets: tour.remaining_tickets,
            prices: pricesResult.recordset,
            images: imagesResult.recordset.map((image) => ({
                id: image.id,
                tour_id: image.tour_id,
                image_url: `${IMAGE_PATH}${image.image_url}`,
                caption: image.caption,
            })),
        };

        console.log("Tour data being sent:", tourData);
        res.status(200).json(tourData);
    } catch (err) {
        console.error("Lỗi lấy thông tin tour:", err);
        res.status(500).json({ error: "Lỗi server: " + err.message });
    }
});

module.exports = router;
