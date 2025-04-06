import React from 'react';
import '../styles/TourTicket.css';
import logo from '../logo.png'; // Giả sử bạn có logo của Đất Việt Tour
import QRCode from 'react-qr-code'; // Thư viện để tạo mã QR

const TourTicket = () => {
  const ticketData = {
    customer: {
      name: "Nguyễn Ngọc Ngân",
      phone: "0902156845",
      email: "ngocngan.website@gmail.com",
    },
    tour: {
      name: "Tour Du Lịch Thái Lan: Phuket | Vịnh Phang Nga (4N3D)",
      code: "Out1-2457",
      startDate: "12/07/2018",
      duration: "4 ngày 3 đêm",
      passengers: "4 sao",
      itinerary: "TP.HCM - PHUKET - PHUKET - VỊNH PHANG NGA - PHUKET - FREEDAY - PHUKET - TP.HCM",
    },
    passengerList: [
      {
        name: "Nguyễn Ngọc Kim Ngân",
        type: "Người lớn",
        price: "7,990,000đ", // Tiền vé
        surcharge: "3,000,000đ", // Phụ thu phòng đơn
      },
      {
        name: "Vương Bảo Ngọc",
        type: "Trẻ em (2-11 tuổi)",
        price: "7,280,000đ", // Tiền vé
        surcharge: "1,500,000đ", // Phụ thu phòng đơn
      },
    ],
    payment: {
      bookingCode: "HD-403",
      trips: "02",
      method: "Thanh toán tại văn phòng tour Đất Việt",
      status: "Chưa thanh toán",
    },
  };

  // Hàm chuyển đổi định dạng tiền từ chuỗi sang số để tính toán
  const parsePrice = (priceStr) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  };

  // Tính tổng tiền: Cộng tiền vé và phụ thu của từng hành khách
  const totalPrice = ticketData.passengerList.reduce((total, passenger) => {
    const ticketPrice = parsePrice(passenger.price);
    const surchargePrice = parsePrice(passenger.surcharge);
    return total + ticketPrice + surchargePrice;
  }, 0);

  // Định dạng lại tổng tiền thành chuỗi có dấu phân cách
  const formattedTotalPrice = totalPrice.toLocaleString('vi-VN') + "đ";

  return (
    <div className="ticket-container">
      <div className="ticket">

        {/* Header với logo và mã vé */}
        <div className="ticket-header">
          <img src={logo} alt="Đất Việt Tour Logo" className="logo" />
          <div className="ticket-code">
            <span>Mã vé: {ticketData.tour.code}</span>
          </div>
        </div>

        {/* Thông tin tour */}
        <div className="section">
          <h3>{ticketData.tour.name}</h3>
          <div className="info-row">
            <div className="info-item">
              <span className="label">Ngày khởi hành:</span>
              <span className="value">{ticketData.tour.startDate}</span>
            </div>
            <div className="info-item">
              <span className="label">Thời gian:</span>
              <span className="value">{ticketData.tour.duration}</span>
            </div>
            <div className="info-item">
              <span className="label">Khách sạn:</span>
              <span className="value">{ticketData.tour.passengers}</span>
            </div>
          </div>
          <div className="itinerary">
            <span className="label">Lịch trình:</span>
            <span className="value">{ticketData.tour.itinerary}</span>
          </div>
        </div>

        {/* Thông tin hành khách */}
        <div className="section">
          <h3>Thông tin hành khách</h3>
          <div className="info-row">
            <div className="info-item">
              <span className="label">Họ tên:</span>
              <span className="value">{ticketData.customer.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Số điện thoại:</span>
              <span className="value">{ticketData.customer.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{ticketData.customer.email}</span>
            </div>
          </div>
        </div>

        {/* Danh sách khách đi tour */}
        <div className="section">
          <h3>Danh sách khách đi tour</h3>
          <table className="passenger-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Thông tin hành khách</th>
                <th>Giá vé</th>
                <th>Phụ thu phòng đơn</th>
                <th>Tổng</th> {/* Thêm cột tổng cho từng hành khách */}
              </tr>
            </thead>
            <tbody>
              {ticketData.passengerList.map((passenger, index) => {
                const ticketPrice = parsePrice(passenger.price);
                const surchargePrice = parsePrice(passenger.surcharge);
                const passengerTotal = ticketPrice + surchargePrice;
                const formattedPassengerTotal = passengerTotal.toLocaleString('vi-VN') + "đ";

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="passenger-info">
                        <span className="label">Họ tên:</span>
                        <span className="value">{passenger.name}</span>
                      </div>
                      <div className="passenger-info">
                        <span className="label">Loại khách:</span>
                        <span className="value">{passenger.type}</span>
                      </div>
                    </td>
                    <td>{passenger.price}</td>
                    <td>{passenger.surcharge}</td>
                    <td>{formattedPassengerTotal}</td> {/* Hiển thị tổng tiền của từng hành khách */}
                  </tr>
                );
              })}
              <tr className="total-row">
                <td colSpan="4">Tổng tiền</td>
                <td>{formattedTotalPrice}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mã QR và ghi chú */}
        <div className="ticket-footer">
          <div className="qr-code">
            <QRCode
              value={`https://datviettour.com.vn/verify?ticket=${ticketData.tour.code}`}
              size={120}
            />
          </div>
          <p className="note">Vui lòng xuất trình vé này và mã QR cho nhân viên</p>
          <p className="note warning">
            Chúc quý khách có một chuyến đi vui vẻ và an toàn!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TourTicket;