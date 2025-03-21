const express = require('express');
const { sql } = require('../db'); // Import sql từ db.js

const router = express.Router();

// Định nghĩa domain của backend
const BACKEND_URL = 'http://localhost:5001'; // Thay đổi nếu backend chạy trên domain/port khác
const IMAGE_PATH = ''; // Đường dẫn mới

// Middleware kiểm tra pool
const ensurePool = (req, res, next) => {
  if (!req.app.locals.pool) {
    return res.status(503).json({ message: 'Dịch vụ không sẵn sàng, lỗi kết nối database' });
  }
  next();
};

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
          highlights: row.highlights,
          itinerary: row.itinerary,
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

    // Thêm ảnh vào từng tour với domain và đường dẫn mới
    imageResult.recordset.forEach(image => {
      if (tours[image.tour_id]) {
        tours[image.tour_id].images.push({
          id: image.id,
          tour_id: image.tour_id,
          image_url: `${BACKEND_URL}${IMAGE_PATH}${image.image_url}`, // Cập nhật đường dẫn
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

    // Thêm domain và đường dẫn mới vào image_url
    tour.images = imageResult.recordset.map(image => ({
      id: image.id,
      tour_id: image.tour_id,
      image_url: `${BACKEND_URL}${IMAGE_PATH}${image.image_url}`, // Cập nhật đường dẫn
      caption: image.caption
    }));

    res.json(tour);
  } catch (err) {
    console.error('Lỗi lấy chi tiết tour:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API thêm tour mới
router.post('/', ensurePool, async (req, res) => {
  try {
    const { name, start_date, status, days, nights, transportation, departure_point, tour_code, star_rating, highlights, itinerary, prices, images } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !start_date || !status || !days || !nights || !transportation || !departure_point || !tour_code || !star_rating || !highlights || !itinerary) {
      return res.status(400).json({ error: 'Tất cả các trường là bắt buộc!' });
    }

    // Thêm tour mới
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
      .input('itinerary', sql.NVarChar(sql.MAX), JSON.stringify(itinerary))
      .query(`
        INSERT INTO [web_travel].[dbo].[tours] (name, start_date, status, days, nights, transportation, departure_point, tour_code, star_rating, highlights, itinerary)
        VALUES (@name, @start_date, @status, @days, @nights, @transportation, @departure_point, @tour_code, @star_rating, @highlights, @itinerary);
        SELECT SCOPE_IDENTITY() as id;
      `);

    const tourId = tourResult.recordset[0].id;

    // Thêm giá (nếu có)
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

    // Thêm ảnh (nếu có)
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

    res.status(201).json({ id: tourId, message: 'Tour created successfully' });
  } catch (err) {
    console.error('Lỗi tạo tour:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// API lấy lịch trình của tour
router.get('/:tourId/itineraries', ensurePool, async (req, res) => {
  try {
    const { tourId } = req.params;

    // Kiểm tra tourId hợp lệ
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

    // Kiểm tra tourId hợp lệ
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

    // Kiểm tra id hợp lệ
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ!' });
    }

    const tourId = parseInt(id);

    // Bắt đầu giao dịch
    await transaction.begin();

    // Kiểm tra xem tour có tồn tại không
    const checkRequest = transaction.request();
    const tourCheck = await checkRequest
      .input('id', sql.Int, tourId)
      .query('SELECT 1 FROM [web_travel].[dbo].[tours] WHERE id = @id');

    if (tourCheck.recordset.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Tour không tồn tại!' });
    }

    // 1. Xóa orders liên quan đến tour_id
    const deleteOrdersRequest = transaction.request();
    const deleteOrdersResult = await deleteOrdersRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[orders] WHERE tour_id = @tour_id');
    console.log(`Deleted ${deleteOrdersResult.rowsAffected} rows from orders for tour_id ${tourId}`);

    // 2. Xóa tour_tickets (liên quan đến tour_itineraries của tour)
    // Đầu tiên, lấy danh sách itinerary_id của tour
    const itineraryRequest = transaction.request();
    const itineraries = await itineraryRequest
      .input('tour_id', sql.Int, tourId)
      .query('SELECT id FROM [web_travel].[dbo].[tour_itineraries] WHERE tour_id = @tour_id');

    const itineraryIds = itineraries.recordset.map(item => item.id);
    console.log('Itinerary IDs to delete:', itineraryIds); // Log để kiểm tra

    if (itineraryIds.length > 0) {
      // Xóa từng itinerary_id trong tour_tickets
      for (let i = 0; i < itineraryIds.length; i++) {
        const itineraryId = itineraryIds[i];
        const deleteTicketsRequest = transaction.request();
        const deleteTicketsResult = await deleteTicketsRequest
          .input(`itinerary_id_${i}`, sql.Int, itineraryId) // Sử dụng tên tham số duy nhất
          .query('DELETE FROM [web_travel].[dbo].[tour_tickets] WHERE itinerary_id = @itinerary_id_' + i);
        console.log(`Deleted ${deleteTicketsResult.rowsAffected} rows from tour_tickets for itinerary_id ${itineraryId}`);
      }
    } else {
      console.log('No itineraries found for tour_id:', tourId);
    }

    // 3. Xóa tour_itineraries
    const deleteItinerariesRequest = transaction.request();
    const deleteItinerariesResult = await deleteItinerariesRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tour_itineraries] WHERE tour_id = @tour_id');
    console.log(`Deleted ${deleteItinerariesResult.rowsAffected} rows from tour_itineraries for tour_id ${tourId}`);

    // 4. Xóa tour_prices
    const deletePricesRequest = transaction.request();
    await deletePricesRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tour_prices] WHERE tour_id = @tour_id');

    // 5. Xóa tour_images
    const deleteImagesRequest = transaction.request();
    await deleteImagesRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tour_images] WHERE tour_id = @tour_id');

    // 6. Xóa tour_hotels
    const deleteHotelsRequest = transaction.request();
    await deleteHotelsRequest
      .input('tour_id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tour_hotels] WHERE tour_id = @tour_id');

    // 7. Xóa tour chính
    const deleteTourRequest = transaction.request();
    await deleteTourRequest
      .input('id', sql.Int, tourId)
      .query('DELETE FROM [web_travel].[dbo].[tours] WHERE id = @id');

    // Commit giao dịch
    await transaction.commit();

    res.status(204).send(); // Trả về mã 204 (No Content) khi xóa thành công
  } catch (err) {
    // Rollback giao dịch nếu có lỗi
    await transaction.rollback();
    console.error('Lỗi xóa tour:', err);
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;