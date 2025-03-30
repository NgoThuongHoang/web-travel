import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
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
  Spin,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  StarOutlined,
  LeftOutlined,
  RightOutlined,
  SunOutlined,
  CoffeeOutlined,
  CloudOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import '../styles/TourDetailPage.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const mockViewedTours = [
  {
    id: 1,
    name: "Tour Hà Nội - Sapa",
    image: "/images/images_tour/anh_tour_viet_nam/ban-cat-cat-4139-1775.jpg",
    price: "2.500.000 VND",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Tour Đà Nẵng - Hội An",
    image: "/images/images_tour/anh_tour_viet_nam/hoi-an.jpg",
    price: "3.000.000 VND",
    rating: 4.7,
  },
];

const mockRelatedTours = [
  {
    id: 1,
    name: "Tour Nha Trang - Đà Lạt",
    image: "/images/images_tour/anh_tour_viet_nam/nha-trang-dalat.jpg",
    price: "2.800.000 VND",
    rating: 4.6,
  },
  {
    id: 2,
    name: "Tour Phú Quốc",
    image: "/images/images_tour/anh_tour_viet_nam/phu-quoc.jpg",
    price: "4.500.000 VND",
    rating: 4.8,
  },
];

const TourDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  const [tourData, setTourData] = useState(null);
  const [itineraryDetails, setItineraryDetails] = useState([]);
  const [viewedTours, setViewedTours] = useState([]);
  const [relatedTours, setRelatedTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setImageLoadErrors([]);

        // Lấy dữ liệu tour
        const tourResponse = await fetch(`http://localhost:5001/api/tours/${id}`);
        if (!tourResponse.ok) {
          throw new Error("Không thể lấy dữ liệu tour");
        }
        const tourData = await tourResponse.json();
        console.log("Dữ liệu từ API:", tourData);

        // Parse highlights nếu là chuỗi
        if (tourData.highlights && typeof tourData.highlights === "string") {
          try {
            tourData.highlights = JSON.parse(tourData.highlights);
          } catch (err) {
            console.error("Lỗi parse highlights:", err);
            tourData.highlights = [];
          }
        }
        setTourData(tourData);

        // Lấy dữ liệu lịch trình
        try {
          const itineraryResponse = await fetch(`http://localhost:5001/api/tours/${id}/itineraries`);
          if (!itineraryResponse.ok) {
            throw new Error("Không thể lấy dữ liệu lịch trình");
          }
          const itineraryData = await itineraryResponse.json();
          const parsedItineraryData = itineraryData.map(item => {
            let detailsObject = { Sáng: "", Trưa: "", Chiều: "", Tối: "" };

            if (item.details && typeof item.details === "string") {
              try {
                const detailsArray = JSON.parse(item.details);
                if (Array.isArray(detailsArray)) {
                  detailsArray.forEach(detail => {
                    if (typeof detail === "string") {
                      if (detail.startsWith("Sáng:")) {
                        detailsObject.Sáng = detail.replace("Sáng:", "").trim();
                      } else if (detail.startsWith("Trưa:")) {
                        detailsObject.Trưa = detail.replace("Trưa:", "").trim();
                      } else if (detail.startsWith("Chiều:")) {
                        detailsObject.Chiều = detail.replace("Chiều:", "").trim();
                      } else if (detail.startsWith("Tối:")) {
                        detailsObject.Tối = detail.replace("Tối:", "").trim();
                      }
                    }
                  });
                }
              } catch (err) {
                console.error("Lỗi parse details:", err);
                return { ...item, details: detailsObject };
              }
            } else if (Array.isArray(item.details)) {
              item.details.forEach(detail => {
                if (typeof detail === "string") {
                  if (detail.startsWith("Sáng:")) {
                    detailsObject.Sáng = detail.replace("Sáng:", "").trim();
                  } else if (detail.startsWith("Trưa:")) {
                    detailsObject.Trưa = detail.replace("Trưa:", "").trim();
                  } else if (detail.startsWith("Chiều:")) {
                    detailsObject.Chiều = detail.replace("Chiều:", "").trim();
                  } else if (detail.startsWith("Tối:")) {
                    detailsObject.Tối = detail.replace("Tối:", "").trim();
                  }
                }
              });
            }

            return { ...item, details: detailsObject };
          });
          setItineraryDetails(parsedItineraryData);
        } catch (err) {
          console.warn("Không thể lấy dữ liệu lịch trình:", err.message);
          setItineraryDetails([]);
        }

        // Lấy dữ liệu tour đã xem
        try {
          const viewedToursResponse = await fetch("http://localhost:5001/api/tours/viewed");
          if (!viewedToursResponse.ok) {
            throw new Error("Không thể lấy dữ liệu tour đã xem");
          }
          const viewedToursData = await viewedToursResponse.json();
          setViewedTours(viewedToursData);
        } catch (err) {
          console.warn("Không thể lấy dữ liệu tour đã xem, sử dụng dữ liệu ảo:", err.message);
          setViewedTours(mockViewedTours);
        }

        // Lấy dữ liệu tour liên quan
        try {
          const relatedToursResponse = await fetch("http://localhost:5001/api/tours/related");
          if (!relatedToursResponse.ok) {
            throw new Error("Không thể lấy dữ liệu tour liên quan");
          }
          const relatedToursData = await relatedToursResponse.json();
          setRelatedTours(relatedToursData);
        } catch (err) {
          console.warn("Không thể lấy dữ liệu tour liên quan, sử dụng dữ liệu ảo:", err.message);
          setRelatedTours(mockRelatedTours);
        }

      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Spin tip="Đang tải dữ liệu..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!tourData) {
    return <div>Không tìm thấy dữ liệu tour.</div>;
  }

  const tourInfo = {
    title: tourData.name || "Không có tiêu đề",
    duration: tourData.days && tourData.nights
      ? `${tourData.days} NGÀY ${tourData.nights} ĐÊM`
      : "Không xác định",
    departureDate: tourData.start_date
      ? new Date(tourData.start_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : "Không xác định",
    transportation: tourData.transportation || "Không xác định",
    departurePoint: tourData.departure_point || "Không xác định",
    tourCode: tourData.tour_code || "Không có mã tour",
    highlights: Array.isArray(tourData.highlights) ? tourData.highlights : [],
    suggestions: tourData.suggestions || [],
  };

  const tourImages = tourData.images && Array.isArray(tourData.images)
    ? tourData.images
        .map((img) => {
          let imageUrl = img.image_url;
          if (imageUrl.startsWith('http://localhost:5001')) {
            imageUrl = imageUrl.replace('http://localhost:5001', '');
          }
          return imageUrl;
        })
        .filter(Boolean)
        .slice(0, 10)
    : [];

  // Chuẩn bị dữ liệu lịch trình
  const itinerary = itineraryDetails.map((day, index) => ({
    day: `NGÀY ${day.day_number}`,
    title: day.title || "Không có tiêu đề",
    details: day.details || { Sáng: "", Trưa: "", Chiều: "", Tối: "" },
  }));

  const priceColumns = [
    { title: "Nhóm tuổi", dataIndex: "age_group", key: "age_group" },
    { title: "Giá", dataIndex: "price", key: "price" },
    { title: "Phụ thu phòng đơn", dataIndex: "single_room_price", key: "single_room_price" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
  ];

  const priceData = tourData.prices && Array.isArray(tourData.prices)
    ? tourData.prices.map((price, index) => {
        const ageGroupMap = {
          "Under 5": "Dưới 5 tuổi",
          "5-11": "Từ 5 - 11 tuổi",
          "Adult": "Người lớn",
        };
        const ageGroup = price.age_group ? price.age_group.trim() : "Không xác định";
        const displayAgeGroup = ageGroupMap[ageGroup] || ageGroup;

        let displayPrice;
        if (displayAgeGroup === "Dưới 5 tuổi" && parseFloat(price.price) === 0) {
          displayPrice = "Miễn phí";
        } else {
          displayPrice = price.price != null ? `${parseFloat(price.price).toLocaleString('vi-VN')} VND` : "Liên hệ";
        }

        return {
          key: index + 1,
          age_group: displayAgeGroup,
          price: displayPrice,
          single_room_price: price.single_room_price != null ? `${parseFloat(price.single_room_price).toLocaleString('vi-VN')} VND` : "Không có",
          description: price.description || "Không có mô tả",
        };
      })
    : [];

  const priceExclusions = [
    "Tiền tip cho HDV và lái xe",
    "Phụ thu phòng đơn: 1.200.000đ/khách",
    "Các chi phí cá nhân khác ngoài chương trình",
    "Thuế VAT",
  ];

  const exclusionData = priceExclusions.map((item, index) => ({
    key: index + 1,
    service: `Dịch vụ ${index + 1}`,
    detail: item,
  }));

  const exclusionColumns = [
    { title: "Dịch vụ", dataIndex: "service", key: "service" },
    { title: "Chi tiết", dataIndex: "detail", key: "detail" },
  ];

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

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadCrumbs">
        <div className="center">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a className="text-decoration-none" href="/"><span>Trang chủ</span></a>
            </li>
            <li className="breadcrumb-item active">
              <span>Thông tin chuyến đi</span>
            </li>
          </ol>
        </div>
      </div>

      <Layout className="tour-detail-page">
        <Header className="tour-header">
          <Title level={2}>{tourInfo.title}</Title>
        </Header>
        <Content className="tour-content">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <div className="carousel-container">
                {tourImages.length > 0 ? (
                  <>
                    <Carousel autoplay ref={carouselRef}>
                      {tourImages.map((image, index) => (
                        <div key={index}>
                          <img
                            src={image}
                            alt={`Ảnh tour ${index + 1}`}
                            style={{ width: "100%", height: "auto" }}
                            onError={(e) => {
                              console.error(`Failed to load image: ${image}`);
                              setImageLoadErrors((prev) => [...prev, image]);
                              e.target.src = "/placeholder.svg";
                            }}
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
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Text>Không có ảnh cho tour này.</Text>
                  </div>
                )}
                {imageLoadErrors.length > 0 && (
                  <div style={{ textAlign: "center", padding: "10px", color: "red" }}>
                    <Text>Có {imageLoadErrors.length} ảnh không tải được. Vui lòng kiểm tra đường dẫn ảnh hoặc server.</Text>
                    <ul>
                      {imageLoadErrors.slice(0, 5).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {imageLoadErrors.length > 5 && <li>...và {imageLoadErrors.length - 5} ảnh khác</li>}
                    </ul>
                  </div>
                )}
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
                  {itinerary.length > 0 ? (
                    <Timeline>
                      {itinerary.map((day, index) => (
                        <Timeline.Item key={index}>
                          <Title level={4}>
                            {day.day}: {day.title.toUpperCase()}
                          </Title>
                          {day.details && (
                            <div style={{ lineHeight: "1.8" }}>
                              {day.details.Sáng && (
                                <div style={{ marginBottom: 12 }}>
                                  <Text strong>
                                    <SunOutlined style={{ marginRight: 8, color: "#fadb14" }} />
                                    Buổi sáng:
                                  </Text>
                                  <br />
                                  <Text style={{ marginLeft: 24 }}>{day.details.Sáng}</Text>
                                </div>
                              )}
                              {day.details.Trưa && (
                                <div style={{ marginBottom: 12 }}>
                                  <Text strong>
                                    <CoffeeOutlined style={{ marginRight: 8, color: "#d46b08" }} />
                                    Buổi trưa:
                                  </Text>
                                  <br />
                                  <Text style={{ marginLeft: 24 }}>{day.details.Trưa}</Text>
                                </div>
                              )}
                              {day.details.Chiều && (
                                <div style={{ marginBottom: 12 }}>
                                  <Text strong>
                                    <CloudOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                                    Buổi chiều:
                                  </Text>
                                  <br />
                                  <Text style={{ marginLeft: 24 }}>{day.details.Chiều}</Text>
                                </div>
                              )}
                              {day.details.Tối && (
                                <div style={{ marginBottom: 12 }}>
                                  <Text strong>
                                    <MoonOutlined style={{ marginRight: 8, color: "#722ed1" }} />
                                    Buổi tối:
                                  </Text>
                                  <br />
                                  <Text style={{ marginLeft: 24 }}>{day.details.Tối}</Text>
                                </div>
                              )}
                              {!day.details.Sáng && !day.details.Trưa && !day.details.Chiều && !day.details.Tối && (
                                <Text>Không có chi tiết lịch trình cho ngày này.</Text>
                              )}
                            </div>
                          )}
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  ) : (
                    <Text>Không có lịch trình chi tiết cho tour này.</Text>
                  )}
                </TabPane>

                <TabPane tab="Bảng giá" key="2">
                  <Card title="Giá tour">
                    {priceData.length > 0 ? (
                      <Table
                        columns={priceColumns}
                        dataSource={priceData.filter(p => p.age_group !== "Không xác định")}
                        pagination={false}
                        bordered
                      />
                    ) : (
                      <Text>Giá tour: Liên hệ</Text>
                    )}
                  </Card>
                  <Card title="Giá tour không bao gồm" style={{ marginTop: 16 }}>
                    <Table columns={exclusionColumns} dataSource={exclusionData} pagination={false} bordered />
                  </Card>
                </TabPane>

                <TabPane tab="Ngày khởi hành" key="3">
                  <p>Ngày khởi hành: {tourInfo.departureDate}</p>
                </TabPane>

                <TabPane tab="Quy định" key="4">
                  {cancellationPolicy}
                </TabPane>

                <TabPane tab="Gợi ý chuyến đi" key="5">
                  {tourInfo.suggestions}
                </TabPane>
              </Tabs>
            </Col>

            <Col xs={24} lg={8}>
              <Card className="booking-card">
                <Title level={3} className="tour-price-title">
                  Giá tour: <span className="tour-price-value">
                    {priceData.length > 0 ? (
                      (() => {
                        const adultPrice = priceData.find(p => p.age_group === "Người lớn");
                        return adultPrice ? adultPrice.price : "Liên hệ";
                      })()
                    ) : "Liên hệ"}
                  </span>
                </Title>
                <Button
                  type="default"
                  size="large"
                  block
                  style={{ background: "#ff8c00", color: "#fff", borderColor: "#ff8c00" }}
                >
                  Gửi yêu cầu tư vấn
                </Button>
                <Divider />
                <Title level={4} className="highlights-title">Điểm nổi bật:</Title>
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
                  href={`/thanh-toan?tourId=${tourData.id}`} // Truyền tourId qua query string
                >
                  Đặt tour
                </Button>
                <Divider />
              </Card>

              <Card title="Tours đã xem" style={{ marginTop: 16 }}>
                {viewedTours.length > 0 ? (
                  <List
                    dataSource={viewedTours}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar src={item.image || "/placeholder.svg"} />}
                          title={<a href="#" className="viewed-tour-link">{item.name}</a>}
                          description={
                            <>
                              <Text strong>{item.price || "Liên hệ"}</Text>
                              <br />
                              <Text>
                                <StarOutlined /> {item.rating || "Chưa có đánh giá"}
                              </Text>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text>Chưa có tour nào được xem.</Text>
                )}
              </Card>
            </Col>
          </Row>
          <Title level={3} style={{ marginTop: 12 }}>Tours liên quan</Title>
          {relatedTours.length > 0 ? (
            <Row gutter={[16, 16]}>
              {relatedTours.map((tour) => (
                <Col xs={24} sm={12} md={8} lg={6} key={tour.id}>
                  <Card
                    className="related-tour-card"
                    cover={<img alt={tour.name} src={tour.image || "/placeholder.svg"} />}
                  >
                    <Card.Meta
                      title={<a href="#" className="related-tour-link">{tour.name}</a>}
                      description={
                        <>
                          <Text strong>{tour.price || "Liên hệ"}</Text>
                          <br />
                          <Text>
                            <StarOutlined /> {tour.rating || "Chưa có đánh giá"}
                          </Text>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Text>Không có tour liên quan.</Text>
          )}
        </Content>
      </Layout>
    </>
  );
};

export default TourDetail;