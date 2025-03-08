const express = require('express');
const { connectDB, sql } = require('./db');
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10; // Số vòng lặp cho bcrypt

const app = express();
const PORT = 5001;

// Middleware để parse JSON body
app.use(express.json());

// Kết nối database
let pool;
connectDB()
  .then(newPool => {
    pool = newPool;
    console.log('✅ Kết nối SQL Server thành công!');
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối SQL Server:', err);
    process.exit(1); // Thoát nếu không kết nối được DB
  });

// Middleware kiểm tra kết nối pool trước khi xử lý request
const ensurePool = (req, res, next) => {
  if (!pool) {
    return res.status(503).json({ message: 'Dịch vụ không sẵn sàng, lỗi kết nối database' });
  }
  next();
};

// 1. Lấy tất cả các tour với giá
app.get('/api/tours', async (req, res) => {
  try {
      const result = await sql.query`
          SELECT t.*, tp.age_group, tp.price, tp.single_room_price, tp.description
          FROM dbo.tours t
          LEFT JOIN dbo.tour_prices tp ON t.id = tp.tour_id
      `;
      const tours = {};
      result.recordset.forEach(row => {
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
                  prices: []
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
      res.json(Object.values(tours));
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// 2. Lấy thông tin một tour với giá
app.get('/api/tours/:id', async (req, res) => {
  try {
      const id = req.params.id;
      const result = await sql.query`
          SELECT t.*, tp.age_group, tp.price, tp.single_room_price, tp.description
          FROM dbo.tours t
          LEFT JOIN dbo.tour_prices tp ON t.id = tp.tour_id
          WHERE t.id = ${id}
      `;
      if (result.recordset.length === 0) {
          return res.status(404).json({ error: 'Tour not found' });
      }
      const tour = {
          id: result.recordset[0].id,
          name: result.recordset[0].name,
          start_date: result.recordset[0].start_date,
          status: result.recordset[0].status,
          days: result.recordset[0].days,
          nights: result.recordset[0].nights,
          transportation: result.recordset[0].transportation,
          departure_point: result.recordset[0].departure_point,
          tour_code: result.recordset[0].tour_code,
          star_rating: result.recordset[0].star_rating,
          highlights: result.recordset[0].highlights,
          itinerary: result.recordset[0].itinerary,
          prices: []
      };
      result.recordset.forEach(row => {
          if (row.age_group) {
              tour.prices.push({
                  age_group: row.age_group,
                  price: row.price,
                  single_room_price: row.single_room_price,
                  description: row.description
              });
          }
      });
      res.json(tour);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// 3. Thêm một tour mới với giá
app.post('/api/tours', async (req, res) => {
  try {
      const { name, start_date, status, days, nights, transportation, departure_point, tour_code, star_rating, highlights, itinerary, prices } = req.body;
      const result = await sql.query`
          INSERT INTO dbo.tours (name, start_date, status, days, nights, transportation, departure_point, tour_code, star_rating, highlights, itinerary)
          VALUES (${name}, ${start_date}, ${status}, ${days}, ${nights}, ${transportation}, ${departure_point}, ${tour_code}, ${star_rating}, ${highlights}, ${itinerary});
          SELECT SCOPE_IDENTITY() as id;
      `;
      const tourId = result.recordset[0].id;

      // Thêm các mức giá
      if (prices && Array.isArray(prices)) {
          const priceInserts = prices.map(p => 
              sql.query`
                  INSERT INTO dbo.tour_prices (tour_id, age_group, price, single_room_price, description)
                  VALUES (${tourId}, ${p.age_group}, ${p.price}, ${p.single_room_price || null}, ${p.description || null})
              `
          );
          await Promise.all(priceInserts);
      }

      res.status(201).json({ id: tourId, message: 'Tour created successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// 4. Lấy lịch trình của một tour
app.get('/api/tours/:tourId/itineraries', async (req, res) => {
  try {
      const tourId = req.params.tourId;
      const result = await sql.query`SELECT * FROM dbo.tour_itineraries WHERE tour_id = ${tourId}`;
      if (result.recordset.length === 0) {
          return res.status(404).json({ error: 'No itineraries found for this tour' });
      }
      res.json(result.recordset);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// 5. Lấy khách sạn của một tour theo lịch trình
app.get('/api/tours/:tourId/hotels', async (req, res) => {
  try {
      const tourId = req.params.tourId;
      const result = await sql.query`
          SELECT th.*, h.name AS hotel_name, h.address
          FROM dbo.tour_hotels th
          JOIN dbo.hotels h ON th.hotel_id = h.id
          WHERE th.tour_id = ${tourId}
      `;
      if (result.recordset.length === 0) {
          return res.status(404).json({ error: 'No hotels found for this tour' });
      }
      res.json(result.recordset);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// Khởi động server
// ------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});