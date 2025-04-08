import React, { useEffect, useState } from 'react';
import '../styles/TourTicket.css';
import logo from '../logo.png';
import axios from 'axios';
import { Button, Modal, Spin } from 'antd'; // Thêm Spin từ Ant Design để hiển thị loading

const API_URL = 'http://localhost:5001/api';

const TourTicket = ({ orderId }) => {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false); // Trạng thái đã gửi email
  const [modalVisible, setModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [isSending, setIsSending] = useState(false); // Trạng thái đang gửi email

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await axios.get(`${API_URL}/orders/${orderId}`);
        const order = response.data;

        const formattedData = {
          customer: {
            name: order.full_name || 'N/A',
            phone: order.phone || 'N/A',
            email: order.email || 'N/A',
          },
          tour: {
            name: order.tour_name || 'N/A',
            code: order.tour_code || 'N/A',
            startDate: order.start_date ? new Date(order.start_date).toLocaleDateString('vi-VN') : 'N/A',
            duration: calculateDuration(order.start_date, order.end_date),
            passengers: `${order.adults || 0} người lớn, ${order.children_5_11 || 0} trẻ em`,
            itinerary: order.itinerary || 'N/A',
          },
          passengerList: order.customers.map((customer) => {
            let price = '0đ';
            let surcharge = '0đ';
            let type = customer.traveler_type === 'Lead' ? 'Người đặt tour' : customer.traveler_type;

            if (customer.traveler_type === 'Người lớn' || customer.traveler_type === 'Lead') {
              price = order.prices['Adult']?.price ? `${order.prices['Adult'].price.toLocaleString('vi-VN')}đ` : '0đ';
              surcharge = customer.single_room && order.prices['Adult']?.single_room_price
                ? `${order.prices['Adult'].single_room_price.toLocaleString('vi-VN')}đ`
                : '0đ';
            } else if (customer.traveler_type === 'Trẻ em') {
              price = order.prices['Child']?.price ? `${order.prices['Child'].price.toLocaleString('vi-VN')}đ` : '0đ';
              surcharge = customer.single_room && order.prices['Child']?.single_room_price
                ? `${order.prices['Child'].single_room_price.toLocaleString('vi-VN')}đ`
                : '0đ';
            } else if (customer.traveler_type === 'Em bé') {
              price = order.prices['Infant']?.price ? `${order.prices['Infant'].price.toLocaleString('vi-VN')}đ` : '0đ';
              surcharge = '0đ';
            }

            return { name: customer.full_name, type, price, surcharge };
          }),
          payment: {
            bookingCode: order.id.toString(),
            trips: '01',
            method: order.payment_method || 'N/A',
            status: order.status === 'confirmed' ? 'Đã thanh toán' : 'Chưa thanh toán',
          },
          emailSent: order.email_sent || false,
        };

        setTicketData(formattedData);
        setEmailSent(order.email_sent || false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu vé:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchTicketData();
  }, [orderId]);

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} ngày ${diffDays - 1} đêm`;
  };

  const parsePrice = (priceStr) => {
    if (!priceStr || priceStr === 'N/A') return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  };

  const totalPrice = ticketData?.passengerList.reduce((total, passenger) => {
    const ticketPrice = parsePrice(passenger.price);
    const surchargePrice = parsePrice(passenger.surcharge);
    return total + ticketPrice + surchargePrice;
  }, 0) || 0;

  const formattedTotalPrice = totalPrice.toLocaleString('vi-VN') + 'đ';

  const handleSendEmail = async () => {
    setIsSending(true); // Bật trạng thái đang gửi
    try {
      const response = await axios.post(`${API_URL}/orders/send-email/${orderId}`);
      if (response.data.emailSent) {
        setEmailSent(true); // Cập nhật trạng thái đã gửi
        setModalVisible(true); // Hiển thị modal
      }
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      if (error.response?.data?.emailSent) {
        setEmailSent(true); // Cập nhật trạng thái nếu email đã gửi trước đó
        setModalVisible(true); // Hiển thị modal
      } else {
        Modal.error({
          title: 'Lỗi',
          content: 'Không thể gửi email. Vui lòng thử lại!',
        });
      }
    } finally {
      setIsSending(false); // Tắt trạng thái đang gửi sau khi hoàn tất
    }
  };

  const handleModalOk = () => {
    setModalVisible(false);
  };

  if (loading) return <div>Đang tải vé...</div>;
  if (!ticketData) return <div>Không tìm thấy thông tin vé.</div>;

  return (
    <div className="ticket-container">
      <div className="ticket">
        <div className="ticket-header">
          <img src={logo} alt=" Sky Travel Logo" className="logo" />
          <div className="ticket-code">
            <span>Mã đặt tour: {ticketData.payment.bookingCode}</span>
          </div>
        </div>

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
              <span className="label">Số khách:</span>
              <span className="value">{ticketData.tour.passengers}</span>
            </div>
          </div>
          <div className="itinerary">
            <span className="label">Lịch trình:</span>
            <span
              className="value"
              dangerouslySetInnerHTML={{ __html: ticketData.tour.itinerary }}
            />
          </div>
        </div>

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

        <div className="section">
          <h3>Danh sách khách đi tour</h3>
          <table className="passenger-table">
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
              {ticketData.passengerList.map((passenger, index) => {
                const ticketPrice = parsePrice(passenger.price);
                const surchargePrice = parsePrice(passenger.surcharge);
                const passengerTotal = ticketPrice + surchargePrice;
                const formattedPassengerTotal = passengerTotal.toLocaleString('vi-VN') + 'đ';

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
                    <td>{formattedPassengerTotal}</td>
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

        <div className="ticket-footer">
          <p className="note">Vui lòng xuất trình vé này cho nhân viên</p>
          <p className="note warning">
            Chúc quý khách có một chuyến đi vui vẻ và an toàn!
          </p>
          <Button
            type="primary"
            onClick={handleSendEmail}
            disabled={emailSent || isSending} // Vô hiệu hóa nút khi đang gửi hoặc đã gửi
            style={{ marginTop: '10px' }}
          >
            {isSending ? (
              <>
                <Spin size="small" style={{ marginRight: '8px' }} />
                Đang gửi...
              </>
            ) : emailSent ? (
              'Đã gửi email'
            ) : (
              'Gửi email'
            )}
          </Button>
        </div>
      </div>

      {/* Modal thông báo gửi email thành công */}
      <Modal
        title="Thông báo"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        okText="Đóng"
        cancelText="Hủy"
      >
        <p>Email đã được gửi thành công đến {ticketData.customer.email}!</p>
      </Modal>
    </div>
  );
};

export default TourTicket;