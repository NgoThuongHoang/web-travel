import { useState, useRef } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Carousel,
  Tabs,
  Card,
  Button,
  List,
  Timeline,
  Divider,
  Table,
  Avatar,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  StarOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import '../styles/TourDetailPage.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const TourDetailPage = () => {
  const [activeTab, setActiveTab] = useState("1");
  const carouselRef = useRef(null);

  const tourImages = [
    "images/images_tour/anh_tour_viet_nam/chua-bai-dinh-2071-3727.png",
    "images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg",
    "images/images_tour/anh_tour_viet_nam/bao-tang-ho-chi-minh-2383-9999.jpg",
    "images/images_tour/anh_tour_viet_nam/dinh-fansipan-5826-8349.jpg",
  ];

  const tourInfo = {
    title: "HCM - Ninh Bình – Sapa",
    duration: "3 NGÀY",
    departureDate: "02/08",
    transportation: "MÁY BAY",
    departurePoint: "TP HCM",
    tourCode: "TRIPMIENBAC",
    highlights: [
      "Khám phá Thủ đô Hà Nội với: Văn Miếu Quốc Tử Giám, Quảng Trường Ba Đình, Bảo tàng Hồ Chí Minh, Nhà sàn, Chùa Một Cột.",
      "Thăm quan Vịnh Hạ Long - Kỳ quan thiên nhiên thế giới.",
      "Thưởng thức những món ăn đặc sản tươi ngon trên Du thuyền Hạ Long.",
      "Chòng chành non nước Ninh Bình di sản thế giới Bái Đính - Tràng An.",
      "Chiêm ngưỡng nét đẹp thơ mộng, trữ tình của Sapa, khám phá sắc màu văn hoá vùng cao.",
    ],
  };

  const itinerary = [
    {
      day: "NGÀY 1: TP.HỒ CHÍ MINH – HÀ NỘI – HẠ LONG",
      content: `
        <p><strong>Sáng:</strong></p>
        <p><strong>05h30:</strong> Nhân viên công ty đón đoàn tại sân bay Tân Sơn Nhất làm thủ tục bay đến Hà Nội.</p>
        <p><strong>08h30:</strong> Đến sân bay Nội Bài, xe và HDV đón đoàn khởi hành đi Hạ Long trên cao tốc Hà Nội - Hải Phòng - Hạ Long với chiều dài 175km. Cùng HDV khám phá các địa danh trên đường di chuyển.</p>
        <p><strong>12h00:</strong> Đến Hạ Long, đoàn di chuyển đến bến thuyền Tuần Châu, thưởng thức bữa cơm trưa trên du thuyền và bắt đầu hành trình tham quan <strong>Di sản Thiên nhiên Thế Giới tại Việt Nam:</strong></p>
        <p>- Tham quan <strong>Động Thiên Cung Động</strong> nằm trên đảo Đầu Gỗ (phía Tây Nam vịnh Hạ Long) ở độ cao khoảng 25m so với mực nước biển, cách cảng tàu du lịch chừng 4km. Hang động rộng gần 10.000m2 với cấu trúc phức tạp, bốn bề xung quanh được bao phủ bởi các bờ vách rất cao và những khối nhũ, măng đá với nhiều hình thù kì lạ.</p>
        <p><strong>16h00:</strong> Tàu về cập bến, đoàn di chuyển về khách sạn nhận phòng nghỉ ngơi. Tự do tắm biển Bãi Cháy.</p>
        <p><strong>Tối:</strong> Đoàn di chuyển đến nhà hàng dùng cơm tối. Tự do khám phá Hạ Long về đêm. Nghỉ đêm tại Hạ Long.</p>
      `,
    },
  ];

  const priceInclusions = [
    "Vận chuyển: Xe tham quan (16, 29, 35, 45 chỗ tùy theo số lượng) đón - tiễn và phục vụ theo chương trình.",
    "Vé máy bay khứ hồi 07 kg xách tay + 20 kg hành lý ký gửi/kiện.",
    "Khách sạn 3 sao tại các điểm đến",
    "Ăn uống: 04 bữa sáng tại khách sạn, 08 bữa ăn chính.",
    "Vé tham quan các điểm du lịch theo chương trình.",
    "Hướng dẫn viên tiếng Việt nhiệt tình, chu đáo",
    "Bảo hiểm du lịch (mức đền bù tối đa 20.000.000đ/trường hợp)",
    "Quà tặng: Nón du lịch, nước suối",
  ];

  const priceExclusions = [
    "Tiền tip cho HDV và lái xe",
    "Phụ thu phòng đơn: 1.200.000đ/khách",
    "Cáp treo Fansipan: 850.000đ/khách",
    "Vé xe điện khứ hồi Chùa Bái Đính: 60.000đ/khách",
    "Các chi phí cá nhân khác ngoài chương trình",
    "Thuế VAT",
  ];

  const priceColumns = [
    { title: "Dịch vụ", dataIndex: "service", key: "service" },
    { title: "Chi tiết", dataIndex: "detail", key: "detail" },
  ];

  const priceData = priceInclusions.map((item, index) => ({
    key: index + 1,
    service: `Dịch vụ ${index + 1}`,
    detail: item,
  }));

  const exclusionData = priceExclusions.map((item, index) => ({
    key: index + 1,
    service: `Dịch vụ ${index + 1}`,
    detail: item,
  }));

  const viewedTours = [
    {
      id: 1,
      name: "Tour Hà Nội - Sapa",
      image: "images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg",
      price: "2.500.000 VND",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Tour Đà Nẵng - Hội An",
      image: "images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg",
      price: "3.000.000 VND",
      rating: 4.7,
    },
  ];

  const relatedTours = [
    {
      id: 3,
      name: "Tour Nha Trang - Đà Lạt",
      image: "images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg",
      price: "2.800.000 VND",
      rating: 4.6,
    },
    {
      id: 4,
      name: "Tour Phú Quốc",
      image: "images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg",
      price: "4.500.000 VND",
      rating: 4.8,
    },
  ];

  const next = () => {
    carouselRef.current.next();
  };

  const prev = () => {
    carouselRef.current.prev();
  };

  return (
    <Layout className="tour-detail-page">
      <Header className="tour-header">
        <Title level={2}>{tourInfo.title}</Title>
      </Header>
      <Content className="tour-content">
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <div className="carousel-container">
              <Carousel autoplay ref={carouselRef}>
                {tourImages.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Ảnh tour ${index + 1}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                ))}
              </Carousel>
              {/* Nút mũi tên trái dạng chữ nhật */}
              <div className="carousel-arrow prev-arrow" onClick={prev}>
                <LeftOutlined />
              </div>
              {/* Nút mũi tên phải dạng chữ nhật */}
              <div className="carousel-arrow next-arrow" onClick={next}>
                <RightOutlined />
              </div>
            </div>

            <Card className="tour-info-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text>
                    <CalendarOutlined /> Thời gian: {tourInfo.duration}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <ClockCircleOutlined /> Khởi hành: {tourInfo.departureDate}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <TeamOutlined /> Phương tiện: {tourInfo.transportation}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text>
                    <EnvironmentOutlined /> Điểm khởi hành: {tourInfo.departurePoint}
                  </Text>
                </Col>
              </Row>
            </Card>

            <Tabs defaultActiveKey="1" onChange={setActiveTab} className="tour-tabs">
              <TabPane tab="Lịch trình" key="1">
                <Timeline>
                  {itinerary.map((day, index) => (
                    <Timeline.Item key={index}>
                      <Title level={4}>{day.day}</Title>
                      <div dangerouslySetInnerHTML={{ __html: day.content }} />
                    </Timeline.Item>
                  ))}
                </Timeline>
              </TabPane>
              <TabPane tab="Bảng giá" key="2">
                <Card title="Giá tour bao gồm">
                  <Table columns={priceColumns} dataSource={priceData} pagination={false} bordered />
                </Card>
                <Card title="Giá tour không bao gồm" style={{ marginTop: 16 }}>
                  <Table columns={priceColumns} dataSource={exclusionData} pagination={false} bordered />
                </Card>
              </TabPane>
              <TabPane tab="Ngày khởi hành" key="3">
                <p>Ngày khởi hành: {tourInfo.departureDate}</p>
              </TabPane>
              <TabPane tab="Quy định" key="4">
                <p>Các quy định về đặt tour và hủy tour sẽ được hiển thị ở đây.</p>
              </TabPane>
              <TabPane tab="Bình luận" key="5">
                <p>Phần bình luận Facebook sẽ được tích hợp ở đây.</p>
              </TabPane>
            </Tabs>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="booking-card">
              <Title level={3}>Giá tour: Liên hệ</Title>
              <Button
                type="default"
                size="large"
                block
                style={{ background: "#ff8c00", color: "#fff", borderColor: "#ff8c00" }}
              >
                Gửi yêu cầu tư vấn
              </Button>
              <Divider />
              <Title level={4}>Điểm nổi bật:</Title>
              <List
                dataSource={tourInfo.highlights}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
              <Button
                type="default"
                size="large"
                block
                style={{ background: "#ff8c00", color: "#fff", borderColor: "#ff8c00" }}
              >
                Đặt tour
              </Button>
              <Divider />
            </Card>

            <Card title="Tours đã xem" style={{ marginTop: 16 }}>
              <List
                dataSource={viewedTours}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} />}
                      title={<a href="#" className="viewed-tour-link">{item.name}</a>}
                      description={
                        <>
                          <Text strong>{item.price}</Text>
                          <br />
                          <Text>
                            <StarOutlined /> {item.rating}
                          </Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
        <Title level={3} style={{ marginTop: 12}}>Tours liên quan</Title>
        <Row gutter={[16, 16]}>
          {relatedTours.map((tour) => (
            <Col xs={24} sm={12} md={8} lg={6} key={tour.id}>
              <Card
                className="related-tour-card"
                cover={<img alt={tour.name} src={tour.image} />}
              >
                <Card.Meta
                  title={<a href="#" className="related-tour-link">{tour.name}</a>}
                  description={
                    <>
                      <Text strong>{tour.price}</Text>
                      <br />
                      <Text>
                        <StarOutlined /> {tour.rating}
                      </Text>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default TourDetailPage;