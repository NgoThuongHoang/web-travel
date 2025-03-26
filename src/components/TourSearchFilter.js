import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Slider, Button, Checkbox, Row, Col, Typography, Divider, Card, message } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import '../styles/TourSearchFilter.css';
import 'antd/dist/reset.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const API_BASE_URL = "http://localhost:5001/api/tours"; // URL API của bạn

const TourSearchFilter = () => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState([]); // Lưu kết quả tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [priceRangeValue, setPriceRangeValue] = useState([0, 10000000]); // State để lưu giá trị Slider

  // Hàm lấy danh sách tour từ API
  const fetchTours = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.destination) {
        queryParams.append('search', filters.destination); // Gửi 'search'
      }
      // Các tham số khác nếu cần
      const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Lỗi khi lấy danh sách tour');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      message.error('Không thể lấy danh sách tour: ' + error.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý tìm kiếm
  const onFinish = (values) => {
    const filters = {
      destination: values.destination || '',
      dateRange: values.dateRange || null,
      tourType: values.tourType || '',
      priceRange: values.priceRange || null,
      amenities: values.amenities || [],
    };
    fetchTours(filters); // Gọi API với các tiêu chí tìm kiếm
  };

  // Hàm reset form
  const onReset = () => {
    form.resetFields();
    setSearchResults([]); // Xóa kết quả tìm kiếm
    setPriceRangeValue([0, 10000000]); // Reset giá trị Slider
  };

  // Hàm format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
  };

  // Hàm format ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  // Hàm xử lý khi Slider thay đổi
  const handlePriceRangeChange = (value) => {
    setPriceRangeValue(value);
  };

  return (
    <div className="tour-search-container">
      <Title level={2} className="search-title">
        Tìm kiếm tour du lịch
      </Title>
      <Card className="search-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            priceRange: [0, 10000000], // Giá mặc định từ 0 đến 10 triệu
          }}
        >
          <Row gutter={[16, 16]}>
            {/* Điểm đến */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="destination" label="Điểm đến">
                <Input
                  placeholder="Nhập điểm đến (ví dụ: Hà Nội, Đà Nẵng)"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </Col>

            {/* Ngày khởi hành */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="dateRange" label="Ngày khởi hành">
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={['Từ ngày', 'Đến ngày']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            {/* Loại tour */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="tourType" label="Loại tour">
                <Select placeholder="Chọn loại tour" allowClear>
                  <Option value="Trong nước">Trong nước</Option>
                  <Option value="Nước ngoài">Nước ngoài</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Khoảng giá */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="priceRange" label="Khoảng giá (VNĐ)">
                <Slider
                  range
                  min={0}
                  max={20000000}
                  step={500000}
                  value={priceRangeValue}
                  onChange={handlePriceRangeChange}
                  tooltip={{
                    formatter: (value) => `${value.toLocaleString()} VNĐ`,
                  }}
                />
                <Text>
                  {formatPrice(priceRangeValue[0])} - {formatPrice(priceRangeValue[1])}
                </Text>
              </Form.Item>
            </Col>

            {/* Tiện ích đi kèm */}
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="amenities" label="Tiện ích đi kèm">
                <Checkbox.Group>
                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Checkbox value="Hướng dẫn viên">Hướng dẫn viên</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="Ăn uống">Ăn uống</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="Khách sạn 4 sao">Khách sạn 4 sao</Checkbox>
                    </Col>
                    <Col span={12}>
                      <Checkbox value="Khách sạn 5 sao">Khách sạn 5 sao</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>

            {/* Nút tìm kiếm và reset */}
            <Col xs={24} sm={12} md={8} className="button-group">
              <Button
                type="primary"
                icon={<FilterOutlined />}
                htmlType="submit"
                loading={loading}
                className="search-button"
              >
                Tìm kiếm
              </Button>
              <Button
                icon={<ClearOutlined />}
                onClick={onReset}
                className="reset-button"
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Hiển thị kết quả tìm kiếm */}
      <Divider>Kết quả tìm kiếm</Divider>
      <div className="tour-results">
        {searchResults.length > 0 ? (
          searchResults.map((tour) => (
            <Card key={tour.id} className="tour-card" hoverable>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <img
                    src={tour.images?.[0]?.image_url || "/images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg"}
                    alt={tour.name}
                    className="tour-image"
                  />
                </Col>
                <Col xs={24} md={16}>
                  <Title level={4} className="tour-name">
                    {tour.name}
                  </Title>
                  <Text className="tour-info">
                    <strong>Điểm đến:</strong> {tour.departure_point}
                  </Text>
                  <br />
                  <Text className="tour-info">
                    <strong>Thời gian:</strong> {tour.days} ngày {tour.nights} đêm
                  </Text>
                  <br />
                  <Text className="tour-info">
                    <strong>Ngày khởi hành:</strong> {formatDate(tour.start_date)}
                  </Text>
                  <br />
                  <Text className="tour-info">
                    <strong>Tiện ích: </strong>
                    {tour.highlights
                      ? Array.isArray(tour.highlights)
                        ? tour.highlights.join(', ')
                        : tour.highlights.split(/\s+/).filter(Boolean).join(', ')
                      : 'Không có thông tin'}
                  </Text>
                  <br />
                  <Text className="tour-info">
                    <strong>Số vé còn lại:</strong> {tour.remaining_tickets}
                  </Text>
                  <br />
                  <Text className="tour-price">
                    {formatPrice(tour.prices?.find(p => p.age_group === "Adult")?.price || 0)}
                  </Text>
                  <Button type="primary" className="book-now-button">
                    Đặt ngay
                  </Button>
                </Col>
              </Row>
            </Card>
          ))
        ) : (
          <Text type="secondary">
            {loading ? 'Đang tìm kiếm...' : 'Vui lòng nhập tiêu chí và nhấn Tìm kiếm để xem kết quả.'}
          </Text>
        )}
      </div>
    </div>
  );
};

export default TourSearchFilter;