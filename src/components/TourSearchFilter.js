import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, Slider, Button, Checkbox, Row, Col, Typography, Divider, Card } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import '../styles/TourSearchFilter.css'; // File CSS sẽ được tạo ở phần sau
import 'antd/dist/reset.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const TourSearchFilter = () => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState([]); // Lưu kết quả tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

  // Dữ liệu giả lập danh sách tour (thay bằng API thực tế nếu có)
  const mockTours = [
    {
      id: 1,
      name: 'Miền Bắc 4N3Đ | Hà Nội – Lào Cai – Sa Pa',
      destination: 'Hà Nội',
      price: 4790000,
      duration: '4 ngày 3 đêm',
      type: 'Trong nước',
      amenities: ['Hướng dẫn viên', 'Ăn uống'],
      startDate: '2025-03-15',
    },
    {
      id: 2,
      name: 'Đà Nẵng – Hội An 3N2Đ',
      destination: 'Đà Nẵng',
      price: 3500000,
      duration: '3 ngày 2 đêm',
      type: 'Trong nước',
      amenities: ['Hướng dẫn viên', 'Khách sạn 4 sao'],
      startDate: '2025-04-10',
    },
    {
      id: 3,
      name: 'Thái Lan 5N4Đ | Bangkok – Pattaya',
      destination: 'Thái Lan',
      price: 8500000,
      duration: '5 ngày 4 đêm',
      type: 'Nước ngoài',
      amenities: ['Hướng dẫn viên', 'Ăn uống', 'Khách sạn 5 sao'],
      startDate: '2025-05-20',
    },
  ];

  // Hàm xử lý tìm kiếm
  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      // Lọc dữ liệu dựa trên các giá trị từ form
      const filteredTours = mockTours.filter((tour) => {
        const matchesDestination = values.destination
          ? tour.destination.toLowerCase().includes(values.destination.toLowerCase())
          : true;
        const matchesPrice = values.priceRange
          ? tour.price >= values.priceRange[0] && tour.price <= values.priceRange[1]
          : true;
        const matchesType = values.tourType ? tour.type === values.tourType : true;
        const matchesAmenities = values.amenities
          ? values.amenities.every((amenity) => tour.amenities.includes(amenity))
          : true;
        const matchesDate = values.dateRange
          ? new Date(tour.startDate) >= new Date(values.dateRange[0]) &&
            new Date(tour.startDate) <= new Date(values.dateRange[1])
          : true;

        return (
          matchesDestination &&
          matchesPrice &&
          matchesType &&
          matchesAmenities &&
          matchesDate
        );
      });

      setSearchResults(filteredTours);
      setLoading(false);
    }, 1000); // Giả lập thời gian tải dữ liệu
  };

  // Hàm reset form
  const onReset = () => {
    form.resetFields();
    setSearchResults([]);
  };

  // Hàm format giá tiền
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
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
                  tooltip={{
                    formatter: (value) => `${value.toLocaleString()} VNĐ`,
                  }}
                />
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
                    src="/images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg" // Thay bằng hình ảnh thực tế
                    alt={tour.name}
                    className="tour-image"
                  />
                </Col>
                <Col xs={24} md={16}>
                  <Title level={4} className="tour-name">
                    {tour.name}
                  </Title>
                  <Text className="tour-info">
                    <strong>Điểm đến:</strong> {tour.destination}
                  </Text>
                  <br />
                  <Text className="tour-info">
                    <strong>Thời gian:</strong> {tour.duration}
                  </Text>
                  <br />
                  <Text className="tour-info">
                    <strong>Ngày khởi hành:</strong> {tour.startDate}
                  </Text>
                  <br />
                  <Text className="tour-info">
                    <strong>Tiện ích:</strong> {tour.amenities.join(', ')}
                  </Text>
                  <br />
                  <Text className="tour-price">
                    {formatPrice(tour.price)}
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
            {loading ? 'Đang tìm kiếm...' : 'Không có tour nào phù hợp. Vui lòng thử lại với bộ lọc khác.'}
          </Text>
        )}
      </div>
    </div>
  );
};

export default TourSearchFilter;