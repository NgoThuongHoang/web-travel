const express = require('express');
const { sql } = require('../db');
const multer = require('multer'); // Thêm import multer
const path = require('path'); // Thêm import path
const fs = require('fs'); // Thêm import fs

const router = express.Router();

// Định nghĩa domain của backend (bỏ BACKEND_URL)
const IMAGE_PATH = ''; // Đường dẫn mới

// Middleware kiểm tra pool
const ensurePool = (req, res, next) => {
  if (!req.app.locals.pool) {
    return res.status(503).json({ message: 'Dịch vụ không sẵn sàng, lỗi kết nối database' });
  }
  next();
};

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads'); // Thư mục lưu ảnh
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Thêm recursive để tạo thư mục nếu chưa tồn tại
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// API upload ảnh
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file được upload!' });
    }
    const imageUrl = `/uploads/${req.file.filename}`; // Đường dẫn ảnh
    res.status(200).json({ url: imageUrl });
  } catch (err) {
    console.error('Lỗi upload ảnh:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API lấy danh sách tour
router.get('/', ensurePool, async (req, res) => {
  try {
    const tourResult = await req.app.locals.pool.request().query(`
      SELECT t.*, tp.age_group, tp.price, tp.single_room_price, tp.description
      FROM [web_travel].[dbo].[tours] t
      LEFT JOIN [web_travel].[dbo].[tour_prices] tp ON t.id = tp.tour_id
    `);

    const imageResult = await req.app.locals.pool.request().query(`
      SELECT id, tour_id, image_url, caption
      FROM [web_travel].[dbo].[tour_images]
    `);

    const tours = {};
    tourResult.recordset.forEach(row => {
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
          highlights: row.highlights ? JSON.parse(row.highlights) : [],
          prices: [],
          images: []
        };
      }
      if (row.age_group) {
        tours[row.id].prices.push({
          age_group: row.age_group,
          price: row.price,
          single_room_price: row.single_room_price,
          description: row.description
        });
      }
    });

    imageResult.recordset.forEach(image => {
      if (tours[image.tour_id]) {
        const fullImageUrl = `${IMAGE_PATH}${image.image_url}`;
        tours[image.tour_id].images.push({
          id: image.id,
          tour_id: image.tour_id,
          image_url: fullImageUrl,
          caption: image.caption
        });
      }
    });

    res.json(Object.values(tours));
  } catch (err) {
    console.error('Lỗi lấy danh sách tour:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API lấy thông tin một tour
router.get('/:id', ensurePool, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ!' });
    }

    const tourResult = await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .query(`
        SELECT t.*, tp.age_group, tp.price, tp.single_room_price, tp.description
        FROM [web_travel].[dbo].[tours] t
        LEFT JOIN [web_travel].[dbo].[tour_prices] tp ON t.id = tp.tour_id
        WHERE t.id = @id
      `);

    if (tourResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Tour không tồn tại!' });
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
      highlights: tourResult.recordset[0].highlights,
      itinerary: tourResult.recordset[0].itinerary,
      prices: [],
      images: []
    };

    tourResult.recordset.forEach(row => {
      if (row.age_group) {
        tour.prices.push({
          age_group: row.age_group,
          price: row.price,
          single_room_price: row.single_room_price,
          description: row.description
        });
      }
    });

    const imageResult = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, parseInt(id))
      .query(`
        SELECT id, tour_id, image_url, caption
        FROM [web_travel].[dbo].[tour_images]
        WHERE tour_id = @tour_id
      `);

    // Thêm ảnh
    tour.images = imageResult.recordset.map(image => {
      const fullImageUrl = `${IMAGE_PATH}${image.image_url}`; // Chỉ giữ image_url gốc
      console.log(`Image URL for tour ${id}: ${fullImageUrl}`);
      return {
        id: image.id,
        tour_id: image.tour_id,
        image_url: fullImageUrl,
        caption: image.caption
      };
    });

    res.json(tour);
  } catch (err) {
    console.error('Lỗi lấy chi tiết tour:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API tạo tour mới
router.post('/', ensurePool, async (req, res) => {
  try {
    const { name, start_date, status, days, nights, transportation, departure_point, star_rating, highlights, itinerary, prices, images } = req.body;

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

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Thiếu các trường bắt buộc: ${missingFields.join(", ")}` });
    }

    // Lấy tour_code lớn nhất hiện có
    const maxTourCodeResult = await req.app.locals.pool.request().query(`
      SELECT MAX(tour_code) as max_tour_code
      FROM [web_travel].[dbo].[tours]
      WHERE tour_code LIKE 'TOUR-[0-9][0-9]'
    `);

    let newTourCodeNumber = 1; // Mặc định bắt đầu từ 1
    const maxTourCode = maxTourCodeResult.recordset[0].max_tour_code;

    if (maxTourCode) {
      // Lấy số thứ tự từ tour_code lớn nhất (ví dụ: TOUR-05 -> lấy 05)
      const match = maxTourCode.match(/TOUR-(\d+)/);
      if (match) {
        newTourCodeNumber = parseInt(match[1]) + 1; // Tăng số thứ tự lên 1
      }
    }

    // Tạo tour_code mới với định dạng TOUR-XX (ví dụ: TOUR-01, TOUR-02, ...)
    const tour_code = `TOUR-${newTourCodeNumber.toString().padStart(2, '0')}`; // Đảm bảo số có 2 chữ số (01, 02, ...)

    // Thêm tour vào bảng dbo.tours
    const tourResult = await req.app.locals.pool.request()
      .input('name', sql.NVarChar, name)
      .input('start_date', sql.DateTime, new Date(start_date))
      .input('status', sql.NVarChar, status)
      .input('days', sql.Int, days)
      .input('nights', sql.Int, nights)
      .input('transportation', sql.NVarChar, transportation)
      .input('departure_point', sql.NVarChar, departure_point)
      .input('tour_code', sql.NVarChar, tour_code)
      .input('star_rating', sql.Int, star_rating)
      .input('highlights', sql.NVarChar(sql.MAX), JSON.stringify(highlights))
      .query(`
        INSERT INTO [web_travel].[dbo].[tours] (name, start_date, status, days, nights, transportation, departure_point, tour_code, star_rating, highlights)
        VALUES (@name, @start_date, @status, @days, @nights, @transportation, @departure_point, @tour_code, @star_rating, @highlights);
        SELECT SCOPE_IDENTITY() as id;
      `);

    const tourId = tourResult.recordset[0].id;

    // Lưu itinerary vào bảng dbo.tour_itineraries
    if (itinerary && Array.isArray(itinerary)) {
      const itineraryInserts = itinerary.map(day =>
        req.app.locals.pool.request()
          .input('tour_id', sql.Int, tourId)
          .input('day_number', sql.Int, day.day_number)
          .input('title', sql.NVarChar, day.title)
          .input('details', sql.NVarChar(sql.MAX), JSON.stringify(day.details))
          .query(`
            INSERT INTO [web_travel].[dbo].[tour_itineraries] (tour_id, day_number, title, details)
            VALUES (@tour_id, @day_number, @title, @details)
          `)
      );
      await Promise.all(itineraryInserts);
    }

    // Lưu prices vào bảng dbo.tour_prices
    if (prices && Array.isArray(prices)) {
      const priceInserts = prices.map(p =>
        req.app.locals.pool.request()
          .input('tour_id', sql.Int, tourId)
          .input('age_group', sql.NVarChar, p.age_group)
          .input('price', sql.Decimal(18, 2), p.price)
          .input('single_room_price', sql.Decimal(18, 2), p.single_room_price || null)
          .input('description', sql.NVarChar, p.description || null)
          .query(`
            INSERT INTO [web_travel].[dbo].[tour_prices] (tour_id, age_group, price, single_room_price, description)
            VALUES (@tour_id, @age_group, @price, @single_room_price, @description)
          `)
      );
      await Promise.all(priceInserts);
    }

    // Lưu images vào bảng dbo.tour_images
    if (images && Array.isArray(images)) {
      const imageInserts = images.map(img =>
        req.app.locals.pool.request()
          .input('tour_id', sql.Int, tourId)
          .input('image_url', sql.NVarChar, img.image_url)
          .input('caption', sql.NVarChar, img.caption || null)
          .query(`
            INSERT INTO [web_travel].[dbo].[tour_images] (tour_id, image_url, caption)
            VALUES (@tour_id, @image_url, @caption)
          `)
      );
      await Promise.all(imageInserts);
    }

    res.status(201).json({ id: tourId, message: 'Tour created successfully', tour_code });
  } catch (err) {
    console.error('Lỗi tạo tour:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API cập nhật tour
router.put('/:id', ensurePool, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, start_date, status, days, nights, transportation, departure_point, star_rating, prices, images } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ!' });
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

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Thiếu các trường bắt buộc: ${missingFields.join(", ")}` });
    }

    // Kiểm tra tour có tồn tại không
    const tourCheck = await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT 1 FROM [web_travel].[dbo].[tours] WHERE id = @id');

    if (tourCheck.recordset.length === 0) {
      return res.status(404).json({ error: 'Tour không tồn tại!' });
    }

    // Cập nhật thông tin tour
    await req.app.locals.pool.request()
      .input('id', sql.Int, parseInt(id))
      .input('name', sql.NVarChar, name)
      .input('start_date', sql.DateTime, new Date(start_date))
      .input('status', sql.NVarChar, status)
      .input('days', sql.Int, days)
      .input('nights', sql.Int, nights)
      .input('transportation', sql.NVarChar, transportation)
      .input('departure_point', sql.NVarChar, departure_point)
      .input('star_rating', sql.Int, star_rating)
      .query(`
        UPDATE [web_travel].[dbo].[tours]
        SET name = @name, start_date = @start_date, status = @status, days = @days, nights = @nights,
            transportation = @transportation, departure_point = @departure_point, star_rating = @star_rating
        WHERE id = @id
      `);

    // Xóa giá cũ và thêm giá mới
    await req.app.locals.pool.request()
      .input('tour_id', sql.Int, parseInt(id))
      .query('DELETE FROM [web_travel].[dbo].[tour_prices] WHERE tour_id = @tour_id');

    if (prices && Array.isArray(prices)) {
      const priceInserts = prices.map(p =>
        req.app.locals.pool.request()
          .input('tour_id', sql.Int, parseInt(id))
          .input('age_group', sql.NVarChar, p.age_group)
          .input('price', sql.Decimal(18, 2), p.price)
          .input('single_room_price', sql.Decimal(18, 2), p.single_room_price || null)
          .input('description', sql.NVarChar, p.description || null)
          .query(`
            INSERT INTO [web_travel].[dbo].[tour_prices] (tour_id, age_group, price, single_room_price, description)
            VALUES (@tour_id, @age_group, @price, @single_room_price, @description)
          `)
      );
      await Promise.all(priceInserts);
    }

    // Xóa hình ảnh cũ và thêm hình ảnh mới
    await req.app.locals.pool.request()
      .input('tour_id', sql.Int, parseInt(id))
      .query('DELETE FROM [web_travel].[dbo].[tour_images] WHERE tour_id = @tour_id');

    if (images && Array.isArray(images)) {
      const imageInserts = images.map(img =>
        req.app.locals.pool.request()
          .input('tour_id', sql.Int, parseInt(id))
          .input('image_url', sql.NVarChar, img.image_url)
          .input('caption', sql.NVarChar, img.caption || null)
          .query(`
            INSERT INTO [web_travel].[dbo].[tour_images] (tour_id, image_url, caption)
            VALUES (@tour_id, @image_url, @caption)
          `)
      );
      await Promise.all(imageInserts);
    }

    res.status(200).json({ message: 'Cập nhật tour thành công!' });
  } catch (err) {
    console.error('Lỗi cập nhật tour:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API lấy lịch trình của tour
router.get('/:tourId/itineraries', ensurePool, async (req, res) => {
  try {
    const { tourId } = req.params;

    if (!tourId || isNaN(tourId)) {
      return res.status(400).json({ error: 'Tour ID không hợp lệ!' });
    }

    const result = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, parseInt(tourId))
      .query(`
        SELECT *
        FROM [web_travel].[dbo].[tour_itineraries]
        WHERE tour_id = @tour_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lịch trình cho tour này!' });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi lấy lịch trình:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API lấy khách sạn của tour
router.get('/:tourId/hotels', ensurePool, async (req, res) => {
  try {
    const { tourId } = req.params;

    if (!tourId || isNaN(tourId)) {
      return res.status(400).json({ error: 'Tour ID không hợp lệ!' });
    }

    const result = await req.app.locals.pool.request()
      .input('tour_id', sql.Int, parseInt(tourId))
      .query(`
        SELECT th.*, h.name AS hotel_name, h.address
        FROM [web_travel].[dbo].[tour_hotels] th
        JOIN [web_travel].[dbo].[hotels] h ON th.hotel_id = h.id
        WHERE th.tour_id = @tour_id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khách sạn cho tour này!' });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('Lỗi lấy khách sạn:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API xóa tour
router.delete('/:id', ensurePool, async (req, res) => {
  const pool = req.app.locals.pool;
  const transaction = new sql.Transaction(pool);

  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ!' });
    }

    const tourId = parseInt(id);

    await transaction.begin();

    const checkRequest = transaction.request();
    const tourCheck = await checkRequest
      .input('id', sql.Int, tourId)
      .query('SELECT 1 FROM [web_travel].[dbo].[tours] WHERE id = @id');

    if (tourCheck.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Tour không tồn tại!' });
    }

    const deleteOrdersRequest = transaction.request();
    const deleteOrdersResult = await deleteOrdersRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[orders] WHERE tour_id = @tour_id');
    console.log(`Deleted ${deleteOrdersResult.rowsAffected} rows from orders for tour_id ${tourId}`);

    const itineraryRequest = transaction.request();
    const itineraries = await itineraryRequest
      .input('tour_id', sql.Int, tourId)
      .query('SELECT id FROM [web_travel].[dbo].[tour_itineraries] WHERE tour_id = @tour_id');

    const itineraryIds = itineraries.recordset.map(item => item.id);
    console.log('Itinerary IDs to delete:', itineraryIds);

    if (itineraryIds.length > 0) {
      for (let i = 0; i < itineraryIds.length; i++) {
        const itineraryId = itineraryIds[i];
        const deleteTicketsRequest = transaction.request();
        const deleteTicketsResult = await deleteTicketsRequest
          .input(`itinerary_id_${i}`, sql.Int, itineraryId)
          .query('DELETE FROM [web_travel].[dbo].[tour_tickets] WHERE itinerary_id = @itinerary_id_' + i);
        console.log(`Deleted ${deleteTicketsResult.rowsAffected} rows from tour_tickets for itinerary_id ${itineraryId}`);
      }
    } else {
      console.log('No itineraries found for tour_id:', tourId);
    }

    const deleteItinerariesRequest = transaction.request();
    const deleteItinerariesResult = await deleteItinerariesRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tour_itineraries] WHERE tour_id = @tour_id');
    console.log(`Deleted ${deleteItinerariesResult.rowsAffected} rows from tour_itineraries for tour_id ${tourId}`);

    const deletePricesRequest = transaction.request();
    await deletePricesRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tour_prices] WHERE tour_id = @tour_id');

    const deleteImagesRequest = transaction.request();
    await deleteImagesRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tour_images] WHERE tour_id = @tour_id');

    const deleteHotelsRequest = transaction.request();
    await deleteHotelsRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tour_hotels] WHERE tour_id = @tour_id');

    const deleteTourRequest = transaction.request();
    await deleteTourRequest
      .input('id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tours] WHERE id = @id');

    await transaction.commit();

    res.status(204).send();
  } catch (err) {
    await transaction.rollback();
    console.error('Lỗi xóa tour:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;