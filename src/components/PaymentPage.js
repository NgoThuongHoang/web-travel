import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Radio, Checkbox, DatePicker, Select, Typography, Col, Row, Space, Divider, Modal } from 'antd';
import { PlusOutlined, MinusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import qrBanking from '../qr-banking.JPG'; // Import ảnh QR
import '../styles/PaymentPage.css';
import 'antd/dist/reset.css';

const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = "http://localhost:5001/api/tours";

const PaymentPage = ({ tourId }) => {
  const [tour, setTour] = useState(null);
  const [nguoiLon, setNguoiLon] = useState(1);
  const [treEm, setTreEm] = useState(0);
  const [emBe, setEmBe] = useState(0);
  const [singleRoomSelections, setSingleRoomSelections] = useState([false]); // Khởi tạo với 1 người lớn mặc định
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showAgreeError, setShowAgreeError] = useState(false);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [useContactInfo, setUseContactInfo] = useState(false);
  const [useContactPhoneAndAddress, setUseContactPhoneAndAddress] = useState([false]);
  const [totalPrice, setTotalPrice] = useState(0);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${tourId}`);
        if (!response.ok) throw new Error(`Lỗi khi lấy thông tin tour: ${response.statusText}`);
        const data = await response.json();
        setTour(data);
      } catch (error) {
        Modal.error({ title: 'Lỗi', content: `Không thể lấy thông tin tour: ${error.message}` });
      }
    };
    if (tourId) fetchTour();
    else Modal.error({ title: 'Lỗi', content: 'Không tìm thấy tourId!' });
  }, [tourId]);

  useEffect(() => {
    const totalTravelers = nguoiLon + treEm + emBe;
    const currentLength = singleRoomSelections.length;

    // Nếu số lượng hành khách tăng, thêm các giá trị false cho hành khách mới
    if (totalTravelers > currentLength) {
      setSingleRoomSelections(prev => [
        ...prev,
        ...new Array(totalTravelers - currentLength).fill(false)
      ]);
      setUseContactPhoneAndAddress(prev => [
        ...prev,
        ...new Array(totalTravelers - currentLength).fill(false)
      ]);
    } 
    // Nếu số lượng hành khách giảm, cắt bớt mảng nhưng giữ nguyên các lựa chọn hiện có
    else if (totalTravelers < currentLength) {
      setSingleRoomSelections(prev => prev.slice(0, totalTravelers));
      setUseContactPhoneAndAddress(prev => prev.slice(0, totalTravelers));
    }
    // Nếu số lượng không đổi, không làm gì để giữ nguyên trạng thái
  }, [nguoiLon, treEm, emBe]);

  useEffect(() => {
    if (useContactInfo) {
      const contactInfo = formRef.current?.getFieldsValue(['username', 'tel']);
      formRef.current?.setFieldsValue({
        username_traveler_0: contactInfo.username || '',
        phone_traveler_0: contactInfo.tel || '',
      });
    } else {
      formRef.current?.setFieldsValue({ username_traveler_0: '', phone_traveler_0: '' });
    }
  }, [useContactInfo]);

  useEffect(() => {
    const totalTravelers = nguoiLon + treEm + emBe;
    for (let i = 1; i < totalTravelers; i++) {
      if (useContactPhoneAndAddress[i]) {
        const contactInfo = formRef.current?.getFieldsValue(['tel', 'dia_chi']);
        formRef.current?.setFieldsValue({
          [`phone_traveler_${i}`]: contactInfo.tel || '',
          [`address_traveler_${i}`]: contactInfo.dia_chi || '',
        });
      } else {
        formRef.current?.setFieldsValue({
          [`phone_traveler_${i}`]: '',
          [`address_traveler_${i}`]: '',
        });
      }
    }
  }, [useContactPhoneAndAddress, nguoiLon, treEm, emBe]);

  const nguoiLonPrice = tour?.prices?.find(p => p.age_group === "Adult")?.price || 4700000;
  const treEmPrice = tour?.prices?.find(p => p.age_group === "5-11")?.price || 2350000;
  const emBePrice = tour?.prices?.find(p => p.age_group === "Under 5")?.price || 0;
  const phongDonPriceAdult = tour?.prices?.find(p => p.age_group === "Adult")?.single_room_price || 5350000;
  const phongDonPriceChild = tour?.prices?.find(p => p.age_group === "5-11")?.single_room_price || 3000000;

  useEffect(() => {
    const totalNguoiLon = nguoiLon * nguoiLonPrice;
    const totalTreEm = treEm * treEmPrice;
    const totalEmBe = emBe * emBePrice;

    let totalPhongDon = 0;
    singleRoomSelections.forEach((selected, index) => {
      if (selected) {
        if (index < nguoiLon) {
          totalPhongDon += phongDonPriceAdult; // Người lớn
        } else if (index < nguoiLon + treEm) {
          totalPhongDon += phongDonPriceChild; // Trẻ em 5-11 tuổi
        }
      }
    });

    const newTotalPrice = totalNguoiLon + totalTreEm + totalEmBe + totalPhongDon;
    setTotalPrice(newTotalPrice);
  }, [nguoiLon, treEm, emBe, singleRoomSelections, nguoiLonPrice, treEmPrice, emBePrice, phongDonPriceAdult, phongDonPriceChild]);

  const totalTickets = nguoiLon + treEm + emBe;

  const formatPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return moment("2025-03-15").format('DD/MM/YYYY');
    }
    return moment(date).format('DD/MM/YYYY');
  };

  const calculateEndDate = (startDate, days) => {
    const start = startDate ? new Date(startDate) : new Date("2025-03-15");
    const tourDays = days || 4;
    const endDate = new Date(start);
    endDate.setDate(start.getDate() + tourDays);
    return endDate;
  };

  const renderTravelerFields = () => {
    const travelerFields = [];
    const totalTravelers = nguoiLon + treEm + emBe;

    for (let i = 0; i < totalTravelers; i++) {
      const travelerType = i < nguoiLon ? 'Người lớn' : i < nguoiLon + treEm ? 'Trẻ em' : 'Em bé';
      const phongDonPrice = travelerType === 'Người lớn' ? phongDonPriceAdult : travelerType === 'Trẻ em' ? phongDonPriceChild : 0;

      travelerFields.push(
        <div key={i} className="traveler-card">
          <Text strong style={{ display: 'block', marginBottom: '10px' }}>{`${travelerType} ${i + 1}`}</Text>
          {i === 0 && travelerType === 'Người lớn' && (
            <Form.Item>
              <Checkbox checked={useContactInfo} onChange={(e) => setUseContactInfo(e.target.checked)}>
                Sử dụng thông tin liên lạc
              </Checkbox>
            </Form.Item>
          )}
          {i !== 0 && (
            <Form.Item>
              <Checkbox
                checked={useContactPhoneAndAddress[i]}
                onChange={(e) => {
                  const newSelections = [...useContactPhoneAndAddress];
                  newSelections[i] = e.target.checked;
                  setUseContactPhoneAndAddress(newSelections);
                }}
              >
                Sử dụng số điện thoại và địa chỉ của người đặt tour
              </Checkbox>
            </Form.Item>
          )}
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
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name={`phone_traveler_${i}`}
                label="Số điện thoại"
                rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số!' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            {i !== 0 && (
              <Col span={8}>
                <Form.Item
                  name={`address_traveler_${i}`}
                  label="Địa chỉ"
                >
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
            </Col>
            )}
            {travelerType !== 'Em bé' && (
              <Col span={i === 0 ? 16 : 8}>
                <Form.Item
                  name={`single_room_traveler_${i}`}
                  label={<span>Phòng đơn <Text type="secondary">(Giá: {formatPrice(phongDonPrice)})</Text></span>}
                  valuePropName="checked"
                >
                  <Checkbox
                    checked={singleRoomSelections[i]}
                    onChange={(e) => {
                      const newSelections = [...singleRoomSelections];
                      newSelections[i] = e.target.checked;
                      setSingleRoomSelections(newSelections);
                    }}
                  >
                    Chọn phòng đơn
                  </Checkbox>
                </Form.Item>
              </Col>
            )}
          </Row>
        </div>
      );
    }
    return travelerFields;
  };

  const handleSubmit = async () => {
    try {
      await formRef.current.validateFields();
      if (!isAgreed) {
        setShowAgreeError(true);
        Modal.error({ title: 'Lỗi', content: 'Vui lòng đồng ý với Điều khoản thanh toán!' });
        return;
      } else setShowAgreeError(false);

      if (!selectedPayment) {
        setShowPaymentError(true);
        Modal.error({ title: 'Lỗi', content: 'Vui lòng chọn phương thức thanh toán!' });
        return;
      } else setShowPaymentError(false);

      if (tour && totalTickets > tour.remaining_tickets) {
        Modal.error({ title: 'Lỗi', content: `Số vé đặt (${totalTickets}) vượt quá số vé còn lại (${tour.remaining_tickets})!` });
        return;
      }

      const formValues = formRef.current.getFieldsValue();

      const leadCustomer = {
        full_name: formValues.username,
        phone: formValues.tel,
        email: formValues.email,
        gender: formValues.gender_traveler_0,
        birth_date: formValues.ngaysinh_traveler_0 ? formValues.ngaysinh_traveler_0.format('YYYY-MM-DD') : null,
        single_room: formValues.single_room_traveler_0 || false,
        traveler_type: 'Lead',
      };

      if (!leadCustomer.full_name || !leadCustomer.phone || !leadCustomer.email || !leadCustomer.gender || !leadCustomer.birth_date) {
        Modal.error({ title: 'Lỗi', content: 'Vui lòng điền đầy đủ thông tin người đặt tour!' });
        return;
      }

      const travelers = [];
      const allTravelersForSingleRoom = [];

      allTravelersForSingleRoom.push({
        full_name: leadCustomer.full_name,
        gender: leadCustomer.gender,
        birth_date: leadCustomer.birth_date,
        phone: leadCustomer.phone,
        address: formValues.dia_chi || null,
        single_room: leadCustomer.single_room,
        traveler_type: leadCustomer.traveler_type,
      });

      for (let i = 1; i < totalTickets; i++) {
        const travelerType = i < nguoiLon ? 'Người lớn' : i < nguoiLon + treEm ? 'Trẻ em' : 'Em bé';
        const birthDate = formValues[`ngaysinh_traveler_${i}`];
        if (!birthDate) {
          Modal.error({ title: 'Lỗi', content: `Ngày sinh của ${travelerType} ${i} không hợp lệ!` });
          return;
        }
        const traveler = {
          full_name: formValues[`username_traveler_${i}`],
          gender: formValues[`gender_traveler_${i}`],
          birth_date: birthDate.format('YYYY-MM-DD'),
          phone: formValues[`phone_traveler_${i}`] || null,
          address: formValues[`address_traveler_${i}`] || null,
          single_room: formValues[`single_room_traveler_${i}`] || false,
          traveler_type: travelerType,
        };
        travelers.push(traveler);
        allTravelersForSingleRoom.push(traveler);
      }

      const startDate = tour?.start_date ? new Date(tour.start_date) : new Date("2025-03-15");
      const tourDays = tour?.days || 4;
      const endDate = calculateEndDate(startDate, tourDays);

      const notes = formValues.notes || [];
      const additionalNotes = formValues.additional_notes || '';
      const specialRequests = [...notes, additionalNotes].filter(Boolean).join(', ');

      const totalSingleRooms = allTravelersForSingleRoom.filter(traveler => traveler.single_room).length;

      const bookingData = {
        full_name: leadCustomer.full_name,
        phone: leadCustomer.phone,
        email: leadCustomer.email,
        gender: leadCustomer.gender,
        birth_date: leadCustomer.birth_date,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        adults: nguoiLon,
        children_under_5: emBe,
        children_5_11: treEm,
        single_rooms: totalSingleRooms,
        lead_single_room: leadCustomer.single_room,
        pickup_point: formValues.dia_chi,
        special_requests: specialRequests,
        payment_method: selectedPayment,
        total_amount: totalPrice,
        travelers: travelers,
      };

      console.log('Booking Data:', bookingData);

      const response = await fetch(`${API_BASE_URL}/${tourId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Lỗi khi đặt tour!');
      }

      setIsModalVisible(true);
    } catch (error) {
      console.error('Lỗi khi đặt tour:', error);
      Modal.error({ title: 'Lỗi', content: error.message || 'Đã có lỗi xảy ra khi đặt tour!' });
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    window.location.href = '/';
  };

  const handleAgreeChange = (e) => {
    setIsAgreed(e.target.checked);
    if (e.target.checked) setShowAgreeError(false);
  };

  if (!tour) return <div>Đang tải thông tin tour...</div>;

  const startDate = tour?.start_date ? new Date(tour.start_date) : new Date("2025-03-15");
  const endDate = calculateEndDate(startDate, tour?.days);

  return (
    <div>
      <div className="breadCrumbs">
        <div className="center">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/" className="text-decoration-none"><span>Trang chủ</span></a></li>
            <li className="breadcrumb-item active"><span>Thanh toán</span></li>
          </ol>
        </div>
      </div>

      <div className="payment-page container">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="form-container">
            <Title level={3} style={{ color: '#003087' }}>Tổng Quan Về Chuyến Đi</Title>
            <Form layout="vertical" ref={formRef} className="c-wrap contactform" id="contactform">
              <Title level={4}>Thông Tin Liên Lạc</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="username" label={<span>Họ và tên <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                    <Input placeholder="Nhập Họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="email" label={<span>Email <span style={{ color: 'red' }}>*</span></span>} rules={[{ type: 'email', required: true, message: 'Vui lòng nhập email hợp lệ!' }]}>
                    <Input placeholder="sample@gmail.com" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="tel" label={<span>Số điện thoại <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                    <Input placeholder="Nhập số điện thoại liên hệ" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="dia_chi" label={<span>Địa chỉ <span style={{ color: 'red' }}>*</span></span>} rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                    <Input placeholder="Nhập địa chỉ liên hệ" />
                  </Form.Item>
                </Col>
              </Row>

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
                  <Form.Item name="tre_em" label={<span>Trẻ em <Text type="secondary">(Từ 5 đến dưới 11 tuổi)</Text></span>} initialValue={treEm}>
                    <Space>
                      <Button icon={<MinusOutlined />} onClick={() => setTreEm(Math.max(0, treEm - 1))} />
                      <Input style={{ width: '60px', textAlign: 'center' }} value={treEm} readOnly />
                      <Button icon={<PlusOutlined />} onClick={() => setTreEm(treEm + 1)} />
                    </Space>
                  </Form.Item>
                </div>
                <div className="traveler-count">
                  <Form.Item name="em_be" label={<span>Em bé <Text type="secondary">(Dưới 5 tuổi)</Text></span>} initialValue={emBe}>
                    <Space>
                      <Button icon={<MinusOutlined />} onClick={() => setEmBe(Math.max(0, emBe - 1))} />
                      <Input style={{ width: '60px', textAlign: 'center' }} value={emBe} readOnly />
                      <Button icon={<PlusOutlined />} onClick={() => setEmBe(emBe + 1)} />
                    </Space>
                  </Form.Item>
                </div>
              </div>

              <div className="traveler-section">
                <Title level={4}>Thông Tin Hành Khách</Title>
                {renderTravelerFields()}
              </div>

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

              <div className="section-spacing">
                <Row gutter={16}>
                  <Col span={24}>
                    <Text>Bằng cách nhập chuột vào nút "ĐỒNG Ý" dưới đây, Khách hàng đồng ý rằng các Điều kiện điều khoản này sẽ được áp dụng. Vui lòng đọc kỹ Điều kiện điều khoản trước khi thực hiện chọn sử dụng dịch vụ của Sky Travel.</Text>
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

              <div className="section-spacing">
                <Title level={4}>Phương Thức Thanh Toán</Title>
                <Form.Item name="payment" rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán!" }]}>
                  <Radio.Group onChange={(e) => setSelectedPayment(e.target.value)} value={selectedPayment}>
                    <div className="payment-methods">
                      <div className="payment-option">
                        <Radio value="Thanh toán tại văn phòng">Thanh toán tại văn phòng</Radio>
                        <div className={`address-details ${selectedPayment === "Thanh toán tại văn phòng" ? "active" : ""}`}>
                          <Text>
                            <div style={{ marginTop: "8px" }}>
                              <strong>Công ty TNHH Du lịch Sky Travel</strong><br />
                              Địa chỉ: Kp5, Đ.Nguyễn Khuyến, P. Trảng Dài, Tp.Biên Hoà, T.Đồng Nai<br />
                              Từ thứ hai - Sáng thứ 7 (Sáng 8:00 - 11:30 - Chiều 13:30 - 17:30)
                            </div>
                          </Text>
                        </div>
                      </div>
                      <div className="payment-option">
                        <Radio value="Chuyển khoản">Chuyển khoản</Radio>
                        {selectedPayment === "Chuyển khoản" && (
                          <div className="bank-details" style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "30px" }}>
                            <Text>
                              <strong>Ngân hàng:</strong> Vietcombank<br />
                              <strong>Số tài khoản:</strong> 123456789<br />
                              <strong>Chủ tài khoản:</strong> Nguyễn Văn A<br />
                              <strong>Chi nhánh:</strong> TP. HCM<br />
                              <strong>Nội dung:</strong> Mã tour - Số điện thoại
                            </Text>
                            <img src={qrBanking} alt="QR Code Chuyển Khoản" style={{ width: "300px", height: "300px", objectFit: "contain" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Radio.Group>
                  {showPaymentError && (
                    <Text style={{ color: "red", display: "block", marginTop: "5px" }}>
                      Vui lòng chọn phương thức thanh toán!
                    </Text>
                  )}
                </Form.Item>
              </div>
            </Form>
          </div>

          <div className="summary-container">
            <img src={tour?.images?.[0]?.image_url || "/images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg"} alt="Tour Image" className="tour-image" />
            <Text style={{ display: 'block', marginBottom: '10px' }}><a href="#" style={{ marginRight: '5px' }}>#️⃣</a> Mã tour: {tour?.tour_code || "HNLCSP4N3D"}</Text>
            <Title level={4}>{tour?.name || "MIỀN BẮC 4N3Đ | HÀ NỘI – LÀO CAI – SA PA"}</Title>
            <Text style={{ display: 'block', marginBottom: '10px' }}>
              {formatDate(startDate)} → {formatDate(endDate)}
            </Text>
            <Text style={{ display: 'block', marginBottom: '10px', color: 'red' }}>Số vé còn lại: {tour?.remaining_tickets !== undefined ? tour.remaining_tickets : 'Đang tải...'}</Text>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><Text>Người lớn:</Text><Text strong>{`${nguoiLon} x ${formatPrice(nguoiLonPrice)}`}</Text></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><Text>Trẻ em:</Text><Text strong>{`${treEm} x ${formatPrice(treEmPrice)}`}</Text></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><Text>Em bé:</Text><Text strong>{`${emBe} x ${formatPrice(emBePrice)}`}</Text></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <Text>Phòng đơn:</Text>
              <Text strong>{formatPrice(singleRoomSelections.reduce((sum, selected, index) => {
                if (selected) {
                  return sum + (index < nguoiLon ? phongDonPriceAdult : index < nguoiLon + treEm ? phongDonPriceChild : 0);
                }
                return sum;
              }, 0))}</Text>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><Text strong>Tổng cộng:</Text><Text strong className="total-price">{formatPrice(totalPrice)}</Text></div>
            <Button type="primary" className="book-button" onClick={handleSubmit} disabled={tour?.remaining_tickets === 0}>
              {tour?.remaining_tickets === 0 ? 'Hết vé' : 'Đặt Ngay'}
            </Button>
          </div>
        </div>
      </div>

      <Modal visible={isModalVisible} onCancel={handleModalClose} footer={null} closable={true} className="success-modal" centered>
        <div className="success-modal-content">
          <CheckCircleOutlined className="success-icon" />
          <Title level={4} className="success-title">Đặt tour thành công</Title>
          <Text className="success-message">Đơn đặt tour của bạn đã được gửi thành công!</Text>
          <Text className="success-message">Vui lòng chờ xác nhận từ nhân viên trong thời gian sớm nhất.</Text>
          <Button type="primary" className="success-button" onClick={handleModalClose}>OK</Button>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;