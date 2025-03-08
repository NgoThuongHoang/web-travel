// database.js

// Dữ liệu mẫu cho các tour
const mockTours = [
  {
    _id: 1,
    name: "Tour Đà Nẵng",
    startDate: "2024-03-20",
    price: "2,000,000 VNĐ",
    status: "active",
    duration: "4 NGÀY 3 ĐÊM",
    transportation: "MÁY BAY",
    departurePoint: "TP HCM",
    tourCode: "DN123",
    highlights: ["Tham quan Bà Nà Hills", "Khám phá Cầu Vàng", "Thưởng thức đặc sản Đà Nẵng"],
    itinerary: [
      {
        day: "NGÀY 1",
        title: "TP.HCM - ĐÀ NẴNG - NGŨ HÀNH SƠN - HỘI AN (Ăn trưa, tối)",
        details: [
          "Sáng: Đón khách tại sân bay Tân Sơn Nhất làm thủ tục bay đến Đà Nẵng.",
          "Tham quan Ngũ Hành Sơn và làng đá mỹ nghệ Non Nước.",
          "Chiều: Di chuyển đến Hội An, tham quan phố cổ.",
          "Tối: Thưởng thức đặc sản cao lầu, mì Quảng.",
        ],
      },
    ],
  },
  {
    _id: 2,
    name: "Tour Nha Trang",
    startDate: "2024-04-15",
    price: "3,000,000 VNĐ",
    status: "pending",
    duration: "3 NGÀY 2 ĐÊM",
    transportation: "XE KHÁCH",
    departurePoint: "HÀ NỘI",
    tourCode: "NT456",
    highlights: [
      "Tắm biển tại Bãi Dài",
      "Tham quan VinWonders Nha Trang",
      "Khám phá Tháp Bà Ponagar",
    ],
    itinerary: [
      {
        day: "NGÀY 1",
        title: "HÀ NỘI - NHA TRANG - VINWONDERS (Ăn trưa, tối)",
        details: [
          "Sáng: Bay từ Hà Nội vào Nha Trang, nhận phòng khách sạn.",
          "Tham quan VinWonders Nha Trang.",
          "Tối: Khám phá chợ đêm Nha Trang.",
        ],
      },
    ],
  },
];

// Dữ liệu mẫu cho khách hàng
let INITIAL_CUSTOMERS = [
  {
    id: 1,
    fullName: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    phone: "0901234567",
    address: "Hà Nội",
    createdAt: "2024-01-15",
    participatedTours: [
      { name: "Tour Đà Nẵng", code: "DN001" },
      { name: "Tour Hạ Long", code: "HL002" },
    ],
  },
  {
    id: 2,
    fullName: "Trần Thị Bình",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    address: "Hồ Chí Minh",
    createdAt: "2024-01-16",
    participatedTours: [{ name: "Tour Phú Quốc", code: "PQ003" }],
  },
  {
    id: 3,
    fullName: "Lê Văn Cường",
    email: "levanc@gmail.com",
    phone: "0923456789",
    address: "Đà Nẵng",
    createdAt: "2024-01-17",
    participatedTours: [],
  },
];

// Dữ liệu mẫu cho đơn đặt tour
let INITIAL_ORDERS = [
  {
    id: 1,
    customerName: "Nguyễn Văn An",
    tourName: "Tour Đà Nẵng",
    tourCode: "DN001",
    orderDate: "2024-03-01",
    startDate: "2024-05-15",
    endDate: "2024-05-20",
    status: "confirmed",
    participants: [
      { name: "Nguyễn Văn An", phone: "0901234567" },
      { name: "Trần Thị B", phone: "0912345678" },
    ],
  },
  {
    id: 2,
    customerName: "Trần Thị Bình",
    tourName: "Tour Hạ Long",
    tourCode: "HL002",
    orderDate: "2024-03-05",
    startDate: "2024-06-10",
    endDate: "2024-06-17",
    status: "pending",
    participants: [
      { name: "Trần Thị Bình", phone: "0923456789" },
      { name: "Lê Văn C", phone: "0934567890" },
      { name: "Phạm Thị D", phone: "0945678901" },
    ],
  },
  {
    id: 3,
    customerName: "Lê Văn Cường",
    tourName: "Tour Phú Quốc",
    tourCode: "PQ003",
    orderDate: "2024-03-10",
    startDate: "2024-07-01",
    endDate: "2024-07-05",
    status: "cancelled",
    participants: [
      { name: "Lê Văn Cường", phone: "0956789012" },
      { name: "Nguyễn Thị E", phone: "0967890123" },
    ],
  },
];

// Dữ liệu mẫu cho thống kê doanh thu
let DATA_REVENUE = [
  { month: "Tháng 1", tours: 10, customers: 50, revenue: 50, color: "#8884d8" },
  { month: "Tháng 2", tours: 15, customers: 70, revenue: 70, color: "#82ca9d" },
  { month: "Tháng 3", tours: 20, customers: 100, revenue: 100, color: "#ffc658" },
  { month: "Tháng 4", tours: 18, customers: 90, revenue: 90, color: "#ff8042" },
  { month: "Tháng 5", tours: 25, customers: 120, revenue: 120, color: "#0088FE" },
];

// Dữ liệu mẫu cho báo cáo
let monthlyData = [
  { month: "Tháng 1", doanhThu: 5000000, chiPhi: 2000000, loiNhuan: 3000000 },
  { month: "Tháng 2", doanhThu: 7000000, chiPhi: 2500000, loiNhuan: 4500000 },
  { month: "Tháng 3", doanhThu: 10000000, chiPhi: 3000000, loiNhuan: 7000000 },
  { month: "Tháng 4", doanhThu: 9000000, chiPhi: 2800000, loiNhuan: 6200000 },
  { month: "Tháng 5", doanhThu: 12000000, chiPhi: 3500000, loiNhuan: 8500000 },
];

// Hàm thêm đơn đặt tour mới và đồng bộ dữ liệu
function addOrder(newOrder) {
  // Thêm đơn đặt tour mới vào danh sách
  INITIAL_ORDERS.push(newOrder);

  // Cập nhật thông tin khách hàng
  const customer = INITIAL_CUSTOMERS.find((c) => c.fullName === newOrder.customerName);
  if (customer) {
    customer.participatedTours.push({ name: newOrder.tourName, code: newOrder.tourCode });
  }

  // Cập nhật thống kê doanh thu
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const revenueData = DATA_REVENUE.find((data) => data.month === currentMonth);
  if (revenueData) {
    revenueData.tours += 1;
    revenueData.customers += newOrder.participants.length;
    revenueData.revenue += parseInt(newOrder.tourPrice.replace(/,/g, ""), 10);
  }

  // Cập nhật báo cáo hàng tháng
  const monthlyReport = monthlyData.find((data) => data.month === currentMonth);
  if (monthlyReport) {
    monthlyReport.doanhThu += parseInt(newOrder.tourPrice.replace(/,/g, ""), 10);
    monthlyReport.loiNhuan = monthlyReport.doanhThu - monthlyReport.chiPhi;
  }
}

// Ví dụ thêm một đơn đặt tour mới
const newOrder = {
  id: 4,
  customerName: "Nguyễn Văn An",
  tourName: "Tour Nha Trang",
  tourCode: "NT456",
  orderDate: "2024-03-15",
  startDate: "2024-04-15",
  endDate: "2024-04-18",
  status: "confirmed",
  participants: [
    { name: "Nguyễn Văn An", phone: "0901234567" },
    { name: "Trần Thị B", phone: "0912345678" },
  ],
  tourPrice: "3,000,000 VNĐ",
};

addOrder(newOrder);

// Xuất dữ liệu và các hàm để sử dụng trong ứng dụng
module.exports = {
  mockTours,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  DATA_REVENUE,
  monthlyData,
  addOrder,
};