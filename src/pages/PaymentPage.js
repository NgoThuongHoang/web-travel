import React, { useState, useRef } from 'react';
import { Form, Input, Button, Radio, Checkbox, DatePicker, Select, Typography, Col, Row, Space, Divider, Modal } from 'antd';
import { PlusOutlined, MinusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '../styles/PaymentPage.css'; // Đường dẫn import đã được cập nhật
import 'antd/dist/reset.css';

const { Title, Text } = Typography;
const { Option } = Select;

const PaymentPage = () => {
  const [nguoiLon, setNguoiLon] = useState(1);
  const [treEm, setTreEm] = useState(0);
  const [emBe, setEmBe] = useState(0);
  const [phongDon, setPhongDon] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [isAgreed, setIsAgreed] = useState(false); // Trạng thái checkbox điều khoản
  const [showAgreeError, setShowAgreeError] = useState(false); // Trạng thái hiển thị lỗi đồng ý điều khoản
  const [showPaymentError, setShowPaymentError] = useState(false); // Trạng thái hiển thị lỗi phương thức thanh toán
  const formRef = useRef(null); // Ref để truy cập form

  // Logic tính giá
  const nguoiLonPrice = 4790000; // 4,790,000 VNĐ cho mỗi người lớn
  const treEmPrice = 3600000; // 3,600,000 VNĐ cho mỗi trẻ em
  const emBePrice = 0; // 0 VNĐ cho mỗi em bé
  const phongDonPrice = 2200000; // 2,200,000 VNĐ cho phụ thu phòng đơn

  const totalNguoiLon = nguoiLon * nguoiLonPrice;
  const totalTreEm = treEm * treEmPrice;
  const totalEmBe = emBe * emBePrice;
  const totalPhongDon = phongDon * phongDonPrice;
  const totalPrice = totalNguoiLon + totalTreEm + totalEmBe + totalPhongDon;

  // Định dạng giá với dấu phẩy để dễ đọc
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
  };

  // Tạo các trường thông tin hành khách động
  const renderTravelerFields = () => {
    const travelerFields = [];
    const totalTravelers = nguoiLon + treEm + emBe;

    for (let i = 0; i < totalTravelers; i++) {
      const travelerType = i < nguoiLon ? 'Người lớn' : i < nguoiLon + treEm ? 'Trẻ em' : 'Em bé';
      travelerFields.push(
        <div key={i} className="traveler-card">
          <Text strong style={{ display: 'block', marginBottom: '10px' }}>{`${travelerType} ${i + 1}`}</Text>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={`username_traveler_${i}`}
                label={<span>Họ và tên <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input placeholder="Nhập Họ và tên" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={`gender_traveler_${i}`}
                label={<span>Giới tính <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
              >
                <Select placeholder="Giới tính">
                  <Option value="Nam">Nam</Option>
                  <Option value="Nữ">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={`ngaysinh_traveler_${i}`}
                label={<span>Ngày sinh <span style={{ color: 'red' }}>*</span></span>}
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="dd/mm/yyyy" />
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
    }
    return travelerFields;
  };

  // Xử lý khi nhấn nút "Đặt Ngay"
  const handleSubmit = async () => {
    try {
      // Kiểm tra các trường bắt buộc trong form
      await formRef.current.validateFields();

      // Kiểm tra checkbox điều khoản
      if (!isAgreed) {
        setShowAgreeError(true); // Hiển thị lỗi nếu chưa đồng ý điều khoản
      } else {
        setShowAgreeError(false); // Ẩn lỗi nếu đã đồng ý
      }

      // Kiểm tra phương thức thanh toán
      if (!selectedPayment) {
        setShowPaymentError(true); // Hiển thị lỗi nếu chưa chọn phương thức thanh toán
      } else {
        setShowPaymentError(false); // Ẩn lỗi nếu đã chọn
      }

      // Nếu có lỗi, hiển thị thông báo và dừng
      if (!isAgreed || !selectedPayment) {
        Modal.error({
          title: 'Lỗi',
          content: !isAgreed
            ? 'Vui lòng đồng ý với Điều khoản thanh toán trước khi tiếp tục!'
            : 'Vui lòng chọn phương thức thanh toán trước khi tiếp tục!',
        });
        return;
      }

      // Nếu tất cả hợp lệ, hiển thị modal thành công
      setIsModalVisible(true);

    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  // Xử lý khi đóng modal và chuyển hướng về trang chủ
  const handleModalClose = () => {
    setIsModalVisible(false);
    window.location.href = '/'; // Chuyển hướng về trang chủ mà không reset
  };

  // Khi checkbox thay đổi, ẩn thông báo lỗi nếu đã đồng ý
  const handleAgreeChange = (e) => {
    setIsAgreed(e.target.checked);
    if (e.target.checked) {
      setShowAgreeError(false); // Ẩn thông báo lỗi khi người dùng đồng ý
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="breadCrumbs">
        <div className="center">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a className="text-decoration-none" href="/">
                <span>Trang chủ</span>
              </a>
            </li>
            <li className="breadcrumb-item active">
              <span>Thanh toán</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="payment-page container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Phần bên trái: Form */}
          <div className="form-container">
            <Title level={3} style={{ color: '#003087' }}>Tổng Quan Về Chuyến Đi</Title>
            <Form
              layout="vertical"
              ref={formRef}
              className="c-wrap contactform"
              id="contactform"
            >
              {/* Thông Tin Liên Lạc */}
              <Title level={4}>Thông Tin Liên Lạc</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="username"
                    label={<span>Họ và tên <span style={{ color: 'red' }}>*</span></span>}
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  >
                    <Input placeholder="Nhập Họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label={<span>Email <span style={{ color: 'red' }}>*</span></span>}
                    rules={[{ type: 'email', required: true, message: 'Vui lòng nhập email hợp lệ!' }]}
                  >
                    <Input placeholder="sample@gmail.com" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="tel"
                    label={<span>Số điện thoại <span style={{ color: 'red' }}>*</span></span>}
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                  >
                    <Input placeholder="Nhập số điện thoại liên hệ" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dia_chi"
                    label={<span>Địa chỉ <span style={{ color: 'red' }}>*</span></span>}
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                  >
                    <Input placeholder="Nhập địa chỉ liên hệ" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Hành Khách */}
              <div className="traveler-section">
                <Title level={4}>Hành Khách</Title>
                <div className="traveler-count">
                  <Form.Item name="nguoi_lon" label="Người lớn" initialValue={nguoiLon}>
                    <Space>
                      <Button icon={<MinusOutlined />} onClick={() => setNguoiLon(Math.max(1, nguoiLon - 1))} />
                      <Input style={{ width: '60px', textAlign: 'center' }} value={nguoiLon} readOnly />
                      <Button icon={<PlusOutlined />} onClick={() => setNguoiLon(nguoiLon + 1)} />
                    </Space>
                  </Form.Item>
                  <Form.Item
                    name="tre_em"
                    label={<span>Trẻ em <Text type="secondary">(Từ 5 đến dưới 11 tuổi)</Text></span>}
                    initialValue={treEm}
                  >
                    <Space>
                      <Button icon={<MinusOutlined />} onClick={() => setTreEm(Math.max(0, treEm - 1))} />
                      <Input style={{ width: '60px', textAlign: 'center' }} value={treEm} readOnly />
                      <Button icon={<PlusOutlined />} onClick={() => setTreEm(treEm + 1)} />
                    </Space>
                  </Form.Item>
                </div>
                <div className="traveler-count">
                  <Form.Item
                    name="em_be"
                    label={<span>Em bé <Text type="secondary">(Dưới 5 tuổi)</Text></span>}
                    initialValue={emBe}
                  >
                    <Space>
                      <Button icon={<MinusOutlined />} onClick={() => setEmBe(Math.max(0, emBe - 1))} />
                      <Input style={{ width: '60px', textAlign: 'center' }} value={emBe} readOnly />
                      <Button icon={<PlusOutlined />} onClick={() => setEmBe(emBe + 1)} />
                    </Space>
                  </Form.Item>
                  <Form.Item name="phong_don" label={<span>Phòng đơn <Text type="secondary">(Giá: 2,200,000 VND)</Text></span>} initialValue={phongDon}>
                    <Space>
                      <Button icon={<MinusOutlined />} onClick={() => setPhongDon(Math.max(0, phongDon - 1))} />
                      <Input style={{ width: '60px', textAlign: 'center' }} value={phongDon} readOnly />
                      <Button icon={<PlusOutlined />} onClick={() => setPhongDon(phongDon + 1)} />
                    </Space>
                  </Form.Item>
                </div>
              </div>

              {/* Thông Tin Hành Khách */}
              <div className="traveler-section">
                <Title level={4}>Thông Tin Hành Khách</Title>
                {renderTravelerFields()}
              </div>

              {/* Ghi Chú Section */}
              <div className="section-spacing">
                <Title level={4}>Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi!</Title>
                <Form.Item name="notes">
                  <Checkbox.Group>
                    <Row gutter={[16, 16]}>
                      <Col span={8}><Checkbox value="Hút thuốc">Hút thuốc</Checkbox></Col>
                      <Col span={8}><Checkbox value="Phòng tầng cao">Phòng tầng cao</Checkbox></Col>
                      <Col span={8}><Checkbox value="Trẻ em hiếu động">Trẻ em hiếu động</Checkbox></Col>
                      <Col span={8}><Checkbox value="Ăn chay">Ăn chay</Checkbox></Col>
                      <Col span={8}><Checkbox value="Có người khuyết tật">Có người khuyết tật</Checkbox></Col>
                      <Col span={8}><Checkbox value="Phụ nữ có thai">Phụ nữ có thai</Checkbox></Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item label="Ghi chú thêm" name="additional_notes">
                  <Input.TextArea placeholder="Ghi chú thêm" rows={4} />
                </Form.Item>
              </div>

              {/* Điều Khoản Thanh Toán */}
              <div className="section-spacing">
                <Row gutter={16}>
                  <Col span={24}>
                    <Text>Bằng cách nhập chuột vào nút "ĐỒNG Ý" dưới đây, Khách hàng đồng ý rằng các Điều kiện điều khoản này sẽ được áp dụng. Vui lòng đọc kỹ Điều kiện điều khoản trước khi thực hiện chọn sử dụng dịch vụ của Lửa Việt Tours.</Text>
                    <Form.Item>
                      <Checkbox checked={isAgreed} onChange={handleAgreeChange}>
                        Tôi đã đọc và đồng ý với <a href="#">Điều khoản thanh toán</a>
                      </Checkbox>
                      {showAgreeError && (
                        <Text style={{ color: 'red', display: 'block', marginTop: '5px' }}>
                          Vui lòng đồng ý với Điều khoản thanh toán trước khi đặt tour!
                        </Text>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* Phương Thức Thanh Toán */}
              <div className="section-spacing">
                <Title level={4}>Phương Thức Thanh Toán</Title>
                <Form.Item
                  name="payment"
                  rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
                >
                  <Radio.Group onChange={(e) => setSelectedPayment(e.target.value)} value={selectedPayment}>
                    <div className="payment-methods">
                      <div className="payment-option">
                        <Radio value="Thanh toán tại văn phòng Lửa Việt">
                          Thanh toán tại văn phòng Lửa Việt
                        </Radio>
                        <div className={`address-details ${selectedPayment === 'Thanh toán tại văn phòng Lửa Việt' ? 'active' : ''}`}>
                          <Text>
                            <div>Thanh toán trực tiếp tại</div>
                            <div style={{ marginTop: '8px' }}>
                              <strong>Văn phòng HCM</strong><br />
                              677 Trần Hưng Đạo, Phường 1, Quận 5, TP. HCM<br />
                              Từ thứ hai - Sáng thứ 7 (Sáng 8:00 - 11:30 - Chiều 13:30 - 17:30)
                            </div>
                            <div style={{ marginTop: '8px' }}>
                              <strong>Văn phòng Hà Nội</strong><br />
                              Tầng 3, Tòa nhà Dolphin Plaza, số 28 Trần Bình, Phường Mỹ Đình 2, Quận Nam Từ Liêm, TP. Hà Nội<br />
                              Từ thứ hai - Sáng thứ 7 (Sáng 8:00 - 11:30 - Chiều 13:30 - 17:30)
                            </div>
                            <div style={{ marginTop: '8px' }}>
                              <strong>Văn phòng Cần Thơ</strong><br />
                              Số 09 Cách Mạng Tháng Tám, Phường Thới Bình, Quận Ninh Kiều, TP. Cần Thơ<br />
                              Từ thứ hai - Sáng thứ 7 (Sáng 8:00 - 11:30 - Chiều 13:30 - 17:30)
                            </div>
                          </Text>
                        </div>
                      </div>
                      <div className="payment-option">
                        <Radio value="Thu tiền tại nhà">
                          Thu tiền tại nhà
                        </Radio>
                      </div>
                      <div className="payment-option">
                        <Radio value="Chuyển khoản">
                          Chuyển khoản
                        </Radio>
                      </div>
                      <div className="payment-option">
                        <Radio value="Thanh toán online">
                          Thanh toán online
                        </Radio>
                      </div>
                    </div>
                  </Radio.Group>
                  {showPaymentError && (
                    <Text style={{ color: 'red', display: 'block', marginTop: '5px' }}>
                      Vui lòng chọn phương thức thanh toán!
                    </Text>
                  )}
                </Form.Item>
              </div>
            </Form>
          </div>

          {/* Phần bên phải: Tóm tắt chuyến đi */}
          <div className="summary-container">
            <img
              src="/images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg"
              alt="Tour Image"
              className="tour-image"
            />
            <Text style={{ display: 'block', marginBottom: '10px' }}>
              <a href="#" style={{ marginRight: '5px' }}>#️⃣</a> Mã tour: HNLCSP4N3D
            </Text>
            <Title level={4}>MIỀN BẮC 4N3Đ | HÀ NỘI – LÀO CAI – SA PA</Title>
            <Text style={{ display: 'block', marginBottom: '10px' }}>
              15-03-2025 → 19-03-2025
            </Text>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Text>Người lớn:</Text>
              <Text strong>{`${nguoiLon} x ${formatPrice(nguoiLonPrice)}`}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Text>Trẻ em:</Text>
              <Text strong>{`${treEm} x ${formatPrice(treEmPrice)}`}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Text>Em bé:</Text>
              <Text strong>{`${emBe} x ${formatPrice(emBePrice)}`}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Text>Phòng đơn:</Text>
              <Text strong>{formatPrice(totalPhongDon)}</Text>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Text strong>Tổng cộng:</Text>
              <Text strong className="total-price">{formatPrice(totalPrice)}</Text>
            </div>
            <Button type="primary" className="book-button" onClick={handleSubmit}>
              Đặt Ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Modal thông báo thành công */}
      <Modal
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        closable={true}
        className="success-modal"
        centered
      >
        <div className="success-modal-content">
          <CheckCircleOutlined className="success-icon" />
          <Title level={4} className="success-title">Đặt tour thành công</Title>
          <Text className="success-message">
            Đơn đặt tour của bạn đã được gửi thành công!
          </Text>
          <Text className="success-message">
            Vui lòng đợi nhân viên liên hệ với bạn trong thời gian sớm nhất.
          </Text>
          <Button
            type="primary"
            className="success-button"
            onClick={handleModalClose}
          >
            OK
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;