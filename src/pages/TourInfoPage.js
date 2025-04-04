import React, { useState, useRef } from 'react';
import { Form, Input, Button, Table, Card, message, Descriptions, Typography, Tag, Row, Col, Spin, Tabs, List } from 'antd';
import { SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

axios.defaults.baseURL = 'http://localhost:5001';

// Hàm chuẩn hóa số điện thoại
const normalizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
};

// Hàm chuẩn hóa chuỗi để so sánh tên
const normalizeString = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const TourInfoPage = () => {
  const [tourInfo, setTourInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [itineraries, setItineraries] = useState([]);
  const [suggestions, setSuggestions] = useState('');
  const [activeDay, setActiveDay] = useState(null);
  const [showError, setShowError] = useState(false);
  const contentRefs = useRef({});

  // Hàm tính số ngày còn lại đến ngày khởi hành
  const calculateDaysLeft = (departureDate) => {
    const currentDate = new Date();
    const [day, month, year] = departureDate.split('/');
    const depDate = new Date(`${year}-${month}-${day}`);
    const timeDiff = depDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  // Hàm format ngày
  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    if (typeof dateInput === 'string') {
      const parsedDate1 = moment(dateInput, 'YYYY-MM-DD');
      if (parsedDate1.isValid()) return parsedDate1.format('DD/MM/YYYY');
      
      const parsedDate2 = moment(dateInput, 'DD/MM/YYYY');
      if (parsedDate2.isValid()) return parsedDate2.format('DD/MM/YYYY');
      
      return 'N/A';
    }
    
    if (dateInput instanceof Date) {
      return moment(dateInput).format('DD/MM/YYYY');
    }
    
    return 'N/A';
  };

  // Hàm lấy lịch trình tour
  const fetchItineraries = async (tourId) => {
    try {
      const response = await axios.get(`/api/tours/${tourId}/itineraries`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy lịch trình:', error);
      return [];
    }
  };

  // Hàm xử lý khi khách hàng nhập thông tin và kiểm tra
  const onFinish = async (values) => {
    try {
      // Kiểm tra email hợp lệ trước khi gửi request
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(values.customerEmail)) {
        message.error('Email không hợp lệ!');
        return;
      }

      setLoading(true);
      const response = await axios.get('/api/orders');
      if (!response.data) {
        message.error('Không tìm thấy dữ liệu từ server!');
        setTourInfo(null);
        return;
      }

      const orders = response.data;
      const matchedOrder = orders.find((order) => 
        order.tour_code === values.tourCode &&
        order.customers.some(c => 
          c.phone === values.customerPhone &&
          c.email === values.customerEmail &&
          c.full_name === values.customerName
        )
      );

      if (!matchedOrder) {
        message.error('Không tìm thấy thông tin tour phù hợp!');
        setTourInfo(null);
        return;
      }

      const orderDetailResponse = await axios.get(`/api/orders/${matchedOrder.id}`);
      if (!orderDetailResponse.data) {
        message.error('Không tìm thấy chi tiết đơn hàng!');
        setTourInfo(null);
        return;
      }

      const orderDetail = orderDetailResponse.data;
      const leadCustomer = orderDetail.customers.find((c) => c.traveler_type === 'Lead');

      // Lấy thông tin tour chi tiết để lấy suggestions
      const tourDetailResponse = await axios.get(`/api/tours/${matchedOrder.tour_id}`);
      const tourDetail = tourDetailResponse.data;

      // Lấy lịch trình tour
      const tourItineraries = await fetchItineraries(matchedOrder.tour_id);

      const tourData = {
        tourCode: orderDetail.tour_code || 'N/A',
        bookingCode: orderDetail.id.toString(),
        customerName: leadCustomer?.full_name || 'N/A',
        customerPhone: leadCustomer?.phone || 'N/A',
        customerDob: formatDate(leadCustomer?.birth_date),
        customerEmail: leadCustomer?.email || 'N/A',
        departureDate: formatDate(orderDetail.start_date),
        returnDate: formatDate(orderDetail.end_date),
        tourName: orderDetail.tour_name || 'N/A',
        price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail.total_amount),
        status: orderDetail.status === 'confirmed' ? 'Đã thanh toán' : 'Chưa thanh toán',
        tourId: matchedOrder.tour_id,
        companions: orderDetail.customers
          .filter((c) => c.traveler_type !== 'Lead')
          .map((c) => ({
            full_name: c.full_name,
            birth_date: c.birth_date,
            phone: c.phone || 'N/A',
            email: c.email || 'N/A',
          })),
      };

      setTourInfo(tourData);
      setItineraries(tourItineraries);
      setSuggestions(tourDetail.suggestions || 'Không có gợi ý');
      message.success('Xác minh thành công!');

    } catch (error) {
      console.error('Lỗi khi tra cứu thông tin tour:', error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi click vào ngày trong lịch trình
  const handleDayClick = (dayNumber) => {
    if (activeDay === dayNumber) {
      setActiveDay(null); // Đóng nếu đang mở
    } else {
      setActiveDay(dayNumber); // Mở nếu đang đóng
    }
  };

  // Render lịch trình với chức năng mở rộng
  const renderItineraries = () => {
    if (itineraries.length === 0) {
      return <Text type="secondary">Không có thông tin lịch trình</Text>;
    }

    return (
      <div className="itinerary-container">
        {itineraries.map((item) => {
          // Xử lý dữ liệu details - chuyển từ mảng hoặc chuỗi JSON thành mảng các chuỗi
          let detailsArray = [];
          
          if (Array.isArray(item.details)) {
            // Nếu details là mảng, sử dụng trực tiếp
            detailsArray = item.details;
          } else if (typeof item.details === 'string') {
            // Nếu details là chuỗi JSON, parse thành mảng
            try {
              detailsArray = JSON.parse(item.details);
              if (!Array.isArray(detailsArray)) {
                detailsArray = [item.details];
              }
            } catch (e) {
              detailsArray = [item.details];
            }
          }

          return (
            <div key={item.day_number} className="itinerary-day">
              <div 
                className="itinerary-day-header"
                onClick={() => handleDayClick(item.day_number)}
                style={{
                  cursor: 'pointer',
                  padding: '12px 16px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Text strong style={{ fontSize: '16px' }}>
                  Ngày {item.day_number}: {item.title}
                </Text>
                {activeDay === item.day_number ? <UpOutlined /> : <DownOutlined />}
              </div>
              
              {activeDay === item.day_number && (
                <div className="itinerary-day-content" style={{ padding: '16px', backgroundColor: '#fff', borderRadius: '4px', marginBottom: '16px' }}>
                  {detailsArray.length > 0 ? (
                    <List
                      dataSource={detailsArray}
                      renderItem={(detail, idx) => (
                        <List.Item key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                          <div style={{ display: 'flex', whiteSpace: 'pre-line' }}>
                            <div style={{ marginRight: '8px' }}>•</div>
                            <div>{typeof detail === 'string' ? detail : JSON.stringify(detail)}</div>
                          </div>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Text type="secondary">Không có chi tiết hoạt động</Text>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Render gợi ý 
  const renderSuggestions = () => {
    return (
      <div style={{ whiteSpace: 'pre-line', padding: 16 }}>
        {suggestions}
      </div>
    );
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <Spin spinning={loading}>
        <Title level={2} style={{ textAlign: 'center', color: '#fe7100' }}>
          Tra cứu thông tin đặt tour
        </Title>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          style={{ marginBottom: '20px', maxWidth: '800px', margin: '0 auto' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Mã tour"
                name="tourCode"
                rules={[{ required: true, message: 'Vui lòng nhập mã tour!' }]}
              >
                <Input placeholder="Nhập mã tour" size="large" prefix={<SearchOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tên người đặt"
                name="customerName"
                rules={[{ required: true, message: 'Vui lòng nhập tên người đặt!' }]}
              >
                <Input placeholder="Nhập tên người đặt" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="customerPhone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input placeholder="Nhập số điện thoại" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="customerEmail"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="Nhập email" size="large" />
              </Form.Item>
            </Col>
          </Row>  
          
          {showError && (
            <div style={{ 
              color: '#ff4d4f', 
              textAlign: 'center', 
              marginBottom: '16px',
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              Thông tin chưa chính xác, vui lòng kiểm tra lại
            </div>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{ 
                backgroundColor: '#fa8c16', 
                borderColor: '#fa8c16',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                height: '48px',
                fontSize: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d46b08';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fa8c16';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Kiểm tra
            </Button>
          </Form.Item>
        </Form>

        {tourInfo && (
          <Card
            title="Chi tiết đặt tour"
            bordered={false}
            style={{
              marginTop: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px',
            }}
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="Thông tin chung" key="1">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Mã tour">{tourInfo.tourCode}</Descriptions.Item>
                  <Descriptions.Item label="Tên tour">{tourInfo.tourName}</Descriptions.Item>
                  <Descriptions.Item label="Người đặt">{tourInfo.customerName}</Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">{tourInfo.customerPhone}</Descriptions.Item>
                  <Descriptions.Item label="Email">{tourInfo.customerEmail}</Descriptions.Item>
                  <Descriptions.Item label="Ngày khởi hành">{tourInfo.departureDate}</Descriptions.Item>
                  <Descriptions.Item label="Ngày kết thúc">{tourInfo.returnDate}</Descriptions.Item>
                  <Descriptions.Item label="Tổng giá">{tourInfo.price}</Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    <Tag color={tourInfo.status === 'Đã thanh toán' ? 'green' : 'red'}>
                      {tourInfo.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Số ngày còn lại">
                    {calculateDaysLeft(tourInfo.departureDate)} ngày
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>

              <TabPane tab="Thông tin người đi cùng" key="2">
                <Table 
                  columns={[
                    {
                      title: 'Họ tên',
                      dataIndex: 'full_name',
                      key: 'full_name',
                      align: 'center',
                    },
                    {
                      title: 'Ngày sinh',
                      dataIndex: 'birth_date',
                      key: 'birth_date',
                      align: 'center',
                      render: (date) => formatDate(date),
                    },
                    {
                      title: 'Số điện thoại',
                      dataIndex: 'phone',
                      key: 'phone',
                      align: 'center',
                    },
                    {
                      title: 'Email',
                      dataIndex: 'email',
                      key: 'email',
                      align: 'center',
                      render: (email) => email || 'N/A',
                    },
                  ]} 
                  dataSource={tourInfo.companions} 
                  pagination={false} 
                  bordered 
                  style={{ marginTop: 16 }}
                />
              </TabPane>

              <TabPane tab="Lịch trình" key="3">
                <div style={{ marginTop: 16 }}>
                  <Title level={4} style={{ marginBottom: 16 }}>Lịch trình tour</Title>
                  {renderItineraries()}
                </div>
              </TabPane>

              <TabPane tab="Gợi ý" key="4">
                <div style={{ marginTop: 16 }}>
                  <Title level={4} style={{ marginBottom: 16 }}>Gợi ý khi tham gia tour</Title>
                  {renderSuggestions()}
                </div>
              </TabPane>
            </Tabs>
          </Card>
        )}
      </Spin>
    </div>
  );
};

export default TourInfoPage;