import { useState, useEffect, useRef } from "react";
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

const TourDetail = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  // Gọi API để lấy dữ liệu tour
  useEffect(() => {
    const fetchTourData = async () => {
      try {
        setLoading(true);
        // Giả lập gọi API (thay thế bằng API thật của bạn)
        const response = await fetch("/api/tours/3"); // Ví dụ: API endpoint cho tour có id=3
        const data = await response.json();
        setTourData(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, []);

  // Dữ liệu giả lập (dùng tạm nếu chưa có API thật)
  const mockData = {
    tour: {
      id: 3,
      name: "Tour Phan Thiết - Mũi Né",
      start_date: "2025-05-15",
      status: "active",
      days: 3,
      nights: 2,
      transportation: "XE KHÁCH",
      departure_point: "TP HCM",
      tour_code: "PTMN789",
      star_rating: 3,
      highlights: [
        "Khám phá đồi cát bay Mũi Né",
        "Tham quan Làng Chài Mũi Né",
        "Thư giãn tại bãi biển Phan Thiết"
      ],
      itinerary: [
        { day: "NGÀY 1", title: "TP.HCM - PHAN THIẾT" },
        { day: "NGÀY 2", title: "PHAN THIẾT - MŨI NÉ - ĐỒI CÁT BAY" },
        { day: "NGÀY 3", title: "MŨI NÉ - TP.HCM" }
      ]
    },
    images: [
      { id: 3, tour_id: 3, image_url: "images/images_tour/anh_tour_viet_nam/bau-trang-3808-8465.jpeg", caption: "Bàu Trắng - Mũi Né" },
      { id: 4, tour_id: 3, image_url: "images/images_tour/anh_tour_viet_nam/phan-thiet.jpg", caption: "Cảnh đẹp Phan Thiết" },
      { id: 5, tour_id: 3, image_url: "images/images_tour/anh_tour_viet_nam/mui-ne.jpeg", caption: "Làng chài Mũi Né" },
      { id: 6, tour_id: 3, image_url: "images/images_tour/anh_tour_viet_nam/bai-bien-dep-o-mui-ne-phan-thiet_grande.jpeg", caption: "Bãi biển đẹp ở Mũi Né - Phan Thiết" }
    ],
    itineraryDetails: [
      { id: 8, tour_id: 3, day: 1, title: "TP.HCM - PHAN THIẾT", details: ["Sáng: Khởi hành từ TP.HCM đến Phan Thiết bằng xe khách", "Chiều: Nhận phòng khách sạn, nghỉ ngơi và tự do tắm biển tại bãi biển Phan Thiết"] },
      { id: 9, tour_id: 3, day: 2, title: "PHAN THIẾT - MŨI NÉ - ĐỒI CÁT BAY", details: ["Sáng: Tham quan Làng Chài Mũi Né, khám phá cuộc sống ngư dân", "Trưa: Ăn trưa với hải sản tươi sống tại Mũi Né", "Chiều: Khám phá Đồi Cát Bay, trải nghiệm trượt cát"] },
      { id: 10, tour_id: 3, day: 3, title: "MŨI NÉ - TP.HCM", details: ["Sáng: Tự do tắm biển và mua sắm đặc sản tại chợ Phan Thiết", "Chiều: Khởi hành về TP.HCM, kết thúc tour"] }
    ],
    viewedTours: [
      { id: 1, name: "Tour Hà Nội - Sapa", image: "images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg", price: "2.500.000 VND", rating: 4.5 },
      { id: 2, name: "Tour Đà Nẵng - Hội An", image: "images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg", price: "3.000.000 VND", rating: 4.7 }
    ],
    relatedTours: [
      { id: 1, name: "Tour Nha Trang - Đà Lạt", image: "images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg", price: "2.800.000 VND", rating: 4.6 },
      { id: 2, name: "Tour Phú Quốc", image: "images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg", price: "4.500.000 VND", rating: 4.8 }
    ]
  };

  // Sử dụng dữ liệu từ API hoặc dữ liệu giả lập
  const data = tourData || mockData;

  // Dữ liệu tour
  const tourInfo = {
    title: data.tour.name,
    duration: `${data.tour.days} NGÀY ${data.tour.nights} ĐÊM`,
    departureDate: data.tour.start_date,
    transportation: data.tour.transportation,
    departurePoint: data.tour.departure_point,
    tourCode: data.tour.tour_code,
    highlights: data.tour.highlights,
  };

  // Dữ liệu ảnh
  const tourImages = data.images.map((img) => img.image_url);

  // Dữ liệu lịch trình (kết hợp itinerary và itineraryDetails)
  const itinerary = data.tour.itinerary.map((day, index) => {
    const details = data.itineraryDetails.find((item) => item.day === (index + 1)) || { details: [] };
    return {
      day: day.day,
      content: `
        <p><strong>${day.title}</strong></p>
        ${details.details.map((detail) => `<p>${detail}</p>`).join("")}
      `,
    };
  });

  // Dữ liệu bảng giá (giữ nguyên như code gốc)
  const priceInclusions = [
    "Vận chuyển: Xe tham quan (16, 29, 35, 45 chỗ tùy theo số lượng) đón - tiễn và phục vụ theo chương trình.",
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

  // Dữ liệu tour đã xem và tour liên quan
  const viewedTours = data.viewedTours;
  const relatedTours = data.relatedTours;

  // Quy định hủy tour (giữ nguyên như code gốc)
  const cancellationPolicy = (
    <div style={{ lineHeight: "1.8" }}>
      <Title level={4}>Quy định thanh toán, hủy vé</Title>
      <List
        dataSource={[
          "Sau khi đăng ký, thanh toán ít nhất 50% tiền cọc và đóng hết 100% trước khởi hành 10 ngày.",
          "Khi đến ngày thanh toán đủ 100% tổng giá trị tiền tour, nếu Quý khách không thanh toán đúng hạn và đúng số tiền được xem như Quý khách tự ý huỷ tour và mất hết số tiền đã đặt cọc giữ chỗ.",
          "Vé xe khách được xuất ngay sau khi quý khách đăng ký, thanh toán, xác nhận thông tin cá nhân (họ tên, ngày tháng năm sinh…) và có những điều kiện vé như sau: Không được đổi tên, hoàn vé, hủy vé, thay đổi ngày, thay đổi hành trình."
        ]}
        renderItem={(item) => <List.Item>- {item}</List.Item>}
      />
      <Title level={5}>Phí hủy tour:</Title>
      <List
        dataSource={[
          "Ngay sau khi đặt cọc hoặc thanh toán hoặc trước 15 ngày: mất 30% giá tour.",
          "Hủy từ 10 đến trước 8 ngày trước ngày khởi hành: chịu phí 50% giá tour.",
          "Hủy từ 8 đến 6 ngày trước ngày khởi hành: chịu phí 70% giá tour.",
          "Hủy từ 5 ngày trước ngày khởi hành: chịu phí 100% giá tour.",
          "Trường hợp quý khách đến trễ giờ khởi hành được tính là hủy 5 ngày trước ngày khởi hành."
        ]}
        renderItem={(item) => <List.Item>- {item}</List.Item>}
      />
      <Title level={5}>Thông báo hủy tour:</Title>
      <List
        dataSource={[
          "Việc huỷ bỏ chuyến đi phải được thông báo trực tiếp với Công ty hoặc qua fax, email, tin nhắn và phải được Công ty xác nhận. Việc huỷ bỏ bằng điện thoại không được chấp nhận."
        ]}
        renderItem={(item) => <List.Item>- {item}</List.Item>}
      />
      <Title level={5}>Điều kiện khởi hành:</Title>
      <List
        dataSource={[
          "Do tính chất là đoàn ghép khách lẻ, Du Lịch Việt sẽ có trách nhiệm nhận khách đăng ký cho đủ đoàn (10 khách người lớn trở lên) thì đoàn sẽ khởi hành đúng lịch trình. Nếu số lượng đoàn dưới 10 khách, công ty có trách nhiệm thông báo cho khách trước ngày khởi hành 3 ngày và sẽ thỏa thuận lại ngày khởi hành mới hoặc hoàn trả toàn bộ số tiền đã đặt cọc tour."
        ]}
        renderItem={(item) => <List.Item>- {item}</List.Item>}
      />
      <Title level={5}>Lưu ý khác:</Title>
      <List
        dataSource={[
          "Các ngày đặt cọc, thanh toán, huỷ và dời tour: không tính thứ 7, Chủ Nhật.",
          "Trong những trường hợp bất khả kháng như: khủng bố, bạo động, thiên tai, lũ lụt… Tuỳ theo tình hình thực tế và sự thuận tiện, an toàn của khách hàng, công ty Du Lịch sẽ chủ động thông báo cho khách hàng sự thay đổi như sau: huỷ hoặc thay thế bằng một chương trình mới với chi phí tương đương chương trình tham quan trước đó. Trong trường hợp chương trình mới có phát sinh thì Khách hàng sẽ thanh toán khoản phát sinh này. Tuy nhiên, mỗi bên có trách nhiệm cố gắng tối đa, giúp đỡ bên bị thiệt hại nhằm giảm thiểu các tổn thất gây ra vì lý do bất khả kháng.",
          "Đối với sự thay đổi lịch trình do lỗi của hãng xe khách, Du Lịch Việt sẽ không chịu trách nhiệm bất kỳ phát sinh nào do lỗi trên như: phát sinh bữa ăn, nhà hàng, khách sạn, phương tiện di chuyển, hướng dẫn viên, …."
        ]}
        renderItem={(item) => <List.Item>- {item}</List.Item>}
      />
    </div>
  );

  const next = () => {
    carouselRef.current.next();
  };

  const prev = () => {
    carouselRef.current.prev();
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

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
              <div className="carousel-arrow prev-arrow" onClick={prev}>
                <LeftOutlined />
              </div>
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
                {cancellationPolicy}
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
                style={{ background: "#ff8c00", color: "#fff", borderColor: "#ff8c00", textDecoration: "none" }}
                href="/thanh-toan"
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
        <Title level={3} style={{ marginTop: 12 }}>Tours liên quan</Title>
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

export default TourDetail;